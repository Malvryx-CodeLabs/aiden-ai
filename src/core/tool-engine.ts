import logger from "../utils/logger";

export interface ToolContext {
  name: string;

  input: any;

  senderId: string;

  groupId?: string;
}

export interface ToolResult {
  success: boolean;

  output?: any;

  error?: string;
}

export class ToolEngine {
  private tools: Map<
    string,
    (input: any, ctx: ToolContext) => Promise<any>
  > = new Map();

  registerTool(
    name: string,
    handler: (input: any, ctx: ToolContext) => Promise<any>
  ): void {
    this.tools.set(name, handler);
    logger.info(`Tool registered: ${name}`);
  }

  async execute(
    ctx: ToolContext
  ): Promise<ToolResult> {
    try {
      const tool = this.tools.get(ctx.name);

      if (!tool) {
        return {
          success: false,
          error: `Tool not found: ${ctx.name}`,
        };
      }

      logger.info(`Executing tool: ${ctx.name}`);

      const result = await tool(ctx.input, ctx);

      return {
        success: true,
        output: result,
      };
    } catch (err: any) {
      logger.error("Tool execution error:", err);

      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }

  listTools(): string[] {
    return Array.from(this.tools.keys());
  }
}

export const toolEngine = new ToolEngine();

export default toolEngine;
