import { WebSocket } from 'ws';

const connectionStore = new Map<WebSocket, string | null>;

export function addConnection(ws: WebSocket): void {
  connectionStore.set(ws, null);
}

export function removeConnection(ws: WebSocket): void {
    connectionStore.delete(ws);
}

export function getPlayerId(ws: WebSocket): string | null | undefined {
  return connectionStore.get(ws);
}

export function setPlayerId(ws: WebSocket, playerId: string): void {
  connectionStore.set(ws, playerId);
}

export function getAllConnections(): (string | null)[] {
  return Array.from(connectionStore.values());
}

export function getAllConnectionsForGame(playerIds: string[]): WebSocket[] {
  const playerIdSet = new Set(playerIds);

  return [...connectionStore.entries()]
    .filter(([_, playerId]) => playerId !== null && playerIdSet.has(playerId))
    .map(([ws]) => ws);
}
