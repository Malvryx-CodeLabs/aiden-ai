import env from "../config/env";
import { getRuntimeConfig } from "../config/runtime";

export interface KernelConfig {
  env: typeof env;

  runtime: ReturnType<typeof getRuntimeConfig>;
}

export const kernelConfig: KernelConfig = {
  env,

  runtime: getRuntimeConfig(),
};

export function getKernelConfig(): KernelConfig {
  return kernelConfig;
}

export function syncRuntimeToKernel(): void {
  kernelConfig.runtime = getRuntimeConfig();
}
