import { renderCardBack } from "./cardBack";

export function renderCardDeck() {
  return `<div class="cdd">${[1, 2, 3, 4].map(() => renderCardBack()).join("")}</div>`;
}
