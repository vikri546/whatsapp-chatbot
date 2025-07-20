# WhatsApp Chatbot Template

This template provides a starting point for building a WhatsApp chatbot using Node.js. It is integrated with the WhatsApp Web API, supports middleware, and has a modular plugin system.

## Installation

```bash
npm install
```

## Usage

To use this template, you need to import it and run it in a Node.js environment.

```typescript
import './src/index';
```

When you run this code, a QR code will be printed to the console. Scan this QR code with your phone to connect your WhatsApp account.

Once connected, the chatbot will respond to any incoming messages by echoing them back to the sender.

## Customization

To customize the chatbot's behavior, you can modify the `whatsappMessageFlow` in `src/flows.ts`. This is where you can add your own logic, integrate with other services, and use middleware and plugins to extend the chatbot's functionality.
