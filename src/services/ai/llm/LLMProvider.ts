import {
  LLMService,
  LLMOptions,
  ModelInfo,
  JSONSchema,
} from "../../../types/ai";
import { GeminiService, GeminiConfig } from "./GeminiService";
import { OpenAIService, OpenAIConfig } from "./OpenAIService";

export interface LLMConfig {
  defaultProvider: "gemini" | "openai" | "anthropic" | "local";
  gemini: GeminiConfig;
  openai?: OpenAIConfig;
  anthropic?: Record<string, unknown>; // We'll implement this later if needed
  local?: Record<string, unknown>; // We'll implement this later if needed
}

export interface LLMProvider {
  generateText(prompt: string, options?: LLMOptions): Promise<string>;
  generateStructured<T>(
    prompt: string,
    schema: JSONSchema,
    options?: LLMOptions
  ): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
  isAvailable(): boolean;
  getModelInfo(): ModelInfo;
  getActiveProvider(): string;
  switchProvider(provider: string): void;
  getCostEstimate(
    prompt: string,
    expectedResponseLength?: number
  ): { provider: string; cost: number };
}

export class LLMProviderImpl implements LLMProvider {
  private providers: Map<string, LLMService> = new Map();
  private activeProvider: string;
  private config: LLMConfig;
  private cache: Map<string, { response: unknown; timestamp: number }> =
    new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: LLMConfig) {
    this.config = config;
    this.activeProvider = config.defaultProvider;

    // Initialize providers based on config
    this.initializeProviders();
  }

  private initializeProviders(): void {
    try {
      // Initialize Gemini (primary)
      if (this.config.gemini?.apiKey) {
        const geminiService = new GeminiService(this.config.gemini);
        this.providers.set("gemini", geminiService);
        console.log("✅ Gemini service initialized");
      } else {
        console.warn("⚠️ Gemini API key not provided");
      }

      // Initialize OpenAI (fallback)
      if (this.config.openai?.apiKey) {
        const openaiService = new OpenAIService(this.config.openai);
        this.providers.set("openai", openaiService);
        console.log("✅ OpenAI service initialized");
      } else {
        console.warn("⚠️ OpenAI API key not provided");
      }

      // Check if at least one provider is available
      if (this.providers.size === 0) {
        throw new Error(
          "No LLM providers available. Please configure at least one API key."
        );
      }

      // Validate active provider
      if (!this.providers.has(this.activeProvider)) {
        // Fallback to first available provider
        this.activeProvider = Array.from(this.providers.keys())[0];
        console.warn(
          `⚠️ Default provider not available, switching to: ${this.activeProvider}`
        );
      }
    } catch (error) {
      console.error("Failed to initialize LLM providers:", error);
      throw error;
    }
  }

  async generateText(prompt: string, options?: LLMOptions): Promise<string> {
    // Check cache first
    const cacheKey = this.generateCacheKey(prompt, options);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log("📦 Using cached response");
      return cached.response as string;
    }

    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not available`);
    }

    try {
      console.log(`🤖 Generating text with ${this.activeProvider}`);
      const response = await provider.generateText(prompt, options);

      // Cache the response
      this.cache.set(cacheKey, { response, timestamp: Date.now() });

      return response;
    } catch (error) {
      console.warn(`❌ ${this.activeProvider} failed, trying fallback:`, error);

      // Try fallback providers
      for (const [name, fallbackProvider] of this.providers) {
        if (name !== this.activeProvider && fallbackProvider.isAvailable()) {
          try {
            console.log(`🔄 Trying fallback provider: ${name}`);
            const response = await fallbackProvider.generateText(
              prompt,
              options
            );

            // Cache the response
            this.cache.set(cacheKey, { response, timestamp: Date.now() });

            return response;
          } catch (fallbackError) {
            console.warn(
              `❌ Fallback provider ${name} also failed:`,
              fallbackError
            );
          }
        }
      }

      throw new Error(
        `All LLM providers failed. Last error: ${
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
    // Check cache first
    const cacheKey = this.generateCacheKey(prompt, options, schema);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log("📦 Using cached structured response");
      return cached.response as T;
    }

    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not available`);
    }

    try {
      console.log(
        `🤖 Generating structured response with ${this.activeProvider}`
      );
      const response = await provider.generateStructured<T>(
        prompt,
        schema,
        options
      );

      // Cache the response
      this.cache.set(cacheKey, { response, timestamp: Date.now() });

      return response;
    } catch (error) {
      console.warn(
        `❌ ${this.activeProvider} structured generation failed, trying fallback:`,
        error
      );

      // Try fallback providers
      for (const [name, fallbackProvider] of this.providers) {
        if (name !== this.activeProvider && fallbackProvider.isAvailable()) {
          try {
            console.log(`🔄 Trying fallback provider for structured: ${name}`);
            const response = await fallbackProvider.generateStructured<T>(
              prompt,
              schema,
              options
            );

            // Cache the response
            this.cache.set(cacheKey, { response, timestamp: Date.now() });

            return response;
          } catch (fallbackError) {
            console.warn(
              `❌ Fallback provider ${name} structured generation also failed:`,
              fallbackError
            );
          }
        }
      }

      throw new Error(
        `All LLM providers failed for structured generation. Last error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not available`);
    }

    try {
      console.log(`🤖 Generating embedding with ${this.activeProvider}`);
      return await provider.generateEmbedding(text);
    } catch (error) {
      console.warn(
        `❌ ${this.activeProvider} embedding failed, trying fallback:`,
        error
      );

      // Try fallback providers
      for (const [name, fallbackProvider] of this.providers) {
        if (name !== this.activeProvider && fallbackProvider.isAvailable()) {
          try {
            console.log(`🔄 Trying fallback provider for embedding: ${name}`);
            return await fallbackProvider.generateEmbedding(text);
          } catch (fallbackError) {
            console.warn(
              `❌ Fallback provider ${name} embedding also failed:`,
              fallbackError
            );
          }
        }
      }

      throw new Error(
        `All LLM providers failed for embedding. Last error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  isAvailable(): boolean {
    return Array.from(this.providers.values()).some((provider) =>
      provider.isAvailable()
    );
  }

  getModelInfo(): ModelInfo {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Provider ${this.activeProvider} not available`);
    }
    return provider.getModelInfo();
  }

  getActiveProvider(): string {
    return this.activeProvider;
  }

  switchProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not available`);
    }

    const providerService = this.providers.get(provider);
    if (!providerService?.isAvailable()) {
      throw new Error(`Provider ${provider} is not available`);
    }

    this.activeProvider = provider;
    console.log(`🔄 Switched to provider: ${provider}`);
  }

  getCostEstimate(
    prompt: string,
    expectedResponseLength: number = 500
  ): { provider: string; cost: number } {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      return { provider: "unknown", cost: 0 };
    }

    const modelInfo = provider.getModelInfo();
    const inputTokens = Math.ceil(prompt.length / 4); // Rough estimation
    const outputTokens = Math.ceil(expectedResponseLength / 4);

    const inputCost = (inputTokens / 1000) * modelInfo.costPer1kTokens.input;
    const outputCost = (outputTokens / 1000) * modelInfo.costPer1kTokens.output;

    return {
      provider: this.activeProvider,
      cost: inputCost + outputCost,
    };
  }

  private generateCacheKey(
    prompt: string,
    options?: LLMOptions,
    schema?: JSONSchema
  ): string {
    const keyData = {
      prompt: prompt.substring(0, 100), // Use first 100 chars for cache key
      options,
      schema: schema ? JSON.stringify(schema) : undefined,
      provider: this.activeProvider,
    };
    return btoa(JSON.stringify(keyData));
  }

  // Utility methods
  getAvailableProviders(): string[] {
    return Array.from(this.providers.entries())
      .filter(([, provider]) => provider.isAvailable())
      .map(([name]) => name);
  }

  getProviderStats(): Record<
    string,
    { available: boolean; modelInfo: ModelInfo }
  > {
    const stats: Record<string, { available: boolean; modelInfo: ModelInfo }> =
      {};

    for (const [name, provider] of this.providers) {
      stats[name] = {
        available: provider.isAvailable(),
        modelInfo: provider.getModelInfo(),
      };
    }

    return stats;
  }

  clearCache(): void {
    this.cache.clear();
    console.log("🗑️ LLM provider cache cleared");
  }

  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).length,
    };
  }
}
