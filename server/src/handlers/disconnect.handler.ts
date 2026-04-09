import { WebSocket } from 'ws';
import { getPlayerId, removeConnection } from '../store/connection.store';
import { deleteGame, getGame, getPlayerGame, removePlayerGame } from '../store/game.store';
import { Game } from '../types';
import { getPlayer } from '../store/player.store';
import { finishGame, finishQuestion } from '../services/game.service';
import { broadcastToSuccess } from '../utils/broadcast';

function removePlayerFromGame(playerId: string, game: Game): void {
  game.players = game.players.filter(id => id !== playerId);
  removePlayerGame(playerId);
}

export function handleDisconnect(ws: WebSocket): void {
  const playerId = getPlayerId(ws);
  if (!playerId) return;

  console.log(`[disconnect] player ${playerId}`);

  const gameId = getPlayerGame(playerId);
  if (!gameId) {
    removeConnection(ws);
    return;
  }

  const game = getGame(gameId);
  if (!game) {
    removeConnection(ws);
    return;
  }

  // if it is host
  if (game.hostId === playerId) {
    removePlayerFromGame(playerId, game);
    removeConnection(ws);

    finishGame(game);
    return;
  }

  // if usual player (not host)
  game.playerAnswers.delete(playerId);
  removePlayerFromGame(playerId, game);
  removeConnection(ws);

  // if nobody stayed
  if (game.players.length === 0) {
    deleteGame(game.id);
    return;
  }

  // if everybody already answered
  if (
    game.status === 'in_progress' &&
    game.playerAnswers.size === game.players.length
  ) {
    finishQuestion(game);
    return;
  }

  // update_players
  const playersData = game.players
    .map(id => getPlayer(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(p => ({
      name: p.name,
      index: p.index,
      score: p.score
    }));

  broadcastToSuccess(game.id, 'update_players', playersData);
}
