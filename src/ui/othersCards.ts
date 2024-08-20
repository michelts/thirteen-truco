import type { Player } from "@/types";
import { renderCard } from "./card";

export function renderOthersCards(player: Player) {
  return player
    .getCards()
    .map((card) => renderCard(card))
    .join(" ");
}
