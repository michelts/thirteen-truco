import { EmptyHandError } from "@/utils/errors";
import { TrucoPlayer } from "./truco";

export class AutoPlayer extends TrucoPlayer {
  autoPickCard() {
    const card = this.cards[0];
    if (!card) {
      throw new EmptyHandError();
    }
    return card;
  }
}
