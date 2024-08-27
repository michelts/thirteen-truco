import type { Card } from "@/core";
import type { Game, Player } from "@/types";

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
