import { playerNames } from "@/config";
import { TrucoPlayer } from "@/games/truco";
import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { possiblyPlayMusic } from "./audio/music";
import { gameReset } from "./events";

export function renderSplash(game: Game) {
  const splashRoot = getElement("spl");
  listenToEvents(game);
  splashRoot.innerHTML = renderSplashTitle() + renderSplashMenu();
}

function renderSplashTitle() {
  return "<h1>Thirteen Truco!</h1>";
}

function renderSplashMenu() {
  return `<div><button id="spl-1p">1 Player vs Computer</button><button id="spl-2p">1 Player + Computer vs 2 Computers</button><button id="spl-hlp">Help</button></div>`;
}

function listenToEvents(game: Game) {
  setTimeout(() => {
    getElement("spl-1p").addEventListener("click", () => {
      game.reset(
        playerNames
          .slice(0, 2)
          .map((name, index) => new TrucoPlayer(game, name, index !== 0)),
      );
      dispatchEvent(gameReset(game));
      possiblyPlayMusic();
      getElement("wrap").classList.add("playing");
    });

    getElement("spl-2p").addEventListener("click", () => {
      game.reset(
        playerNames.map(
          (name, index) => new TrucoPlayer(game, name, index !== 0),
        ),
      );
      dispatchEvent(gameReset(game));
      possiblyPlayMusic();
      getElement("wrap").classList.add("playing");
    });

    getElement("spl-hlp").addEventListener("click", () => {
      getElement("wrap").classList.add("learning");
    });
  });
}
