import { Client, Message } from 'whatsapp-web.js';
import { whatsappMessageFlow } from './flows';

export const client = new Client({});

client.on('qr', (qr) => {
  // Generate and scan this QR code with your phone
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', (message: Message) => {
  whatsappMessageFlow(message);
});

client.initialize();
