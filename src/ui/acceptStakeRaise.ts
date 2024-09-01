import type { Game } from "@/types";

export function renderAcceptStakeRaise(game: Game) {
  return render(game);
}

function render(game: Game) {
  const points = game.currentRound.currentStakePoints;
  return `<button id="asr-y">ACCEPT<br/>FOR ${points}</button>`;
}
