import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import logger from "../utils/logger";

export class WhatsAppConnection {
  private sock: any;
  private store = makeInMemoryStore({});

  private authFolder = "./sessions/auth";

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

    this.store.bind(this.sock.ev);

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
        logger.info("WhatsApp connected successfully");
      }

      if (connection === "close") {
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
}

export const whatsappConnection =
  new WhatsAppConnection();

export default whatsappConnection;
