import type { Game } from "@/types";

export function renderRejectStakeRaise(game: Game) {
  return render(game);
}

function render(game: Game) {
  const points = game.currentRound.previousStakePoints;
  return `<button id="asr-y">REJECT<br/>FOR ${points}</button>`;
}
