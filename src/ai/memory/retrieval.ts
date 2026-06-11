import logger from "../../utils/logger";
import { memoryEngine } from "../../core/memory-engine";

export interface MemoryMatch {
  key: string;

  value: string;

  score: number;
}

export class MemoryRetrieval {
  async rankMemories(
    userId: string,
    query: string
  ): Promise<MemoryMatch[]> {
    const memories =
      await memoryEngine.search(userId, query);

    const scored: MemoryMatch[] = memories.map(
      (m) => {
        const score = this.scoreMemory(
          query,
          m.key,
          m.value
        );

        return {
          key: m.key,
          value: m.value,
          score,
        };
      }
    );

    return scored.sort(
      (a, b) => b.score - a.score
    );
  }

  private scoreMemory(
    query: string,
    key: string,
    value: string
  ): number {
    let score = 0;

    const q = query.toLowerCase();
    const k = key.toLowerCase();
    const v = value.toLowerCase();

    if (k.includes(q)) score += 5;

    if (v.includes(q)) score += 3;

    const queryWords = q.split(" ");

    for (const word of queryWords) {
      if (k.includes(word)) score += 2;

      if (v.includes(word)) score += 1;
    }

    // small boost for short precise memories
    if (value.length < 80) score += 1;

    return score;
  }

  async getTopMemories(
    userId: string,
    query: string,
    limit: number = 5
  ) {
    const ranked = await this.rankMemories(
      userId,
      query
    );

    return ranked.slice(0, limit);
  }
}

export const memoryRetrieval =
  new MemoryRetrieval();

export default memoryRetrieval;
