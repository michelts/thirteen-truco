import type { Card } from "@/core";
import type { Game, Player } from "@/types";

declare global {
  interface GlobalEventHandlersEventMap {
    cardPicked: CustomEvent<{ player: Player; card: Card }>;
    cardDropped: CustomEvent<{
      game: Game;
      player: Player;
      card: Card;
      isHidden?: boolean;
    }>;
    cardPlaced: CustomEvent<{ game: Game; player: Player; card: Card }>;
    stakeRaised: CustomEvent<{ game: Game; player: Player }>;
    stakeRaiseAnswered: CustomEvent<{ game: Game; player: Player }>;
    roundDone: CustomEvent<{ game: Game }>;
    roundAcknowledged: CustomEvent<{ game: Game }>;
    notificationCreated: CustomEvent<{ message: string; timeout?: number }>;
  }
}

export const cardPicked = (player: Player, card: Card) =>
  new CustomEvent("cardPicked", {
    bubbles: true,
    detail: { player, card },
  });

export const cardDropped = (
  game: Game,
  player: Player,
  card: Card,
  isHidden?: boolean,
) =>
  new CustomEvent("cardDropped", {
    bubbles: true,
    detail: { game, player, card, isHidden },
  });

export const cardPlaced = (game: Game, player: Player, card: Card) =>
  new CustomEvent("cardPlaced", {
    bubbles: true,
    detail: { game, player, card },
  });

export const stakeRaised = (game: Game, player: Player) =>
  new CustomEvent("stakeRaised", {
    bubbles: true,
    detail: { game, player },
  });

export const stakeRaiseAnswered = (game: Game, player: Player) =>
  new CustomEvent("stakeRaiseAnswered", {
    bubbles: true,
    detail: { game, player },
  });

export const roundDone = (game: Game) =>
  new CustomEvent("roundDone", {
    bubbles: true,
    detail: { game },
  });

export const roundAcknowledged = (game: Game) =>
  new CustomEvent("roundAcknowledged", {
    bubbles: true,
    detail: { game },
  });

export const notificationCreated = (message: string, timeout?: number) =>
  new CustomEvent("notificationCreated", {
    bubbles: true,
    detail: { message, timeout },
  });
