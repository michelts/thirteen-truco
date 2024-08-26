import { TrucoPlayer } from "./truco";
import { EmptyHandError } from "@/utils/errors";

export class AutoPlayer extends TrucoPlayer {
  autoPickCard() {
    const card = this.cards[0];
    if (!card) {
      throw new EmptyHandError();
    }
    return card;
  }
}
