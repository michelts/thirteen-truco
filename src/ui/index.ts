import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderActions } from "./actions";
import { renderRaiseStake } from "./raiseStake";
import { renderAvatar } from "./avatar";
import { renderCardDeck } from "./cardDeck";
import { cardPicked, roundDone } from "./events";
import { renderMyCards } from "./myCards";
import { renderMyself } from "./myself";
import { renderOthers } from "./others";
import { renderOthersCards } from "./othersCards";
import { renderPlayer } from "./player";
import { renderScore } from "./score";
import { renderTableCards } from "./tableCards";
import { renderToggle } from "./toggle";
import { renderTurnedCard } from "./turnedCard";

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
        dispatchEvent(roundDone(game));
      } else if (event.detail.game.currentRound.currentStep.isDone) {
        event.detail.game.currentRound.continue();
      }
    });

    window.addEventListener("stakeRaiseAnswered", (event) => {
      if (event.detail.game.currentRound.isDone) {
        dispatchEvent(roundDone(game));
      } else if (event.detail.game.currentRound.currentStep.isDone) {
        event.detail.game.currentRound.continue();
      }
    });

    window.addEventListener("roundAcknowledged", (event) => {
      event.detail.game.continue();
    });
  });

  root.innerHTML =
    renderHeader(
      renderScore(game),
      renderToggle("MUSIC", false, () => true) +
        renderToggle("SFX", false, () => true),
    ) +
    renderKitchenTable(
      renderTableCards(game) +
        renderCardDeck(renderTurnedCard(game)) +
        renderMyself(
          renderMyCards(game, game.players[0]) +
            renderAvatar(game.players[0], "y") +
            renderActions(renderRaiseStake(game)),
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
