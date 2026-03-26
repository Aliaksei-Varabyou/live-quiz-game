import { WebSocket } from 'ws';
import { Player } from "../types";

const playerStore = new Map<string, Player>;

export function addPlayer(player: Player): void {
  playerStore.set(player.index, player);
}

export function getPlayer(id: string): Player | undefined {
  return playerStore.get(id);
}

export function getAllPlayers(): (Player | null)[] {
  return Array.from(playerStore.values());
}

export function updatePlayerScore(playerId: string, score: number): void {
  const player = getPlayer(playerId);
  if (player) {
    player.score = score;
    playerStore.set(playerId, player);
  }
}
