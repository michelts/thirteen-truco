import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { notificationCreated, stakeRaised } from "./events";
import { notifications } from "./notifications";

export function renderRaiseStake(game: Game) {
  return render(game);
}

function render(game: Game) {
  const humanPlayer = game.players[0];
  setTimeout(() => {
    getElement("rs").addEventListener("click", () => {
      const points = game.currentRound.nextStakePoints;
      game.currentRound.raiseStake(humanPlayer);
      dispatchEvent(stakeRaised(game, humanPlayer));
      dispatchEvent(
        notificationCreated(
          notifications.weRaisedStakes(humanPlayer.name, points),
        ),
      );
    });
  });
  const canRaiseStakes =
    game.currentRound.stake.isAccepted === true &&
    game.currentRound.stake.raisedBy?.teamIndex !== humanPlayer.teamIndex;
  return `<button id="rs"${!canRaiseStakes ? " disabled=" : ""}>RAISE<br/>TO ${game.currentRound.nextStakePoints}</button>`;
}
