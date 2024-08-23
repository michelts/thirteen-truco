import { renderCardBack } from "./cardBack";

export function renderCardDeck() {
  return `<div class="cdd"><div>${[1, 2, 3, 4].map(() => renderCardBack()).join("")}</div></div>`;
}
