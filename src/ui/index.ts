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
import { cardDropped } from "./events";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      event.detail.player.dropCard(event.detail.card);

      if (event.detail.game.currentRound.currentStep.isDone) {
        event.detail.game.currentRound.advanceStep();
      }

      if (game.currentPlayer.autoPickCard) {
        const card = game.currentPlayer.autoPickCard();
        dispatchEvent(cardDropped(game, game.currentPlayer, card));
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
