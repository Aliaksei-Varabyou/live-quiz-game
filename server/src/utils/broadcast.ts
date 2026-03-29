import { getGame } from '../store/game.store';
import { getAllConnectionsForGame } from '../store/connection.store';
import { sendResponse } from './send';
import { WSMessage } from '../types';

export function broadcastToGame(gameId: string, message: WSMessage): void {
  const game = getGame(gameId);
  if (!game) return;

  const connections = getAllConnectionsForGame([...game.players, game.hostId]);
  connections.forEach(ws => {
    if (ws.readyState === ws.OPEN) {
      sendResponse(ws, message);
    }
  })
}

export function broadcastToSuccess(gameId: string, type: string, data: object): void {
  broadcastToGame(gameId, {
    type,
    data,
    id: 0
  })
}
