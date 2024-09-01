import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { stakeRaiseAnswered } from "./events";

export function renderRejectStakeRaise(game: Game) {
  return render(game);
}

function render(game: Game) {
  setTimeout(() => {
    getElement("asr-n").addEventListener("click", () => {
      for (const player of game.players) {
        if (player.teamIndex === game.players[0].teamIndex) {
          game.currentRound.stake.reject(player);
        }
      }
      dispatchEvent(stakeRaiseAnswered(game, game.players[0]));
    });
  });
  const points = game.currentRound.previousStakePoints;
  return `<button id="asr-n">REJECT<br/>FOR ${points}</button>`;
}
