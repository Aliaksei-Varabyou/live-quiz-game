import { Game } from "../types";
import { getPlayer } from "./player.store";

const gameStore = new Map<string, Game>;
const playerGameConnectionStore = new Map<string, string>;

export function createGame(game: Game): void {
  gameStore.set(game.id, game);
}

export function getGame(id: string): Game | undefined {
  return gameStore.get(id);
}

export function getGameByCode(code: string): Game | undefined {
  return Array.from(gameStore.values()).find(g => g.code === code);
}

export function getAllGames(): Game[] {
  return Array.from(gameStore.values());
}

export function addPlayerToGame(gameId: string, playerId: string): void {
  const game = getGame(gameId);
  const player = getPlayer(playerId);
  if (game && player) {
    if (game.players.indexOf(playerId) === -1) {
      game?.players.push(playerId);
      gameStore.set(game.id, game);
    }
  }
}

export function setPlayerGame(playerId: string, gameId: string): void {
  playerGameConnectionStore.set(playerId, gameId);
}

export function getPlayerGame(playerId: string): string | undefined {
  return playerGameConnectionStore.get(playerId);
}

export function removePlayerGame(playerId: string): void {
  playerGameConnectionStore.delete(playerId);
}
