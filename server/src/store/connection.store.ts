import { WebSocket } from 'ws';

export const store = new Map<WebSocket, string | null>;

export function addConnection(ws: WebSocket): void {
  store.set(ws, null);
}

export function removeConnection(ws: WebSocket): void {
    store.delete(ws);
}

export function getPlayerId(ws: WebSocket): string | null | undefined {
  return store.get(ws);
}

export function setPlayerId(ws: WebSocket, playerId: string): void {
  store.set(ws, playerId);
}
