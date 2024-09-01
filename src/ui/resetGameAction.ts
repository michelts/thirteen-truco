import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { gameReset } from "./events";

export function renderResetGameAction(game: Game) {
  setTimeout(() => {
    getElement("rst2").addEventListener("click", () => {
      game.reset();
      dispatchEvent(gameReset(game));
    });
  });
  return `<button id="rst2">RESET<br/>GAME</button>`;
}
