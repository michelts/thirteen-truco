import { renderCardBack } from "./cardBack";

export function renderCardDeck(content: string) {
  return `<div class="cdd"><div>${content}</div><div>${[1, 2, 3, 4].map(() => renderCardBack()).join("")}</div></div>`;
}
