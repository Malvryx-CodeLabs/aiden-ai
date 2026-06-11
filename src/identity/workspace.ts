export interface Workspace {
  id: string;

  ownerId: string;

  type: "USER" | "GROUP";

  path: string;

  isActive: boolean;

  createdAt: number;

  updatedAt: number;
}

export class WorkspaceRegistry {
  private workspaces: Map<string, Workspace> =
    new Map();

  create(
    ws: Omit<Workspace, "createdAt" | "updatedAt">
  ): Workspace {
    const now = Date.now();

    const full: Workspace = {
      ...ws,
      createdAt: now,
      updatedAt: now,
    };

    this.workspaces.set(ws.id, full);

    return full;
  }

  get(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  getByOwner(ownerId: string): Workspace[] {
    return Array.from(this.workspaces.values()).filter(
      (w) => w.ownerId === ownerId
    );
  }

  setActive(id: string, active: boolean): void {
    const ws = this.workspaces.get(id);

    if (!ws) return;

    ws.isActive = active;
    ws.updatedAt = Date.now();

    this.workspaces.set(id, ws);
  }

  update(
    id: string,
    update: Partial<Workspace>
  ): Workspace | undefined {
    const existing = this.workspaces.get(id);

    if (!existing) return undefined;

    const updated: Workspace = {
      ...existing,
      ...update,
      updatedAt: Date.now(),
    };

    this.workspaces.set(id, updated);

    return updated;
  }
}

export const workspaceRegistry =
  new WorkspaceRegistry();

export default workspaceRegistry;
