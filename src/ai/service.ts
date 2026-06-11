import logger from "../utils/logger";
import { contextBuilder } from "../core/context-builder";
import { runtimeConfig } from "../config/runtime";

export interface AIResponse {
  text: string;

  model: string;

  provider: string;
}

export class AIService {
  async generate(
    input: any
  ): Promise<AIResponse> {
    logger.info("Generating AI response...");

    const context =
      await contextBuilder.build(input);

    const provider =
      runtimeConfig.activeProvider;

    const model = runtimeConfig.activeModel;

    const raw = await this.callProvider(
      provider,
      model,
      context.systemPrompt,
      context.userPrompt
    );

    return {
      text: raw,
      model,
      provider,
    };
  }

  private async callProvider(
    provider: string,
    model: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    logger.info(
      `Calling provider: ${provider} | model: ${model}`
    );

    // MOCK IMPLEMENTATION (replace with real APIs later)

    if (provider === "groq") {
      return `[GROQ:${model}] ${userPrompt}`;
    }

    if (provider === "openai") {
      return `[OPENAI:${model}] ${userPrompt}`;
    }

    if (provider === "gemini") {
      return `[GEMINI:${model}] ${userPrompt}`;
    }

    if (provider === "openrouter") {
      return `[OPENROUTER:${model}] ${userPrompt}`;
    }

    return `Unknown provider: ${provider}`;
  }
}

export const aiService = new AIService();

export default aiService;
