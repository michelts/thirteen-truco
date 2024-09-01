import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderActions } from "./actions";
import { renderAvatar } from "./avatar";
import { renderCardDeck } from "./cardDeck";
import {
  cardPicked,
  notificationCreated,
  roundAcknowledged,
  roundDone,
  stakeAutoRaised,
} from "./events";
import { renderMyCards } from "./myCards";
import { renderMyself } from "./myself";
import { renderOthers } from "./others";
import { renderOthersCards } from "./othersCards";
import { renderPlayer } from "./player";
import { renderScore } from "./score";
import { renderTableCards } from "./tableCards";
import { renderToggle } from "./toggle";
import { renderTurnedCard } from "./turnedCard";
import { notifications, renderNotifications } from "./notifications";

export function renderApp(game: Game) {
  const root = getElement("app");

  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      event.detail.player.dropCard(event.detail.card, event.detail.isHidden);

      if (game.currentPlayer?.canAutoPickCard) {
        const { card, isHidden } = game.currentPlayer.autoPickCard();
        const shouldRaise = true;
        if (!shouldRaise) {
          dispatchEvent(cardPicked(game.currentPlayer, card, isHidden));
        } else {
          console.log("XXX stake auto raised");
          const points = game.currentRound.nextStakePoints;
          game.currentRound.raiseStake(game.currentPlayer);
          dispatchEvent(
            stakeAutoRaised(game, game.currentPlayer, card, isHidden),
          );
          dispatchEvent(
            notificationCreated(
              notifications.theyRaisedStakes(game.currentPlayer.name, points),
            ),
          );
        }
      }
    });

    window.addEventListener("roundDone", () => {
      const humanPlayerIndex = 0;
      dispatchEvent(
        notificationCreated(
          game.currentRound?.score?.[humanPlayerIndex]
            ? notifications.weWon
            : notifications.weLost,
          () => {
            dispatchEvent(roundAcknowledged(game));
          },
        ),
      );
    });

    const continueRoundIfDone = () => {
      if (game.currentRound.isDone) {
        dispatchEvent(roundDone(game));
      } else if (game.currentRound.currentStep.isDone) {
        game.currentRound.continue();
      }
    };
    window.addEventListener("cardPlaced", continueRoundIfDone);
    window.addEventListener("stakeRaiseAnswered", continueRoundIfDone);
    window.addEventListener("roundAcknowledged", () => {
      if (!game.isDone) {
        game.continue();
      } else {
        const score = game.score;
        dispatchEvent(
          notificationCreated(
            score[0] > score[1]
              ? notifications.weWonGame
              : notifications.weLostGame,
          ),
        );
      }
    });

    window.addEventListener("stakeRaiseAnswered", () => {
      if (game.currentRound.stake.isAccepted !== undefined) {
        dispatchEvent(
          notificationCreated(
            game.currentRound.stake.isAccepted
              ? notifications.theyAccepted
              : notifications.theyRejected,
            1000,
          ),
        );
      }
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
            renderActions(game) +
            renderNotifications(),
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
