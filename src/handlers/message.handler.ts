import logger from "../utils/logger";
import { messageRouter } from "../core/router";
import { aiService } from "../services/ai.service";
import { responseBuilder } from "../core/response-builder";
import { messageSender } from "../whatsapp/sender";

export class MessageHandler {
  async handle(event: any): Promise<void> {
    try {
      const message = event.messages?.[0];

      if (!message?.message) return;

      const isGroup =
        message.key?.remoteJid?.endsWith("@g.us");

      const isDM = !isGroup;

      const senderId =
        message.key?.participant ||
        message.key?.remoteJid;

      const groupId = isGroup
        ? message.key?.remoteJid
        : undefined;

      const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        "";

      const isMentioned = text.includes("@");

      const isAdmin = false;

      const ctx = {
        senderId,
        groupId,
        isGroup,
        isDM,
        text,
        isMentioned,
        isAdmin,
      };

      logger.info("Message received:", ctx);

      // ROUTE (you can extend later)
      await messageRouter.route(ctx);

      // AI GENERATION
      const ai = await aiService.generate(ctx);

      // RESPONSE BUILDING
      const final =
        await responseBuilder.build({
          text: ai.text,
          mode: isGroup ? "GROUP" : "DM",
          senderId,
          groupId,
        });

      // SEND BACK TO WHATSAPP
      const jid = groupId || senderId;

      await messageSender.sendText({
        jid,
        text: final.text,
        quoted: message,
      });

    } catch (err) {
      logger.error("Message handler error:", err);
    }
  }
}

export const messageHandler =
  new MessageHandler();

export default messageHandler;
