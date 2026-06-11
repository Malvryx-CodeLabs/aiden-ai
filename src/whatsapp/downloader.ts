import logger from "../utils/logger";

export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker";

export interface DownloadedMedia {
  type: MediaType;

  buffer: Buffer;

  mimeType?: string;

  fileName?: string;

  size?: number;
}

export class MediaDownloader {
  async download(
    message: any
  ): Promise<DownloadedMedia | null> {
    try {
      const msg = message?.message;

      if (!msg) return null;

      // IMAGE
      if (msg.imageMessage) {
        logger.info("Image detected");

        return {
          type: "image",
          buffer: Buffer.alloc(0), // TODO: wire Baileys download
          mimeType: msg.imageMessage.mimetype,
        };
      }

      // VIDEO
      if (msg.videoMessage) {
        logger.info("Video detected");

        return {
          type: "video",
          buffer: Buffer.alloc(0),
          mimeType: msg.videoMessage.mimetype,
        };
      }

      // AUDIO
      if (msg.audioMessage) {
        logger.info("Audio detected");

        return {
          type: "audio",
          buffer: Buffer.alloc(0),
          mimeType: msg.audioMessage.mimetype,
        };
      }

      // DOCUMENT
      if (msg.documentMessage) {
        logger.info("Document detected");

        return {
          type: "document",
          buffer: Buffer.alloc(0),
          mimeType: msg.documentMessage.mimetype,
          fileName: msg.documentMessage.fileName,
        };
      }

      // STICKER
      if (msg.stickerMessage) {
        logger.info("Sticker detected");

        return {
          type: "sticker",
          buffer: Buffer.alloc(0),
          mimeType: msg.stickerMessage.mimetype,
        };
      }

      return null;
    } catch (err) {
      logger.error("Media download error:", err);
      return null;
    }
  }
}

export const mediaDownloader =
  new MediaDownloader();

export default mediaDownloader;
