import { WebSocket } from 'ws';
import { setPlayerId } from "../store/connection.store";
import { addPlayer } from "../store/player.store";
import { addUser, getUser } from "../store/user.store";
import { Player, RegData, User } from "../types";
import { generateId } from "../utils/id";
import { sendError, sendSuccess } from '../utils/send';

const TYPE = 'reg';

export function handleReg(ws: WebSocket, data: RegData): void {
  console.log('reg called');
  if (data.name && data.password) {
    let user: User | undefined = getUser(data.name);
    if (user) { //login
      if (user.password !== data.password) {
        sendError(ws, 'Incorrect password');
        return;
      }
    } else { //register
      user = {
        name: data.name,
        password: data.password,
        index: generateId()
      };
      addUser(user);
    }
    // add new Player
    const player: Player = {
      name: user.name,
      index: generateId(),
      score: 0
    }
    addPlayer(player);
    setPlayerId(ws, player.index);
    sendSuccess(ws, TYPE, {
      name: user.name,
      index: player.index,
      error: false,
      errorText: ''
    })
  } else {
    sendError(ws, 'Error response');
  }
}
