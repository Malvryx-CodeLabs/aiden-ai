import toolEngine from "../core/tool-engine";
import { searchTool, SearchInput } from "./search/tool";
import logger from "../utils/logger";

export function registerTools(): void {
  logger.info("Registering tools...");

  // SEARCH TOOL
  toolEngine.registerTool(
    "search",
    async (input: any) => {
      return await searchTool(input as SearchInput);
    }
  );

  // MEMORY READ (placeholder for now)
  toolEngine.registerTool(
    "memory_read",
    async (input) => {
      logger.info("Memory read tool called");

      return {
        message: "Memory system not fully implemented yet",
        input,
      };
    }
  );

  // MEMORY WRITE (placeholder for now)
  toolEngine.registerTool(
    "memory_write",
    async (input) => {
      logger.info("Memory write tool called");

      return {
        success: true,
        message: "Memory write queued (not persisted yet)",
        input,
      };
    }
  );

  logger.info("All tools registered successfully");
}
