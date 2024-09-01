import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { stakeRaiseAnswered } from "./events";

export function renderAcceptStakeRaise(game: Game) {
  return render(game);
}

function render(game: Game) {
  setTimeout(() => {
    getElement("asr-y").addEventListener("click", () => {
      for (const player of game.players) {
        if (player.teamIndex === game.players[0].teamIndex) {
          game.currentRound.stake.accept(player);
        }
      }
      dispatchEvent(stakeRaiseAnswered(game, game.players[0]));
    });
  });
  const points = game.currentRound.currentStakePoints;
  return `<button id="asr-y">ACCEPT<br/>FOR ${points}</button>`;
}
