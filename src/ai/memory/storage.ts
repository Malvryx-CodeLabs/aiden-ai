import logger from "../../utils/logger";
import { memoryEngine } from "../../core/memory-engine";

export class MemoryStorage {
  async saveUserMemory(
    userId: string,
    key: string,
    value: string,
    groupId?: string
  ): Promise<void> {
    memoryEngine.write({
      id: `${userId}-${Date.now()}`,

      userId,

      groupId,

      key,

      value,

      timestamp: Date.now(),
    });

    logger.info(
      `Saved memory: ${userId} -> ${key}`
    );
  }

  async getUserMemory(
    userId: string,
    key?: string
  ) {
    return memoryEngine.read(userId, key);
  }

  async searchUserMemory(
    userId: string,
    query: string
  ) {
    return memoryEngine.search(userId, query);
  }

  async injectMemoryContext(
    userId: string,
    query: string
  ): Promise<string> {
    const memories =
      memoryEngine.search(userId, query);

    if (!memories.length) {
      return "";
    }

    return memories
      .slice(0, 5)
      .map(
        (m) => `${m.key}: ${m.value}`
      )
      .join("\n");
  }
}

export const memoryStorage =
  new MemoryStorage();

export default memoryStorage;
