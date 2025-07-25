// src/commands.ts
import { Message, MessageMedia } from 'whatsapp-web.js';
import sharp from 'sharp';
import { client } from './client';

// Interface untuk setiap perintah
interface Command {
  name: string;
  description: string;
  command: string | string[];
  execute: (message: Message, args: string) => Promise<void>;
  needsMedia?: boolean;
}

// Koleksi semua perintah
export const commands: Command[] = [
  {
    name: 'Sticker Creator',
    description: 'Ubah gambar atau video pendek menjadi stiker. Kirim media dengan caption perintah ini.',
    command: ['.sticker', '.stiker', '.s'],
    needsMedia: true,
    execute: async (message) => {
      try {
        const media = await message.downloadMedia();

        if (media.mimetype.includes('video')) {
          client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: process.env.BOT_NAME, stickerName: process.env.OWNER_NAME });
          await message.reply('Ini stiker animasinya ^^');
          return;
        }

        const imageBuffer = Buffer.from(media.data, 'base64');
        const stickerBuffer = await sharp(imageBuffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFormat('webp').toBuffer();
        const stickerMedia = new MessageMedia('image/webp', stickerBuffer.toString('base64'), 'sticker.webp');

        await client.sendMessage(message.from, stickerMedia, { sendMediaAsSticker: true, stickerAuthor: process.env.BOT_NAME, stickerName: process.env.OWNER_NAME });
        await message.reply('Stikernya sudah jadi, ' + (process.env.OWNER_NAME || 'Boss') + '!');
      } catch (error) {
        console.error('Error creating sticker:', error);
        await message.reply('Maaf, ada kesalahan saat membuat stiker. Pastikan itu gambar atau video pendek ya.');
      }
    },
  }
];
