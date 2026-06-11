import { Role } from "../types/permission";

export interface UserIdentity {
  id: string;

  lid?: string;

  phone?: string;

  name?: string;

  pushName?: string;

  role: Role;

  isBlocked: boolean;

  isMuted: boolean;

  createdAt: number;

  updatedAt: number;
}

export class UserRegistry {
  private users: Map<string, UserIdentity> =
    new Map();

  create(
    user: Omit<
      UserIdentity,
      "createdAt" | "updatedAt"
    >
  ): UserIdentity {
    const now = Date.now();

    const full: UserIdentity = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, full);

    return full;
  }

  get(id: string): UserIdentity | undefined {
    return this.users.get(id);
  }

  update(
    id: string,
    update: Partial<UserIdentity>
  ): UserIdentity | undefined {
    const existing = this.users.get(id);

    if (!existing) return undefined;

    const updated: UserIdentity = {
      ...existing,
      ...update,
      updatedAt: Date.now(),
    };

    this.users.set(id, updated);

    return updated;
  }

  setRole(id: string, role: Role): void {
    const user = this.users.get(id);

    if (!user) return;

    user.role = role;
    user.updatedAt = Date.now();

    this.users.set(id, user);
  }
}

export const userRegistry = new UserRegistry();

export default userRegistry;
