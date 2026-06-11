import env from "../config/env";
import logger from "../utils/logger";

export class OwnerPolicy {
  isOwner(userId: string): boolean {
    const owner = env.owner.number;

    if (!owner) {
      logger.warn("OWNER_NUMBER not set in env");
      return false;
    }

    // normalize numbers (basic safety)
    const clean = (v: string) => v.replace(/\D/g, "");
    return clean(userId) === clean(owner);
  }

  canOwnerAction(
    action: string
  ): { allowed: boolean; reason?: string } {
    // Owners can execute all actions
    return { allowed: true };
  }
}

export const ownerPolicy = new OwnerPolicy();

export function isOwner(userId: string): boolean {
  return ownerPolicy.isOwner(userId);
}

export function canOwnerAction(action: string): {
  allowed: boolean;
  reason?: string;
} {
  return ownerPolicy.canOwnerAction(action);
}
