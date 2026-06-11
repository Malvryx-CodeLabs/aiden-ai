import logger from "../utils/logger";
import { whatsappConnection } from "./connection";
import { messageHandler } from "../handlers/message.handler";

export function startEventListeners() {
  const sock = whatsappConnection.getSocket();

  if (!sock) {
    throw new Error("WhatsApp socket not initialized");
  }

  logger.info("Event listeners started");

  // MAIN MESSAGE PIPELINE
  sock.ev.on("messages.upsert", async (event: any) => {
    try {
      const message = event.messages?.[0];

      if (!message?.message) return;

      logger.info("Incoming message received");

      await messageHandler.handle(event);
    } catch (err) {
      logger.error("Event listener error:", err);
    }
  });

  // CONNECTION STATUS
  sock.ev.on("connection.update", (update: any) => {
    logger.info(
      "Connection update:",
      update?.connection || "unknown"
    );
  });

  // CREDENTIALS UPDATE
  sock.ev.on("creds.update", () => {
    logger.info("Credentials updated");
  });
}
