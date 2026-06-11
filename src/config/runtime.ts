export interface RuntimeConfig {
  activeProvider: string;

  activeModel: string;

  maintenanceMode: boolean;

  emergencyShutdown: boolean;

  globalBotEnabled: boolean;

  allowGroups: boolean;

  allowDMs: boolean;

  toolCreationEnabled: boolean;

  selfImprovementEnabled: boolean;
}

export const runtimeConfig: RuntimeConfig = {
  activeProvider: "groq",
  activeModel: "llama-3.3-70b-versatile",

  maintenanceMode: false,

  emergencyShutdown: false,

  globalBotEnabled: true,

  allowGroups: true,

  allowDMs: true,

  toolCreationEnabled: false,

  selfImprovementEnabled: false,
};

export function setRuntimeConfig(
  update: Partial<RuntimeConfig>
): RuntimeConfig {
  Object.assign(runtimeConfig, update);
  return runtimeConfig;
}

export function getRuntimeConfig(): RuntimeConfig {
  return runtimeConfig;
}
