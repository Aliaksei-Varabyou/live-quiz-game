import { WebSocket } from 'ws';
import { CreateGameData, Game, Question } from '../types';
import { sendError, sendSuccess } from '../utils/send';
import { generateGameCode, generateId } from '../utils/id';
import { createGame, getAllGames, setPlayerGame } from '../store/game.store';
import { getPlayerId } from '../store/connection.store';

const RESPONSE_TYPE = 'game_created';

function isQuestionsArray(arr: unknown): arr is Question[] {
  return Array.isArray(arr) && arr.every(item => 
    typeof item === 'object' &&
    item !== null &&
    typeof item.text === 'string' &&
    Array.isArray(item.options) &&
    item.options.length === 4 &&
    typeof item.correctIndex === 'number' &&
    typeof item.timeLimitSec === 'number' &&
    item.correctIndex >= 0 && 
    item.correctIndex < 4 &&
    item.timeLimitSec > 0
  );
}

function isGameCodeTaken(code: string): boolean {
  const games = getAllGames();
  return games.findIndex(g => g.code === code) !== -1;
}

export function handleCreateGame(ws: WebSocket, data: CreateGameData): void {
  console.log('create_game called');
  const questions: Question[] = data.questions;
  const playerId = getPlayerId(ws);
  const checkQuestions = questions && isQuestionsArray(questions);
  if (checkQuestions && playerId) {
    // generate code;
    let code;
    do {
      code = generateGameCode();
    } while(isGameCodeTaken(code));

    const game: Game = {
      id: generateId(),
      code: code,
      hostId: playerId,
      questions: questions,
      players: [playerId],
      currentQuestion: -1,
      status: 'waiting',
      playerAnswers: new Map()
    }
    createGame(game);
    setPlayerGame(playerId, game.id);
    sendSuccess(ws, RESPONSE_TYPE, {
      code: game.code,
      gameId: game.id
    })
  } else {
    if (!checkQuestions) sendError(ws, 'Create game invalid questions');
    else if (!playerId) sendError(ws, 'Unauthorized');
  }

}
