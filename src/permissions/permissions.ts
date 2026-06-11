import { Role, hasRole } from "./roles";
import { isFeatureEnabled } from "./feature-flags";

export type Action =
  | "SEND_MESSAGE"
  | "USE_AI"
  | "SWITCH_MODEL"
  | "CREATE_TOOL"
  | "DELETE_TOOL"
  | "READ_MEMORY"
  | "WRITE_MEMORY"
  | "DISABLE_GROUP"
  | "DISABLE_DM"
  | "ENABLE_FEATURE"
  | "DISABLE_FEATURE";

export interface PermissionContext {
  role: Role;
  isGroup: boolean;
  isDM: boolean;
  isOwner: boolean;
  isDeveloper: boolean;
}

export function can(
  ctx: PermissionContext,
  action: Action
): { allowed: boolean; reason?: string } {
  const { role } = ctx;

  // GLOBAL FEATURE BLOCKS
  if (
    (action === "CREATE_TOOL" ||
      action === "DELETE_TOOL") &&
    !isFeatureEnabled("toolCreation")
  ) {
    return {
      allowed: false,
      reason: "Tool creation is disabled",
    };
  }

  if (
    action === "SWITCH_MODEL" &&
    !isFeatureEnabled("modelSwitching")
  ) {
    return {
      allowed: false,
      reason: "Model switching is disabled",
    };
  }

  // OWNER-ONLY ACTIONS
  if (
    action === "SWITCH_MODEL" ||
    action === "DISABLE_GROUP" ||
    action === "DISABLE_DM" ||
    action === "ENABLE_FEATURE" ||
    action === "DISABLE_FEATURE"
  ) {
    if (role !== Role.OWNER) {
      return {
        allowed: false,
        reason: "Owner only action",
      };
    }
    return { allowed: true };
  }

  // DEVELOPER LEVEL ACTIONS
  if (
    action === "CREATE_TOOL" ||
    action === "DELETE_TOOL" ||
    action === "WRITE_MEMORY"
  ) {
    if (!hasRole(role, Role.DEVELOPER)) {
      return {
        allowed: false,
        reason: "Developer or above required",
      };
    }
    return { allowed: true };
  }

  // GROUP / DM CONTEXT RULES
  if (action === "SEND_MESSAGE") {
    if (ctx.isGroup && !isFeatureEnabled("groups")) {
      return {
        allowed: false,
        reason: "Group messaging disabled",
      };
    }

    if (ctx.isDM && !isFeatureEnabled("dms")) {
      return {
        allowed: false,
        reason: "DM messaging disabled",
      };
    }
  }

  // DEFAULT ALLOW FOR SAFE ACTIONS
  return { allowed: true };
}

export default can;
