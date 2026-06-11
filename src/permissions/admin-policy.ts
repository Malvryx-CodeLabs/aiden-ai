export interface AdminPolicy {
  groupId: string;

  botEnabled: boolean;

  adminsOnlyMode: boolean;

  mentionOnlyMode: boolean;

  allowMedia: boolean;

  allowCommands: boolean;

  muted: boolean;
}

export const adminPolicies: Map<string, AdminPolicy> =
  new Map();

export function getAdminPolicy(
  groupId: string
): AdminPolicy {
  const existing = adminPolicies.get(groupId);

  if (existing) return existing;

  const defaultPolicy: AdminPolicy = {
    groupId,

    botEnabled: true,

    adminsOnlyMode: false,

    mentionOnlyMode: false,

    allowMedia: true,

    allowCommands: true,

    muted: false,
  };

  adminPolicies.set(groupId, defaultPolicy);

  return defaultPolicy;
}

export function setAdminPolicy(
  groupId: string,
  update: Partial<AdminPolicy>
): AdminPolicy {
  const current = getAdminPolicy(groupId);

  const updated: AdminPolicy = {
    ...current,
    ...update,
  };

  adminPolicies.set(groupId, updated);

  return updated;
}

export function canBotRespondInGroup(
  groupId: string,
  isAdmin: boolean,
  isMentioned: boolean
): boolean {
  const policy = getAdminPolicy(groupId);

  if (!policy.botEnabled) return false;

  if (policy.muted) return false;

  if (policy.adminsOnlyMode && !isAdmin) return false;

  if (policy.mentionOnlyMode && !isMentioned && !isAdmin) {
    return false;
  }

  return true;
}
