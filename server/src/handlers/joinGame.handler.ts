import { WebSocket } from 'ws';
import { Game, JoinGameData } from '../types';
import { getPlayerId } from '../store/connection.store';
import { sendError, sendSuccess } from '../utils/send';
import { addPlayerToGame, getGameByCode, setPlayerGame } from '../store/game.store';
import { getPlayer } from '../store/player.store';
import { broadcastToSuccess } from '../utils/broadcast';

const RESPONSE_TYPE = 'game_joined';
const REQUEST_TYPE = 'join_game';
const BROADCAST_TYPE = 'player_joined';
const BROADCAST_TYPE2 = 'update_players';

function gameChecks(ws: WebSocket, game: Game | undefined, playerId: string): boolean {
  if (!game) {
    sendError(ws, REQUEST_TYPE, 'Game not found');
    return false;
  }
  if (game.status !== 'waiting') {
    sendError(ws, REQUEST_TYPE, 'Game already started');
    return false;
  }
  if (game.players.includes(playerId)) {
    sendError(ws, REQUEST_TYPE, 'Player already joined');
    return false;
  }
  return true;
}

export function handleJoinGame(ws: WebSocket, data: JoinGameData): void {
  console.log('join_game called');
  const code = data.code?.trim().toUpperCase();
  const playerId = getPlayerId(ws);
  if (code && playerId) {
    // game checks
    const game: Game | undefined = getGameByCode(code);
    if (!gameChecks(ws, game, playerId)) return;
    if (game) {
      addPlayerToGame(game.id, playerId);
      setPlayerGame(playerId, game.id);
      sendSuccess(ws, RESPONSE_TYPE, {
        gameId: game.id
      })

      // broadcast 'player_joined'
      const joinedPlayer = getPlayer(playerId);
      if (!joinedPlayer) return;
      broadcastToSuccess(game.id, BROADCAST_TYPE, {
        playerName: joinedPlayer.name,
        playerCount: game.players.length
      });

      // broadcast 'update_players'
      const playersData = game.players
        .map(id => getPlayer(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map(p => ({
          name: p.name,
          index: p.index,
          score: p.score
        }));
      broadcastToSuccess(game.id, BROADCAST_TYPE2, playersData);
    }
  } else {
    if (!code) sendError(ws, REQUEST_TYPE, 'Join game invalid code');
    else if (!playerId) sendError(ws, REQUEST_TYPE, 'Unauthorized');
  }
}
