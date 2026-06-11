import logger from "./utils/logger";
import { whatsappConnection } from "./whatsapp/connection";
import { startEventListeners } from "./whatsapp/event-listeners";
import { registerTools } from "./tools";
import { runtimeConfig } from "./config/runtime";

export class Bootstrap {
  async start(): Promise<void> {
    try {
      logger.info("Starting Aiden AI system...");

      logger.info(
        `Active model: ${runtimeConfig.activeModel}`
      );

      logger.info(
        `Active provider: ${runtimeConfig.activeProvider}`
      );

      // 1. REGISTER TOOLS
      registerTools();

      // 2. START WHATSAPP CONNECTION
      await whatsappConnection.start();

      // 3. START EVENT LISTENERS
      startEventListeners();

      logger.info("Aiden is now ONLINE 🚀");
    } catch (err) {
      logger.error("Bootstrap failed:", err);
      process.exit(1);
    }
  }
}

export const bootstrap = new Bootstrap();
