import type { Game } from "@/types";
import { renderAvatar } from "./avatar";
import { renderCardDeck } from "./cardDeck";
import { renderMyCards } from "./myCards";
import { renderMyself } from "./myself";
import { renderOthers } from "./others";
import { renderOthersCards } from "./othersCards";
import { renderPlayer } from "./player";
import { renderScore } from "./score";
import { renderTableCards } from "./tableCards";
import { renderToggle } from "./toggle";
import { cardPicked, roundDone } from "./events";
import { getElement } from "@/utils/getElement";

export function renderApp(game: Game) {
  const root = getElement("app");

  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      event.detail.player.dropCard(event.detail.card, event.detail.isHidden);

      if (game.currentPlayer?.autoPickCard) {
        const card = game.currentPlayer.autoPickCard();
        dispatchEvent(cardPicked(game.currentPlayer, card));
      }
    });

    window.addEventListener("cardPlaced", (event) => {
      if (event.detail.game.currentRound.isDone) {
        event.detail.game.continue();
        dispatchEvent(roundDone(game));
      } else if (event.detail.game.currentRound.currentStep.isDone) {
        event.detail.game.currentRound.continue();
      }
    });
  });

  root.innerHTML =
    renderHeader(
      renderScore(),
      renderToggle("MUSIC", false, () => true) +
        renderToggle("SFX", false, () => true),
    ) +
    renderKitchenTable(
      renderTableCards(game) +
        renderCardDeck() +
        renderMyself(
          renderMyCards(game, game.players[0]) +
            renderAvatar(game.players[0], "y"),
        ) +
        renderOthers(
          game.players
            .slice(1)
            .map((player, index) =>
              renderPlayer(
                renderAvatar(player, index),
                renderOthersCards(game, player),
              ),
            ),
        ),
    );
}

function renderHeader(left: string, right: string) {
  return `<div class="hd"><div>${left}</div><div>${right}</div></div>`;
}

function renderKitchenTable(content: string) {
  return `
  <div class="tbg">
    <div class="t1"></div>
    <div class="t2"></div>
    <div class="t3"></div>
    ${content}
  </div>
`;
}
