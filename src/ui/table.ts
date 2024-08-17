import type { Game } from "@/types";
import { renderCard } from "./card";

export function renderTable(game: Game) {
  return `
      <div>
        <div>Table cards:</div>
        <div>
          ${game
            .getCurrentRound()
            .getCurrentStep()
            .getCards()
            .map((card) => renderCard(card))
            .join(" ")}
        </div>
      </div><br />`;
}
