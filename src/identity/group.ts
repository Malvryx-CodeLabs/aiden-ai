export interface GroupIdentity {
  id: string;

  name: string;

  description?: string;

  owner?: string;

  admins: string[];

  isBotEnabled: boolean;

  isMuted: boolean;

  createdAt: number;

  updatedAt: number;
}

export class GroupRegistry {
  private groups: Map<string, GroupIdentity> =
    new Map();

  create(
    group: Omit<
      GroupIdentity,
      "createdAt" | "updatedAt"
    >
  ): GroupIdentity {
    const now = Date.now();

    const full: GroupIdentity = {
      ...group,
      createdAt: now,
      updatedAt: now,
    };

    this.groups.set(group.id, full);

    return full;
  }

  get(id: string): GroupIdentity | undefined {
    return this.groups.get(id);
  }

  update(
    id: string,
    update: Partial<GroupIdentity>
  ): GroupIdentity | undefined {
    const existing = this.groups.get(id);

    if (!existing) return undefined;

    const updated: GroupIdentity = {
      ...existing,
      ...update,
      updatedAt: Date.now(),
    };

    this.groups.set(id, updated);

    return updated;
  }

  setBotState(
    id: string,
    enabled: boolean
  ): void {
    const group = this.groups.get(id);

    if (!group) return;

    group.isBotEnabled = enabled;
    group.updatedAt = Date.now();

    this.groups.set(id, group);
  }
}

export const groupRegistry =
  new GroupRegistry();

export default groupRegistry;
