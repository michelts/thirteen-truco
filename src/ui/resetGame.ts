import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { gameReset, roundAcknowledged } from "./events";

export function renderResetGame(game: Game) {
  setTimeout(() => {
    getElement("rst").addEventListener("click", () => {
      game.reset();
      dispatchEvent(gameReset(game));
    });
  });
  return `<button id="rst">Reset</button>`;
}
