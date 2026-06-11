export interface OwnerPolicy {
  ownerIds: string[];

  allowModelSwitch: boolean;

  allowToolCreation: boolean;

  allowSelfImprovement: boolean;

  allowSystemOverride: boolean;

  maintenanceMode: boolean;

  emergencyShutdown: boolean;
}

export const ownerPolicy: OwnerPolicy = {
  ownerIds: [],

  allowModelSwitch: true,

  allowToolCreation: true,

  allowSelfImprovement: false,

  allowSystemOverride: true,

  maintenanceMode: false,

  emergencyShutdown: false,
};

export function isOwner(id: string): boolean {
  return ownerPolicy.ownerIds.includes(id);
}

export function canOwnerAction(
  action:
    | "SWITCH_MODEL"
    | "CREATE_TOOL"
    | "SELF_IMPROVE"
    | "SYSTEM_OVERRIDE"
): boolean {
  if (ownerPolicy.emergencyShutdown) return false;

  if (ownerPolicy.maintenanceMode && action !== "SYSTEM_OVERRIDE") {
    return false;
  }

  switch (action) {
    case "SWITCH_MODEL":
      return ownerPolicy.allowModelSwitch;

    case "CREATE_TOOL":
      return ownerPolicy.allowToolCreation;

    case "SELF_IMPROVE":
      return ownerPolicy.allowSelfImprovement;

    case "SYSTEM_OVERRIDE":
      return ownerPolicy.allowSystemOverride;

    default:
      return false;
  }
}

export function setOwnerPolicy(
  update: Partial<OwnerPolicy>
): OwnerPolicy {
  Object.assign(ownerPolicy, update);
  return ownerPolicy;
}
