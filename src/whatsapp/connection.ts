import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import logger from "../utils/logger";

export class WhatsAppConnection {
  private sock: any;

  private authFolder = "./sessions/auth";

  private status: "open" | "closed" | "connecting" =
    "connecting";

  private listeners: {
    [key: string]: ((arg?: any) => void)[];
  } = {};

  async start() {
    const { state, saveCreds } =
      await useMultiFileAuthState(this.authFolder);

    const { version } =
      await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,

      printQRInTerminal: false, // IMPORTANT: disable QR

      browser: ["Aiden", "Chrome", "1.0.0"],
    });

    this.sock.ev.on("creds.update", saveCreds);

    this.sock.ev.on("connection.update", (update: any) => {
      const { connection, lastDisconnect, pairingCode } =
        update;

      // PAIRING CODE MODE ONLY
      if (pairingCode) {
        logger.info(
          `PAIRING CODE: ${pairingCode}`
        );
      }

      if (connection === "open") {
        this.status = "open";
        logger.info("WhatsApp connected successfully");
      }

      if (connection === "close") {
        this.status = "closed";
        const statusCode =
          (lastDisconnect?.error as Boom)?.output
            ?.statusCode;

        const shouldReconnect =
          statusCode !==
          DisconnectReason.loggedOut;

        logger.warn(
          "Connection closed. Reconnecting:",
          shouldReconnect
        );

        this.emit("close", statusCode);

        if (shouldReconnect) {
          this.start();
        }
      }
    });

    this.sock.ev.on("messages.upsert", async (m: any) => {
      const msg = m.messages?.[0];

      if (!msg?.message) return;

      logger.info("New message received");
    });
  }

  getSocket() {
    return this.sock;
  }

  getStatus() {
    return this.status;
  }

  on(event: string, handler: (arg?: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  private emit(event: string, arg?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((handler) =>
        handler(arg)
      );
    }
  }

  async reconnect() {
    logger.warn("Attempting to reconnect...");
    await this.start();
  }
}

export const whatsappConnection =
  new WhatsAppConnection();

export default whatsappConnection;
