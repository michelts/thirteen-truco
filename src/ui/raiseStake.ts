import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { stakeRaised } from "./events";

export function renderRaiseStake(game: Game) {
  const redraw = () => {
    getElement("rs").outerHTML = render(game);
  };
  setTimeout(() => {
    window.addEventListener("stakeRaised", redraw);
    window.addEventListener("stakeRaiseAnswered", redraw);
    window.addEventListener("roundAcknowledged", redraw);
  });
  return render(game);
}

function render(game: Game) {
  setTimeout(() => {
    getElement("rs").addEventListener("click", () => {
      const player = game.players[0];
      game.currentRound.raiseStake(player);
      dispatchEvent(stakeRaised(game, player));
    });
  });
  return `<button id="rs"${game.currentRound.stake.isAccepted === undefined ? " disabled=" : ""}>RAISE<br/>TO ${game.currentRound.nextStakePoints}</button>`;
}
