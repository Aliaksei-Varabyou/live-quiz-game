import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { WSMessage } from './types';

dotenv.config({debug: false});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// WebSocket server
const wss = new WebSocketServer({ port: PORT });
const store = new Map<WebSocket, string | null>;
console.log(`WS server running on ws://localhost:${PORT}`);

wss.on('connection', function connection(ws: WebSocket) {
  store.set(ws, null);

  ws.on('error', console.error);

  ws.on('message', function message(data: Buffer) {
    try {
      console.log('received: %s', data.toString());
      const message = JSON.parse(data.toString());
      switch (message?.type) {
        case 'reg':
          console.log('reg called');
        default:
          console.log('unknown message type');
      }
    } catch (err) {
      console.log(err);
      sendResponse(ws, {
        type: 'error',
        data: { message: 'Invalid JSON' },
        id: 0
      });
    }
  });

  ws.on('close', function close() {
    console.log('client disconnect');
    store.delete(ws);
  });
});

export const sendResponse = (ws: WebSocket, response: WSMessage): void => {
  if (response) {
    ws.send(JSON.stringify(response));
  }
}
