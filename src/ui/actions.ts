import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderRaiseStake } from "./raiseStake";
import { renderGiveUpRound } from "./giveUpRound";
import { renderAcceptStakeRaise } from "./acceptStakeRaise";
import { renderRejectStakeRaise } from "./rejectStakeRaise";

export function renderActions(game: Game) {
  const redraw = () => {
    getElement("act").outerHTML = render(game);
  };
  setTimeout(() => {
    window.addEventListener("stakeRaised", redraw);
    window.addEventListener("stakeAutoRaised", redraw);
    window.addEventListener("stakeRaiseAnswered", redraw);
    window.addEventListener("roundAcknowledged", redraw);
  });
  return render(game);
}

function render(game: Game) {
  const stake = game.currentRound.stake;
  if (stake.raisedBy?.teamIndex === 1 && stake.isAccepted === undefined) {
    return `<div id="act">${renderAcceptStakeRaise(game) + renderRejectStakeRaise(game)}</div>`;
  }
  return `<div id="act">${renderRaiseStake(game) + renderGiveUpRound(game)}</div>`;
}
