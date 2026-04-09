import { WebSocket } from 'ws';
import { WSMessage } from '../types';
import { handleReg } from './reg.handler';
import { handleCreateGame } from './createGame.handler';
import { handleJoinGame } from './joinGame.handler';
import { handleStartGame } from './startGame.handle';
import { handleAnswer } from './answer.handler';

export function handleMessage(ws: WebSocket, message: WSMessage) {
  switch (message?.type) {
    case 'reg':
      handleReg(ws, message.data);
      break;
    case 'create_game':
      handleCreateGame(ws, message.data);
      break;
    case 'join_game':
      handleJoinGame(ws, message.data);
      break;
    case 'start_game':
      handleStartGame(ws, message.data);
      break;
    case 'answer':
      handleAnswer(ws, message.data);
      break;
    default:
      console.log('unknown message type');
  }
}
