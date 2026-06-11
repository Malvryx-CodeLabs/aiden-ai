export interface LIDMapping {
  lid: string;

  phone?: string;

  jid?: string;

  userId: string;

  createdAt: number;

  updatedAt: number;
}

export class LIDRegistry {
  private map: Map<string, LIDMapping> = new Map();

  create(mapping: Omit<LIDMapping, "createdAt" | "updatedAt">): LIDMapping {
    const now = Date.now();

    const full: LIDMapping = {
      ...mapping,
      createdAt: now,
      updatedAt: now,
    };

    this.map.set(mapping.lid, full);

    return full;
  }

  get(lid: string): LIDMapping | undefined {
    return this.map.get(lid);
  }

  update(
    lid: string,
    update: Partial<LIDMapping>
  ): LIDMapping | undefined {
    const existing = this.map.get(lid);

    if (!existing) return undefined;

    const updated: LIDMapping = {
      ...existing,
      ...update,
      updatedAt: Date.now(),
    };

    this.map.set(lid, updated);

    return updated;
  }

  getByUserId(userId: string): LIDMapping | undefined {
    for (const value of this.map.values()) {
      if (value.userId === userId) return value;
    }

    return undefined;
  }
}

export const lidRegistry = new LIDRegistry();

export default lidRegistry;
