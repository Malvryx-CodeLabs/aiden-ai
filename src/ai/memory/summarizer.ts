import logger from "../../utils/logger";
import { MemoryMatch } from "./retrieval";

export interface SummaryInput {
  userId: string;

  memories: MemoryMatch[];
}

export interface MemorySummary {
  summary: string;

  keyFacts: string[];
}

export class MemorySummarizer {
  summarize(
    input: SummaryInput
  ): MemorySummary {
    logger.info(
      `Summarizing memory for ${input.userId}`
    );

    if (!input.memories.length) {
      return {
        summary: "",
        keyFacts: [],
      };
    }

    const sorted = [...input.memories].sort(
      (a, b) => b.score - a.score
    );

    const top = sorted.slice(0, 5);

    const keyFacts = top.map(
      (m) => `${m.key}: ${m.value}`
    );

    const summary = this.buildSummary(
      keyFacts
    );

    return {
      summary,
      keyFacts,
    };
  }

  private buildSummary(
    facts: string[]
  ): string {
    if (facts.length === 0) return "";

    if (facts.length === 1) {
      return facts[0];
    }

    return (
      "User context:\n" +
      facts.map((f) => `- ${f}`).join("\n")
    );
  }
}

export const memorySummarizer =
  new MemorySummarizer();

export default memorySummarizer;
