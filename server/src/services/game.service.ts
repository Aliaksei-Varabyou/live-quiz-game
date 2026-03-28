import { Game, Question } from "../types";
import { broadcastToSuccess } from "../utils/broadcast";

const RESPONSE_TYPE = 'question';

export function sendQuestion(game: Game): void {
  const current: Question = game.questions[game.currentQuestion];
  game.questionStartTime = Date.now();
  game.playerAnswers = new Map();
  game.questionTimer = setTimeout(() => {
    //ToDO: finish question
  }, current.timeLimitSec * 1000 );
  
  broadcastToSuccess(game.id, RESPONSE_TYPE, {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: game.questions.length,
      text: current.text,
      options: current.options,
      timeLimitSec: current.timeLimitSec
    })
}