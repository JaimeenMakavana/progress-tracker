import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
} from "@google/generative-ai";
import {
  LLMService,
  LLMOptions,
  ModelInfo,
  JSONSchema,
} from "../../../types/ai";

export interface GeminiConfig {
  apiKey: string;
  model: "gemini-1.5-flash" | "gemini-1.5-pro" | "gemini-1.5-flash-8b";
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export class GeminiService implements LLMService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GeminiConfig;
  private isInitialized = false;

  constructor(config: GeminiConfig) {
    this.config = config;

    if (!config.apiKey) {
      throw new Error("Gemini API key is required");
    }

    try {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: config.model,
        generationConfig: {
          maxOutputTokens: config.maxOutputTokens || 2048,
          temperature: config.temperature || 0.7,
          topP: config.topP || 0.8,
          topK: config.topK || 40,
        },
      });
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Gemini service:", error);
      throw new Error(
        `Gemini initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateText(prompt: string, options?: LLMOptions): Promise<string> {
    if (!this.isInitialized) {
      throw new Error("Gemini service not initialized");
    }

    try {
      // Apply options if provided
      if (options) {
        const generationConfig: GenerationConfig = {};
        if (options.temperature !== undefined)
          generationConfig.temperature = options.temperature;
        if (options.maxTokens !== undefined)
          generationConfig.maxOutputTokens = options.maxTokens;
        if (options.topP !== undefined) generationConfig.topP = options.topP;
        if (options.topK !== undefined) generationConfig.topK = options.topK;

        if (Object.keys(generationConfig).length > 0) {
          this.model = this.genAI.getGenerativeModel({
            model: this.config.model,
            generationConfig: {
              ...this.model.generationConfig,
              ...generationConfig,
            },
          });
        }
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error) {
      console.error("Gemini API error:", error);

      // Handle specific Gemini errors
      if (error instanceof Error) {
        if (error.message.includes("API_KEY_INVALID")) {
          throw new Error("Invalid Gemini API key");
        } else if (error.message.includes("QUOTA_EXCEEDED")) {
          throw new Error("Gemini API quota exceeded");
        } else if (error.message.includes("SAFETY")) {
          throw new Error("Content blocked by Gemini safety filters");
        } else if (error.message.includes("RATE_LIMIT")) {
          throw new Error("Gemini API rate limit exceeded");
        }
      }

      throw new Error(
        `Gemini API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: JSONSchema,
    options?: LLMOptions
  ): Promise<T> {
    // Enhanced prompt for structured output
    const structuredPrompt = this.buildStructuredPrompt(prompt, schema);

    try {
      const response = await this.generateText(structuredPrompt, options);
      return this.parseStructuredResponse<T>(response, schema);
    } catch (error) {
      console.error("Gemini structured generation error:", error);
      throw new Error(
        `Failed to generate structured response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Note: Gemini doesn't have a separate embedding model
    // We'll use a workaround with the main model
    const embeddingPrompt = `Generate a semantic embedding for this text. Return only a JSON array of 768 numbers between -1 and 1: "${text}"`;

    try {
      const response = await this.generateText(embeddingPrompt);

      // Parse the embedding array
      const embedding = JSON.parse(response);
      if (Array.isArray(embedding) && embedding.length === 768) {
        return embedding;
      }

      // Fallback: return a zero vector
      console.warn(
        "Invalid embedding format from Gemini, returning zero vector"
      );
      return new Array(768).fill(0);
    } catch (error) {
      console.error("Gemini embedding error:", error);
      // Return a zero vector as fallback
      return new Array(768).fill(0);
    }
  }

  isAvailable(): boolean {
    return (
      this.isInitialized &&
      !!this.config.apiKey &&
      this.config.apiKey.length > 0
    );
  }

  getModelInfo(): ModelInfo {
    return {
      name: this.config.model,
      provider: "gemini",
      maxTokens: this.config.maxOutputTokens || 2048,
      supportsStructuredOutput: true,
      supportsEmbeddings: false, // We use a workaround
      costPer1kTokens: this.getCostPer1kTokens(),
    };
  }

  private buildStructuredPrompt(prompt: string, schema: JSONSchema): string {
    return `
${prompt}

IMPORTANT: Respond with ONLY a valid JSON object that matches this schema:
${JSON.stringify(schema, null, 2)}

Do not include any text before or after the JSON. The response must be valid JSON that can be parsed directly.
    `.trim();
  }

  private parseStructuredResponse<T>(text: string, _schema: JSONSchema): T {
    try {
      // Clean the response text
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Try to find JSON in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }

      // Fallback: try to parse the entire cleaned text
      return JSON.parse(cleanedText) as T;
    } catch (error) {
      console.error("Failed to parse structured response:", error);
      console.error("Raw response:", text);
      throw new Error("Failed to parse structured response from Gemini");
    }
  }

  private getCostPer1kTokens(): { input: number; output: number } {
    // Gemini 1.5 Flash pricing (as of 2024)
    const pricing = {
      "gemini-1.5-flash": { input: 0.000075, output: 0.0003 },
      "gemini-1.5-pro": { input: 0.00125, output: 0.005 },
      "gemini-1.5-flash-8b": { input: 0.0000375, output: 0.00015 },
    };

    return pricing[this.config.model] || pricing["gemini-1.5-flash"];
  }

  // Utility method to estimate token count (rough approximation)
  estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Utility method to estimate cost
  estimateCost(inputText: string, outputText: string): number {
    const inputTokens = this.estimateTokenCount(inputText);
    const outputTokens = this.estimateTokenCount(outputText);
    const pricing = this.getCostPer1kTokens();

    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;

    return inputCost + outputCost;
  }
}
