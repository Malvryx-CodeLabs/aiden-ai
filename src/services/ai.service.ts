import logger from "../utils/logger";
import { promptBuilder } from "../core/prompt-builder";
import { runtimeConfig } from "../config/runtime";

export interface AIRequest {
  senderId: string;

  groupId?: string;

  isGroup: boolean;

  text: string;
}

export interface AIResponse {
  text: string;

  model: string;

  provider: string;
}

export class AIService {
  async generate(
    input: AIRequest
  ): Promise<AIResponse> {
    logger.info("AI Service: generating response");

    const prompt =
      await promptBuilder.build(input);

    const provider = runtimeConfig.activeProvider;

    const model = runtimeConfig.activeModel;

    const output = await this.callProvider(
      provider,
      model,
      prompt.system,
      prompt.user
    );

    return {
      text: output,
      model,
      provider,
    };
  }

  private async callProvider(
    provider: string,
    model: string,
    system: string,
    user: string
  ): Promise<string> {
    logger.info(
      `Provider: ${provider} | Model: ${model}`
    );

    // GROQ (REAL HOOK PLACEHOLDER)
    if (provider === "groq") {
      return await this.groq(system, user, model);
    }

    if (provider === "openai") {
      return await this.openai(system, user, model);
    }

    if (provider === "gemini") {
      return await this.gemini(system, user, model);
    }

    if (provider === "openrouter") {
      return await this.openrouter(system, user, model);
    }

    return "Error: Unknown AI provider";
  }

  private async groq(
    system: string,
    user: string,
    model: string
  ): Promise<string> {
    // TODO: replace with real Groq API call
    return `[GROQ:${model}] ${user}`;
  }

  private async openai(
    system: string,
    user: string,
    model: string
  ): Promise<string> {
    return `[OPENAI:${model}] ${user}`;
  }

  private async gemini(
    system: string,
    user: string,
    model: string
  ): Promise<string> {
    return `[GEMINI:${model}] ${user}`;
  }

  private async openrouter(
    system: string,
    user: string,
    model: string
  ): Promise<string> {
    return `[OPENROUTER:${model}] ${user}`;
  }
}

export const aiService = new AIService();

export default aiService;
