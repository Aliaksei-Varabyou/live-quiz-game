import { WebSocket } from 'ws';
import { AnswerData, Game } from "../types";
import { getGame } from '../store/game.store';
import { getPlayerId } from '../store/connection.store';
import { sendError, sendSuccess } from '../utils/send';
import { finishQuestion } from '../services/game.service';

const REQUEST_TYPE = 'answer';
const RESPONSE_TYPE = 'answer_accepted';

function checks(ws: WebSocket, game: Game, playerId: string, questionIndex: number): boolean {
  if (!game.players.includes(playerId)) {
    sendError(ws, REQUEST_TYPE, 'Player not in game');
    return false;
  }
  if (game.status !== 'in_progress') {
    sendError(ws, REQUEST_TYPE, 'Game not in progress');
    return false;
  }
  if (game.currentQuestion !== questionIndex) {
    sendError(ws, REQUEST_TYPE, 'Invalid question index');
    return false;
  }
  if (game.playerAnswers.has(playerId)) {
    sendError(ws, REQUEST_TYPE, 'Player already answered');
    return false;
  }
  return true;
}

export function handleAnswer(ws: WebSocket, data: AnswerData): void {
  console.log('answer called');
  const {gameId, questionIndex, answerIndex } = data;
  const game: Game | undefined = getGame(gameId);
  const playerId = getPlayerId(ws);
  if (game && playerId) {
    if (!checks(ws, game, playerId, questionIndex)) return;

    game.playerAnswers.set(playerId, {
      answerIndex: answerIndex,
      timestamp: Date.now()
    });
    sendSuccess(ws, RESPONSE_TYPE, {
      questionIndex: questionIndex
    })

    // if everybody already answered
    if (game.players.length === game.playerAnswers.size) {
      finishQuestion(game);
    }
  } else {
    if (!game) sendError(ws, REQUEST_TYPE, 'Game not found');
    else if (!playerId) sendError(ws, REQUEST_TYPE, 'Unauthorized');
  }
}
