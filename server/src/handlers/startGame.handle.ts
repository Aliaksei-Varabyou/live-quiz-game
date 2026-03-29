import { WebSocket } from 'ws';
import { Game, StartGameData } from '../types';
import { sendError } from '../utils/send';
import { getGame } from '../store/game.store';
import { getPlayerId } from '../store/connection.store';
import { sendQuestion } from '../services/game.service';

const REQUEST_TYPE = 'start_game';

function checks(ws: WebSocket, game: Game, playerId: string): boolean {
  if (game.hostId !== playerId) {
    sendError(ws, REQUEST_TYPE, 'Only host can start game');
    return false;
  }
  if (game.status !== 'waiting') {
    sendError(ws, REQUEST_TYPE, 'Game already started');
    return false;
  }
  return true;
}

export function handleStartGame(ws: WebSocket, data: StartGameData): void {
  console.log('start_game called');
  const game: Game | undefined = getGame(data.gameId);
  const playerId = getPlayerId(ws);
  if (game && playerId) {
    if (!checks(ws, game, playerId)) return;

    game.status = 'in_progress';
    game.currentQuestion = 0;
    sendQuestion(game);
    
  } else {
    if (!game) sendError(ws, REQUEST_TYPE, 'Game not found');
    else if (!playerId) sendError(ws, REQUEST_TYPE, 'Unauthorized');
  }

}
