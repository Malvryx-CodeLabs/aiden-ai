import toolEngine from "../core/tool-engine";
import { sandbox } from "../security/sandbox";
import logger from "../utils/logger";

export class ToolService {
  async execute(name: string, input: any) {
    logger.info(`Tool request: ${name}`);

    return await sandbox.safeExecute(async () => {
      return await toolEngine.runTool(name, input);
    });
  }

  list() {
    return toolEngine.listTools();
  }
}

export const toolService = new ToolService();
export default toolService;
