import OpenAI from "openai";
import {
  LLMService,
  LLMOptions,
  ModelInfo,
  JSONSchema,
} from "../../../types/ai";

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature?: number;
}

export class OpenAIService implements LLMService {
  private openai: OpenAI;
  private config: OpenAIConfig;
  private isInitialized = false;

  constructor(config: OpenAIConfig) {
    this.config = config;

    if (!config.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    try {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true, // For client-side usage
      });
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize OpenAI service:", error);
      throw new Error(
        `OpenAI initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateText(prompt: string, options?: LLMOptions): Promise<string> {
    if (!this.isInitialized) {
      throw new Error("OpenAI service not initialized");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: options?.maxTokens || this.config.maxTokens,
        temperature: options?.temperature || this.config.temperature || 0.7,
        top_p: options?.topP,
        stream: options?.stream || false,
      });

      const content =
        "choices" in response ? response.choices[0]?.message?.content : null;

      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      return content;
    } catch (error) {
      console.error("OpenAI API error:", error);

      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw new Error("Invalid OpenAI API key");
        } else if (error.message.includes("quota")) {
          throw new Error("OpenAI API quota exceeded");
        } else if (error.message.includes("rate limit")) {
          throw new Error("OpenAI API rate limit exceeded");
        } else if (error.message.includes("content policy")) {
          throw new Error("Content blocked by OpenAI content policy");
        }
      }

      throw new Error(
        `OpenAI API error: ${
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
      console.error("OpenAI structured generation error:", error);
      throw new Error(
        `Failed to generate structured response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small", // Cost-effective embedding model
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("OpenAI embedding error:", error);
      // Return a zero vector as fallback
      return new Array(1536).fill(0); // text-embedding-3-small has 1536 dimensions
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
      provider: "openai",
      maxTokens: this.config.maxTokens,
      supportsStructuredOutput: true,
      supportsEmbeddings: true,
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
      throw new Error("Failed to parse structured response from OpenAI");
    }
  }

  private getCostPer1kTokens(): { input: number; output: number } {
    // OpenAI pricing (as of 2024)
    const pricing = {
      "gpt-4o": { input: 0.0025, output: 0.01 },
      "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
      "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
      "gpt-4": { input: 0.03, output: 0.06 },
      "gpt-4-turbo": { input: 0.01, output: 0.03 },
    };

    return (
      pricing[this.config.model as keyof typeof pricing] ||
      pricing["gpt-4o-mini"]
    );
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
