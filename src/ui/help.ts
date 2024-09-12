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
<li>Drag a card forward to drop it into the current round</li>
<li>Drag a card backward to discard it as a hidden card and hide your strategy</li>
<li>Win the round to earn 1 by winning 2 of 3 steps</li>
<li>In case of a tie, wins whoever won the 1st step (e.g. a win, lose and a draw)</li>
<li>In case of a tie in the 1st step, scores who wins the 2nd step (e.g. a draw and a win)</li>
<li>Win the game the player/team that reaches 12 points</li>
<li>Raise stakes to win faster!</li>
</ul>
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
<h3>Trump Cards</h3>
<p>These are cards that beat all others, immediately following the turned card in rank.For instance:</p>
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
<p>The card suit matters, trump cards don't tie. If you have the trump of clubs, you have the highest card of the game!</p>
<h3>Raising stakes</h3>
<p>If you think you have strong cards, you can raise the stakes! Each round awards one point, but raising the stakes increases the value to 3, 6, 9, or even 12 points.</p>
</div>`;
}

function renderHelpCard(card: Card) {
  return `<div>${renderCard(card)}</div>`;
}
/*
  <p>



The 1st making 12 points wins!</p></div> */
