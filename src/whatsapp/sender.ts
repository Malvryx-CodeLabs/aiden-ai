import logger from "../utils/logger";
import { whatsappConnection } from "./connection";

export interface SendMessageInput {
  jid: string;

  text: string;

  quoted?: any;
}

export class MessageSender {
  private get sock() {
    return whatsappConnection.getSocket();
  }

  async sendText(input: SendMessageInput): Promise<void> {
    try {
      const sock = this.sock;

      if (!sock) {
        throw new Error("WhatsApp socket not ready");
      }

      logger.info(
        `Sending message to ${input.jid}`
      );

      await sock.sendMessage(input.jid, {
        text: input.text,
      },
      {
        quoted: input.quoted,
      });

    } catch (err) {
      logger.error("Send message error:", err);
    }
  }

  async reply(
    jid: string,
    text: string,
    message: any
  ): Promise<void> {
    return this.sendText({
      jid,
      text,
      quoted: message,
    });
  }
}

export const messageSender =
  new MessageSender();

export default messageSender;
