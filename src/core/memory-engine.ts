import logger from "../utils/logger";

export interface MemoryRecord {
  id: string;

  userId: string;

  groupId?: string;

  key: string;

  value: string;

  timestamp: number;
}

export class MemoryEngine {
  private memory: Map<string, MemoryRecord[]> =
    new Map();

  private getBucket(userId: string): MemoryRecord[] {
    if (!this.memory.has(userId)) {
      this.memory.set(userId, []);
    }

    return this.memory.get(userId)!;
  }

  write(record: MemoryRecord): void {
    const bucket = this.getBucket(record.userId);

    bucket.push(record);

    logger.info(
      `Memory stored for ${record.userId}: ${record.key}`
    );
  }

  read(userId: string, key?: string): MemoryRecord[] {
    const bucket = this.getBucket(userId);

    if (!key) return bucket;

    return bucket.filter((m) => m.key === key);
  }

  search(userId: string, query: string): MemoryRecord[] {
    const bucket = this.getBucket(userId);

    return bucket.filter((m) =>
      m.key.includes(query) ||
      m.value.includes(query)
    );
  }

  clear(userId: string): void {
    this.memory.set(userId, []);
    logger.warn(`Memory cleared for ${userId}`);
  }
}

export const memoryEngine = new MemoryEngine();

export default memoryEngine;
