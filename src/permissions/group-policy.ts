export type GroupMode =
  | "ALL"
  | "ADMINS_ONLY"
  | "MENTION_ONLY"
  | "OFF";

export interface GroupPolicy {
  groupId: string;

  enabled: boolean;

  mode: GroupMode;

  allowList: string[];

  blockList: string[];

  noMedia: boolean;

  noCommands: boolean;
}

export const groupPolicies: Map<string, GroupPolicy> =
  new Map();

export function getGroupPolicy(
  groupId: string
): GroupPolicy {
  const existing = groupPolicies.get(groupId);

  if (existing) return existing;

  const defaultPolicy: GroupPolicy = {
    groupId,

    enabled: true,

    mode: "ALL",

    allowList: [],

    blockList: [],

    noMedia: false,

    noCommands: false,
  };

  groupPolicies.set(groupId, defaultPolicy);

  return defaultPolicy;
}

export function setGroupPolicy(
  groupId: string,
  update: Partial<GroupPolicy>
): GroupPolicy {
  const current = getGroupPolicy(groupId);

  const updated: GroupPolicy = {
    ...current,
    ...update,
  };

  groupPolicies.set(groupId, updated);

  return updated;
}

export function canRespondInGroup(
  groupId: string,
  senderId: string,
  isMentioned: boolean,
  isAdmin: boolean
): boolean {
  const policy = getGroupPolicy(groupId);

  if (!policy.enabled) return false;

  if (policy.blockList.includes(senderId))
    return false;

  if (policy.allowList.length > 0) {
    return policy.allowList.includes(senderId);
  }

  switch (policy.mode) {
    case "OFF":
      return false;

    case "ADMINS_ONLY":
      return isAdmin;

    case "MENTION_ONLY":
      return isMentioned || isAdmin;

    case "ALL":
    default:
      return true;
  }
}
