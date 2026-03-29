import { WebSocket } from 'ws';
import { WSMessage } from "../types";

export const sendResponse = (ws: WebSocket, response: WSMessage): void => {
  if (response) {
    ws.send(JSON.stringify(response));
  }
};

export const sendError = (ws: WebSocket, type: string, message: string): void => {
  sendResponse(ws, {
    type: type,
    data: {
      error: true,
      errorText: message
    },
    id: 0
  })
};

export const sendSuccess = (ws: WebSocket, type: string, data: object): void => {
  sendResponse(ws, {
    type: type,
    data: data,
    id: 0
  })
}
