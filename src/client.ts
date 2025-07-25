import { Client, Message, LocalAuth } from 'whatsapp-web.js';
import { whatsappMessageFlow } from './flows';
import qrcode from 'qrcode-terminal';

// Gunakan LocalAuth untuk menyimpan sesi
export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // Path executable untuk chromium yang diinstall dari x11-repo
    executablePath: '/data/data/com.termux/files/usr/bin/chromium',
  },
});

client.on('qr', (qr) => {
  // Hanya tampilkan QR jika belum ada sesi yang tersimpan
  console.log('Sesi tidak ditemukan. Silakan pindai kode QR ini dengan WhatsApp Anda:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

// Event ini akan terpanggil jika otentikasi berhasil
client.on('authenticated', () => {
  console.log('Otentikasi berhasil! Sesi telah disimpan.');
});

// Event ini akan terpanggil jika otentikasi gagal
client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('message', (message: Message) => {
  whatsappMessageFlow(message);
});

client.initialize();
