import logger from "../utils/logger";

export interface AIResponseInput {
  text: string;

  mode: "DM" | "GROUP";

  senderId: string;

  groupId?: string;
}

export interface FinalResponse {
  text: string;
}

export class ResponseBuilder {
  async build(
    input: AIResponseInput
  ): Promise<FinalResponse> {
    logger.info("Building humanized response...");

    let text = input.text;

    text = this.clean(text);

    text = this.humanize(text, input.mode);

    return { text };
  }

  private clean(text: string): string {
    return text
      .replace(/\[GROQ:.*?\]/g, "")
      .replace(/\[OPENAI:.*?\]/g, "")
      .replace(/\[GEMINI:.*?\]/g, "")
      .replace(/\[OPENROUTER:.*?\]/g, "")
      .trim();
  }

  private humanize(
    text: string,
    mode: "DM" | "GROUP"
  ): string {
    // light human behavior layer
    if (mode === "GROUP") {
      // slightly shorter, more casual
      if (text.length > 400) {
        text = text.slice(0, 400) + "...";
      }
    }

    if (mode === "DM") {
      // slightly more personal tone adjustment
      text = text;
    }

    return text;
  }
}

export const responseBuilder =
  new ResponseBuilder();

export default responseBuilder;
