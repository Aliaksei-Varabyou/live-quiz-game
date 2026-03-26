import { WebSocket } from 'ws';
import { WSMessage } from "../types";

export const sendResponse = (ws: WebSocket, response: WSMessage): void => {
  if (response) {
    ws.send(JSON.stringify(response));
  }
};
