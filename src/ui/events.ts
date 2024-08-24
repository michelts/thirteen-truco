import type { Card } from "@/core";
import type { Game, Player } from "@/types";

export const cardDropped = (game: Game, player: Player, card: Card) =>
  new CustomEvent("cardDropped", {
    bubbles: true,
    detail: { game, player, card },
  });

export const cardPicked = (player: Player, card: Card) =>
  new CustomEvent("cardPicked", {
    bubbles: true,
    detail: { player, card },
  });
