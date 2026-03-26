import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { sendResponse } from './utils/send';
import { WSMessage } from './types';
import { handleMessage } from './handlers';
import { addConnection, removeConnection } from './store/connection.store';

dotenv.config({debug: false});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// WebSocket server
const wss = new WebSocketServer({ port: PORT });
console.log(`WS server running on ws://localhost:${PORT}`);

wss.on('connection', function connection(ws: WebSocket) {
  addConnection(ws);

  ws.on('error', console.error);

  ws.on('message', function message(data: Buffer) {
    try {
      console.log('received: %s', data.toString());
      const message: WSMessage = JSON.parse(data.toString());
      handleMessage(ws, message);
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
    removeConnection(ws);
  });
});
