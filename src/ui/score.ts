import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { range } from "@/utils/range";

export function renderScore(game: Game) {
  function redraw() {
    getElement("scr").innerHTML = render(game);
  }
  window.addEventListener("gameReset", redraw);
  window.addEventListener("stepDone", redraw);
  window.addEventListener("roundDone", redraw);
  window.addEventListener("roundContinued", redraw);
  return `<div id="scr">${render(game)}</div>`;
}

function render(game: Game) {
  const [us, them] = game.score;
  return `<span>SCORE</span><div><div>${us}</div>${getStepScore(game).join("")}<div>${them}</div></div>`;
}

function getStepScore(game: Game) {
  return range(3)
    .map((index) => {
      const step = game.currentRound.steps?.[index];
      if (!step?.isDone) {
        return " ";
      }
      if (step.winner === undefined) {
        return "D";
      }
      return step.winner?.teamIndex === 0 ? "W" : "L";
    })
    .map((value) => `<div>${value}</div>`);
}
