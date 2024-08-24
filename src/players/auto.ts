import { TrucoPlayer } from "./truco";

export class AutoPlayer extends TrucoPlayer {
  autoPickCard() {
    const card = this.cards[0];
    if (!card) {
      throw new Error("Cannot pick card from empty hand");
    }
    return card;
  }
}
