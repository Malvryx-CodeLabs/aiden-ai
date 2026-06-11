import logger from "../utils/logger";
import { toolRegistry } from "./tool-registry";

export type ToolInput = {
  [key: string]: any;
};

export class ToolEngine {
  registerTool(
    name: string,
    handler: (input: ToolInput) => Promise<any>
  ): void {
    toolRegistry.register({
      name,
      description: name,
      handler,
    });
    logger.info(`Tool registered: ${name}`);
  }

  async runTool(name: string, input: ToolInput) {
    const tool = toolRegistry.get(name);

    if (!tool) {
      return {
        error: `Tool not found: ${name}`,
      };
    }

    try {
      logger.info(`🧰 Executing tool: ${name}`);

      const result = await tool.handler(input);

      return result;
    } catch (err: any) {
      logger.error(`Tool execution failed (${name}):`, err);

      return {
        error: `Tool failed: ${name}`,
      };
    }
  }

  listTools() {
    return toolRegistry.list().map((t) => ({
      name: t.name,
      description: t.description,
    }));
  }
}

export const toolEngine = new ToolEngine();

export default toolEngine;
