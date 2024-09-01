import type { Game, Player } from "@/types";
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
  stakeRaiseAnswered,
} from "./events";
import { renderMyCards } from "./myCards";
import { renderMyself } from "./myself";
import { notifications, renderNotifications } from "./notifications";
import { renderOthers } from "./others";
import { renderOthersCards } from "./othersCards";
import { renderPlayer } from "./player";
import { renderScore } from "./score";
import { renderTableCards } from "./tableCards";
import { renderToggle } from "./toggle";
import { renderTurnedCard } from "./turnedCard";

export function renderApp(game: Game) {
  const root = getElement("app");
  let autoRaiseSideEffect: (() => void) | null = null;

  function autoPickCard(player: Player) {
    const autoCard = player.autoPickCard();
    if (!autoCard.shouldRaise) {
      dispatchEvent(cardPicked(player, autoCard.card, autoCard.isHidden));
    } else {
      const points = game.currentRound.nextStakePoints;
      game.currentRound.raiseStake(player);
      autoRaiseSideEffect = () =>
        dispatchEvent(cardPicked(player, autoCard.card, autoCard.isHidden));
      dispatchEvent(stakeAutoRaised(game, player));
      dispatchEvent(
        notificationCreated(
          notifications.theyRaisedStakes(player.name, points),
        ),
      );
    }
  }

  const notifyRoundDone = () => {
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
  };

  const continueRoundOrCloseIt = () => {
    if (game.currentRound.isDone) {
      dispatchEvent(roundDone(game));
    } else if (game.currentRound.currentStep.isDone) {
      game.currentRound.continue();
    }
  };

  const autoAnswerStakeRaise = (raisedBy: Player) => {
    if (raisedBy.teamIndex === 0) {
      const shouldAccept = Math.random() - 0.5 > 0;
      const opponents = game.players.filter((player) => player.teamIndex === 1);
      setTimeout(() => {
        for (const player of opponents) {
          if (shouldAccept) {
            game.currentRound.stake.accept(player);
          } else {
            game.currentRound.stake.reject(player);
          }
        }
        dispatchEvent(stakeRaiseAnswered(game, opponents[0]));
      }, 2500);
    }
  };

  const notifyStakeAccepted = (player: Player, callback: () => void) => {
    if (game.currentRound.stake.isAccepted === undefined) {
      return;
    }
    if (game.currentRound.stake.isAccepted && autoRaiseSideEffect) {
      autoRaiseSideEffect();
    }
    const messages =
      player.teamIndex === game.players[0].teamIndex
        ? [notifications.weAccepted, notifications.weRejected]
        : [notifications.theyAccepted, notifications.theyRejected];
    dispatchEvent(
      notificationCreated(
        game.currentRound.stake.isAccepted ? messages[0] : messages[1],
        1000,
        callback,
      ),
    );
    autoRaiseSideEffect = null;
  };

  const continueGameIfDone = () => {
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
  };

  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      event.detail.player.dropCard(event.detail.card, event.detail.isHidden);
      if (game.currentPlayer?.canAutoPickCard) {
        autoPickCard(game.currentPlayer);
      }
    });
    window.addEventListener("roundDone", notifyRoundDone);
    window.addEventListener("cardPlaced", continueRoundOrCloseIt);
    window.addEventListener("stakeRaised", (event) =>
      autoAnswerStakeRaise(event.detail.player),
    );
    window.addEventListener("stakeRaiseAnswered", (event) => {
      notifyStakeAccepted(event.detail.player, continueRoundOrCloseIt);
    });
    window.addEventListener("roundAcknowledged", continueGameIfDone);
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
