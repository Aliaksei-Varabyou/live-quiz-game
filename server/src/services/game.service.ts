import { getPlayer } from "../store/player.store";
import { Game, Player, Question } from "../types";
import { broadcastToSuccess } from "../utils/broadcast";

const RESPONSE_TYPE = 'question';
const BASE_POINTS = 1000;

export function sendQuestion(game: Game): void {
  const currentQuestion: Question = game.questions[game.currentQuestion];
  game.questionStartTime = Date.now();
  game.playerAnswers.clear();
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
  if (!game.questionTimer) return;
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
        "answered": !!answer,
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

  if (game.currentQuestion + 1 < game.questions.length) {
    game.currentQuestion++;
    sendQuestion(game);
  } else {
    finishGame(game);
  }
}

export function finishGame(game: Game): void {
  game.status = 'finished';
  const ranks: Player[] = [];
  game.players.forEach(playerId => {
    const player = getPlayer(playerId);
    if (player) {
      ranks.push(player);
    }
  });
  ranks.sort((a, b) => b.score - a.score);
  const scoreboard: { name: string; score: number; rank: number; }[] = [];
  ranks.forEach((p, index) => {
    scoreboard.push({
      name: p.name,
      score: p.score,
      rank: index + 1
    })
  })

  broadcastToSuccess(game.id, 'game_finished', {
    scoreboard
  });
}
