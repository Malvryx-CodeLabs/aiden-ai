import { Role } from "../permissions/roles";
import { can, Action } from "../permissions/permissions";
import {
  isOwner,
  canOwnerAction,
} from "../permissions/owner-policy";

import {
  getAdminPolicy,
  canBotRespondInGroup,
} from "../permissions/admin-policy";

import {
  getGroupPolicy,
  canRespondInGroup,
} from "../permissions/group-policy";

import {
  canRespondInDM,
  shouldBeSilentDM,
} from "../permissions/dm-policy";

export interface MessageContext {
  senderId: string;

  groupId?: string;

  isGroup: boolean;

  isDM: boolean;

  role: Role;

  isAdmin: boolean;

  isMentioned: boolean;

  isOwner?: boolean;

  isDeveloper?: boolean;
}

export class PermissionService {
  canExecute(
    ctx: MessageContext,
    action: Action
  ): { allowed: boolean; reason?: string } {
    // OWNER OVERRIDE
    if (isOwner(ctx.senderId)) {
      const ownerAllowed = this.checkOwner(action);

      if (!ownerAllowed.allowed) return ownerAllowed;

      return can(this.toPermissionContext(ctx, true, false), action);
    }

    // GROUP LOGIC
    if (ctx.isGroup && ctx.groupId) {
      const adminPolicy = canBotRespondInGroup(
        ctx.groupId,
        ctx.isAdmin,
        ctx.isMentioned
      );

      if (!adminPolicy) {
        return {
          allowed: false,
          reason: "Group policy blocked response",
        };
      }

      const groupPolicy = canRespondInGroup(
        ctx.groupId,
        ctx.senderId,
        ctx.isMentioned,
        ctx.isAdmin
      );

      if (!groupPolicy) {
        return {
          allowed: false,
          reason: "Group restrictions applied",
        };
      }
    }

    // DM LOGIC
    if (ctx.isDM) {
      const dmAllowed = canRespondInDM(
        ctx.senderId,
        ctx.role === Role.OWNER
      );

      if (!dmAllowed) {
        return {
          allowed: false,
          reason: "DM policy blocked user",
        };
      }

      if (shouldBeSilentDM()) {
        return {
          allowed: false,
          reason: "DM silent mode active",
        };
      }
    }

    // DEFAULT PERMISSION CHECK
    return can(
      this.toPermissionContext(ctx, false, false),
      action
    );
  }

  private toPermissionContext(
    ctx: MessageContext,
    isOwner: boolean,
    isDeveloper: boolean
  ) {
    return {
      role: ctx.role,
      isGroup: ctx.isGroup,
      isDM: ctx.isDM,
      isOwner,
      isDeveloper,
    };
  }

  private checkOwner(action: Action): {
    allowed: boolean;
    reason?: string;
  } {
    switch (action) {
      case "SWITCH_MODEL":
        return canOwnerAction("SWITCH_MODEL");

      case "CREATE_TOOL":
        return canOwnerAction("CREATE_TOOL");

      case "DELETE_TOOL":
        return canOwnerAction("SYSTEM_OVERRIDE");

      default:
        return { allowed: true };
    }
  }
}

export const permissionService =
  new PermissionService();

export default permissionService;
