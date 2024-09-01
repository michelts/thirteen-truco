import type { Game } from "@/types";

export function renderGiveUpRound(game: Game) {
  return render(game);
}

function render(game: Game) {
  return `<button id="gvu"${game.currentRound.stake.isAccepted === undefined ? " disabled=" : ""}>LEAVE<br/>ROUND</button>`;
}
