import { client } from './client';
import { Message, MessageMedia } from 'whatsapp-web.js';
import { generateResponse } from './gemini';
import { fetchUrlContent } from './urlAnalyzer';
import sharp from 'sharp';

// Fungsi utilitas untuk membuat stiker dari media
const createSticker = async (media: MessageMedia, message: Message) => {
  try {
    const author = process.env.BOT_NAME || 'Mita';
    const stickerName = process.env.OWNER_NAME || 'Sticker';
    const ownerName = process.env.OWNER_NAME || 'Vikk'; // Menggunakan Vikk sebagai default

    // Balas dengan teks terlebih dahulu
    await message.reply(`Stiker sedang dibuat, ${ownerName}!`);

    // Proses dan kirim stiker sebagai pesan baru
    if (media.mimetype.includes('video')) {
      await client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: author,
        stickerName: stickerName
      });
      return;
    }

    const imageBuffer = Buffer.from(media.data, 'base64');
    const stickerBuffer = await sharp(imageBuffer).resize({ fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFormat('webp').toBuffer();
    const stickerMedia = new MessageMedia('image/webp', stickerBuffer.toString('base64'), 'sticker.webp');
    
    await client.sendMessage(message.from, stickerMedia, {
      sendMediaAsSticker: true,
      stickerAuthor: author,
      stickerName: stickerName
    });

  } catch (error) {
    console.error('Error creating sticker:', error);
    await message.reply('Maaf, terjadi kesalahan saat membuat stiker.');
  }
};

// Fungsi utilitas untuk menganalisis gambar dengan AI
const analyzeImage = async (media: MessageMedia, prompt: string, message: Message) => {
  try {
    await message.reply('Menganalisis gambar...');
    const response = await generateResponse(message.from, prompt, media);
    await message.reply(response);
  } catch (e) {
    await message.reply('Gagal menganalisis gambar.');
  }
};

const handleLinkAnalysis = async (url: string, message: Message) => {
  try {
    await message.reply('Menganalisis tautan...');
    const content = await fetchUrlContent(url);
    if (!content) return message.reply('Gagal mengambil konten dari tautan.');
    const prompt = `Berikut adalah konten dari situs web: "${content}"\n\nTolong ringkas dan jelaskan poin-poin utamanya.`;
    const response = await generateResponse(message.from, prompt);
    await message.reply(response);
  } catch (e) {
    await message.reply('Gagal menganalisis tautan.');
  }
};


// --- ALUR UTAMA PENANGANAN PESAN ---

export const whatsappMessageFlow = async (message: Message) => {
  console.log(`[${new Date().toISOString()}] Received from: ${message.from}`);
  const isOwner = message.from === `${process.env.OWNER_NUMBER}@c.us`;
  if (!isOwner) return;

  const body = message.body || "";
  const stickerCommand = body.toLowerCase().startsWith('.sticker') || body.toLowerCase().startsWith('.stiker');
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = body.match(urlRegex);

  // --- LOGIKA BALASAN (QUOTED MESSAGE) ---
  if (message.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      const media = await quotedMsg.downloadMedia();
      if (stickerCommand) return createSticker(media, message);
      return analyzeImage(media, body, message);
    }
    if (quotedMsg.body) {
      const context = `Konteks sebelumnya: "${quotedMsg.body}"\nPesan saya: "${body}"`;
      const response = await generateResponse(message.from, context);
      return client.sendMessage(message.from, response);
    }
  }

  // --- LOGIKA PESAN BARU (NON-REPLY) ---

  // Prioritas 1: Perintah Stiker dengan Media
  if (stickerCommand && message.hasMedia) {
    const media = await message.downloadMedia();
    return createSticker(media, message);
  }

  // Prioritas 2: Analisis Tautan
  if (urls) {
    return handleLinkAnalysis(urls[0], message);
  }

  // Prioritas 3: Analisis Gambar
  if (message.hasMedia && message.type === 'image') {
    const media = await message.downloadMedia();
    return analyzeImage(media, body, message);
  }

  // Prioritas 4: Pesan Teks Biasa
  const response = await generateResponse(message.from, body);
  return client.sendMessage(message.from, response);
};
