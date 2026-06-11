import logger from "../utils/logger";
import { Role } from "../types/permission";

export interface IncomingMessage {
  senderId: string;

  groupId?: string;

  isGroup: boolean;

  isDM: boolean;

  text: string;

  isMentioned: boolean;

  isAdmin: boolean;
}

export class MessageRouter {
  async route(message: IncomingMessage): Promise<void> {
    logger.info("Routing message...");

    // BASIC FILTER
    if (!message.text || message.text.trim().length === 0) {
      return;
    }

    // COMMAND DETECTION
    if (message.text.startsWith("Aiden ")) {
      return this.handleCommand(message);
    }

    // GROUP FLOW
    if (message.isGroup) {
      return this.handleGroupMessage(message);
    }

    // DM FLOW
    if (message.isDM) {
      return this.handleDMMessage(message);
    }

    // DEFAULT FLOW
    return this.handleGeneralMessage(message);
  }

  private async handleCommand(msg: IncomingMessage) {
    logger.info("Handling command:", msg.text);

    // NEXT: command handler system
  }

  private async handleGroupMessage(msg: IncomingMessage) {
    logger.info("Group message received");

    // NEXT: group AI + policy checks
  }

  private async handleDMMessage(msg: IncomingMessage) {
    logger.info("DM message received");

    // NEXT: DM AI + memory layer
  }

  private async handleGeneralMessage(msg: IncomingMessage) {
    logger.info("General message received");

    // NEXT: fallback AI response
  }
}

export const messageRouter = new MessageRouter();

export default messageRouter;
