import { Card } from "@/core";
import { Suit } from "@/types";
import { getElement } from "@/utils/elements";
import { renderCard } from "./card";

export function renderHelp() {
  setTimeout(() => {
    getElement("hlp-dms").addEventListener("click", () => {
      getElement("wrap").classList.remove("learning");
    });
  });
  render();
}
function render() {
  getElement("hlp").innerHTML = `<div>
<button id="hlp-dms">X</button>
<h3>Game play</h3>
<ul>
<li>Drag a card forward to play it into the current round.</li>
<li>Drag a card backward to discard it as a hidden card, concealing your strategy.</li>
<li>Win the round by winning 2 out of 3 steps to earn 1 point.</li>
<li>In case of a tie, the player who won the 1st step wins the round (e.g., a win, loss, and a draw).</li>
<li>If the 1st step was a tie, the player who wins the 2nd step wins the round (e.g., a draw and a win).</li>
<li>The player or team that reaches 12 points wins the game.</li>
<li>Raise the stakes to win faster!</li>
</ul>
<p>The game begins at your turn, but in the next round, the starting player rotates counterclockwise. Within a round, the winner of each step starts the next step. For example, if you win the first step, you start the second step.</p>
<h3>Card Hierarchy (lowest to highest)</h3>
<div class="hlp-c">
${
  renderHelpCard(new Card(13, Suit.Hearts)) +
  renderHelpCard(new Card(4, Suit.Hearts)) +
  renderHelpCard(new Card(5, Suit.Hearts)) +
  renderHelpCard(new Card(6, Suit.Hearts)) +
  renderHelpCard(new Card(7, Suit.Hearts)) +
  renderHelpCard(new Card(10, Suit.Hearts)) +
  renderHelpCard(new Card(11, Suit.Hearts)) +
  renderHelpCard(new Card(12, Suit.Hearts)) +
  renderHelpCard(new Card(1, Suit.Hearts)) +
  renderHelpCard(new Card(2, Suit.Hearts)) +
  renderHelpCard(new Card(3, Suit.Hearts))
}
</div>
<h3>Triskaidekaphobia</h3>
<p>The card 13 loses to any other card. However, it mimics any card in the deck until you play it. Only when you drop it does it reveal it as a 13. You might think you have a strong hand, only to discover that you were better off not raising the stakes with such a weak card!</p>
<h3>Trump Cards</h3>
<p>These cards beat all others, ranked just below the turned card.</p>
<div class="hlp-t">
<div class="hlp-c">${renderHelpCard(new Card(4, Suit.Diamonds))}</div>
<div>→</div>
<div>
<div class="hlp-c">${
    renderHelpCard(new Card(5, Suit.Diamonds)) +
    renderHelpCard(new Card(5, Suit.Spades)) +
    renderHelpCard(new Card(5, Suit.Hearts)) +
    renderHelpCard(new Card(5, Suit.Clubs))
  }</div>
</div>

<div class="hlp-c">${renderHelpCard(new Card(7, Suit.Hearts))}</div>
<div>→</div>
<div>
<div class="hlp-c">${
    renderHelpCard(new Card(10, Suit.Diamonds)) +
    renderHelpCard(new Card(10, Suit.Spades)) +
    renderHelpCard(new Card(10, Suit.Hearts)) +
    renderHelpCard(new Card(10, Suit.Clubs))
  }</div>
</div>

<div class="hlp-c">${renderHelpCard(new Card(3, Suit.Spades))}</div>
<div>→</div>
<div>
<div class="hlp-c">${
    renderHelpCard(new Card(4, Suit.Diamonds)) +
    renderHelpCard(new Card(4, Suit.Spades)) +
    renderHelpCard(new Card(4, Suit.Hearts)) +
    renderHelpCard(new Card(4, Suit.Clubs))
  } <i>(4 instead of 13, remember the triskaidekaphobia)</i></div>
</div>
</div>
<p>The suit matters - trump cards never tie. If you hold the trump of clubs, you have the highest card in the game!</p>
<h3>Raising stakes</h3>
<p>If you have strong cards, you can raise the stakes! Normally, each round awards 1 point, but raising the stakes can increase the value to 3, 6, 9, or even 12 points. However, you cannot raise stakes twice in a row. For example, if you raise to 3, your opponent can raise to 6, then you can raise to 9, and so on.</p>
<h3>Strategy</h3>
<p>A good strategy for beginners is to aim to win or draw the 1st step and use your best cards to win the 2nd step. Be mindful of both your partner's and opponents' cards. Avoid wasting a strong card in a step where it won't win but might win in the next step.</p>
</div>`;
}

function renderHelpCard(card: Card) {
  return `<div>${renderCard(card)}</div>`;
}
