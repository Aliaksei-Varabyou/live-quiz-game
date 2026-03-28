import { getPlayer } from "../store/player.store";
import { Game, Question } from "../types";
import { broadcastToSuccess } from "../utils/broadcast";

const RESPONSE_TYPE = 'question';
const BASE_POINTS = 1000;

export function sendQuestion(game: Game): void {
  const currentQuestion: Question = game.questions[game.currentQuestion];
  game.questionStartTime = Date.now();
  game.playerAnswers = new Map();
  game.questionTimer = setTimeout(() => {
    finishQuestion(game);
  }, currentQuestion.timeLimitSec * 1000 );

  broadcastToSuccess(game.id, RESPONSE_TYPE, {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: game.questions.length,
      text: currentQuestion.text,
      options: currentQuestion.options,
      timeLimitSec: currentQuestion.timeLimitSec
    })
}

export function finishQuestion(game: Game): void {
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = undefined;
  }
  const currentQuestion: Question = game.questions[game.currentQuestion];
  const playerResults: { name: string; answered: boolean; correct: boolean; pointsEarned: number; totalScore: number; }[] = [];
  game.players.forEach(playerId => {
    const player = getPlayer(playerId);
    if (player) {
      const answer = game.playerAnswers.get(playerId);
      let points = 0;
      let correct = false;
      if (answer) {
        correct = answer.answerIndex === currentQuestion.correctIndex;
        if (correct) {
          const timeLimit: number = currentQuestion.timeLimitSec;
          const timeRemaining: number = timeLimit - (answer.timestamp - game.questionStartTime!) / 1000
          points = Math.round(BASE_POINTS * Math.max(0, (timeRemaining / timeLimit)));
        }
      }
      player.score += points;
      playerResults.push({
        "name": player.name,
        "answered": Boolean(answer),
        "correct": correct,
        "pointsEarned": points,
        "totalScore": player.score
      })
    }
  });

  broadcastToSuccess(game.id, 'question_result', {
    questionIndex: game.currentQuestion,
    correctIndex: currentQuestion.correctIndex,
    playerResults
  });

  if (game.questions.length - 1 < game.currentQuestion) {
    game.currentQuestion++;
    sendQuestion(game);
  } else {
    // ToDo: finish game
  }
}
