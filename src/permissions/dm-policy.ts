export type DMMode =
  | "ALL"
  | "WHITELIST_ONLY"
  | "BLOCKLIST_ONLY"
  | "OFF"
  | "SILENT";

export interface DMPolicy {
  enabled: boolean;

  mode: DMMode;

  allowList: string[];

  blockList: string[];

  noMedia: boolean;

  noCommands: boolean;
}

export const dmPolicy: DMPolicy = {
  enabled: true,

  mode: "ALL",

  allowList: [],

  blockList: [],

  noMedia: false,

  noCommands: false,
};

export function canRespondInDM(
  userId: string,
  isOwner: boolean
): boolean {
  if (isOwner) return true;

  if (!dmPolicy.enabled) return false;

  if (dmPolicy.mode === "OFF") return false;

  if (dmPolicy.blockList.includes(userId))
    return false;

  if (dmPolicy.mode === "WHITELIST_ONLY") {
    return dmPolicy.allowList.includes(userId);
  }

  return true;
}

export function shouldBeSilentDM(): boolean {
  return dmPolicy.mode === "SILENT";
}

export function setDMPolicy(
  update: Partial<DMPolicy>
): DMPolicy {
  Object.assign(dmPolicy, update);
  return dmPolicy;
}
