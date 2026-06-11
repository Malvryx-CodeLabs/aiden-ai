export interface FeatureFlags {
  vision: boolean;
  audio: boolean;
  groups: boolean;
  dms: boolean;

  toolCreation: boolean;
  selfImprovement: boolean;

  modelSwitching: boolean;
  memoryLearning: boolean;

  stickers: boolean;
  voiceReplies: boolean;
}

export const featureFlags: FeatureFlags = {
  vision: true,
  audio: true,
  groups: true,
  dms: true,

  toolCreation: false,
  selfImprovement: false,

  modelSwitching: true,
  memoryLearning: true,

  stickers: true,
  voiceReplies: true,
};

export function isFeatureEnabled(
  key: keyof FeatureFlags
): boolean {
  return featureFlags[key];
}

export function setFeature(
  key: keyof FeatureFlags,
  value: boolean
): void {
  featureFlags[key] = value;
}
