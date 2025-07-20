import { client } from "./client";
import { Message } from "whatsapp-web.js";

// Define a middleware function
const loggerMiddleware = (message: Message, next: () => void) => {
  console.log(`[${new Date().toISOString()}] Received message: ${message.body}`);
  next();
};

// Define a plugin
const echoPlugin = (message: Message) => {
  const response = `You said: ${message.body}`;
  client.sendMessage(message.from, response);
};

// Define the main message handler
export const whatsappMessageFlow = (message: Message) => {
  // Use the middleware
  loggerMiddleware(message, () => {
    // Use the plugin
    echoPlugin(message);
  });
};
