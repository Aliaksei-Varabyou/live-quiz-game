import { WebSocket } from 'ws';
import { WSMessage } from '../types';
import { handleReg } from './reg.handler';

export function handleMessage(ws: WebSocket, message: WSMessage) {
  switch (message?.type) {
    case 'reg':
      handleReg(ws, message.data);
      break;
    default:
      console.log('unknown message type');
  }
}
