import logger from "../../utils/logger";
import { MemoryMatch } from "./retrieval";

export class MemoryRelevance {
  filterRelevant(
    query: string,
    memories: MemoryMatch[]
  ): MemoryMatch[] {
    if (!memories.length) return [];

    const threshold = 2;

    const filtered = memories.filter(
      (m) => m.score >= threshold
    );

    logger.info(
      `Filtered ${memories.length} → ${filtered.length} relevant memories`
    );

    return filtered;
  }

  shouldStoreMemory(
    key: string,
    value: string
  ): boolean {
    const text = `${key} ${value}`.toLowerCase();

    const noisePatterns = [
      "hi",
      "hello",
      "ok",
      "okay",
      "lol",
      "thanks",
      "thank you",
    ];

    // ignore low-value memory
    if (text.length < 4) return false;

    if (
      noisePatterns.some((p) =>
        text.includes(p)
      )
    ) {
      return false;
    }

    // store if it looks meaningful
    return true;
  }

  boostScore(
    baseScore: number,
    key: string
  ): number {
    const importantKeys = [
      "name",
      "preference",
      "location",
      "work",
      "project",
      "owner",
    ];

    let score = baseScore;

    for (const k of importantKeys) {
      if (key.toLowerCase().includes(k)) {
        score += 3;
      }
    }

    return score;
  }
}

export const memoryRelevance =
  new MemoryRelevance();

export default memoryRelevance;
