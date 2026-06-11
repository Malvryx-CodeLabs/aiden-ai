import env from "../config/env";
import { runtimeConfig } from "../config/runtime";

export interface KernelConfig {
  env: typeof env;

  runtime: typeof runtimeConfig;
}

export const kernelConfig: KernelConfig = {
  env,

  runtime: runtimeConfig,
};

export function getKernelConfig(): KernelConfig {
  return kernelConfig;
}

export function syncRuntimeToKernel(): void {
  kernelConfig.runtime = runtimeConfig;
}
