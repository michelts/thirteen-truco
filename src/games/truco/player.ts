import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import {
  CardNotFoundError,
  NotEnoughCardsError,
  NotYourTurnError,
  PendingStakeRaiseError,
  PlayerNotInitializedError,
} from "@/utils/errors";
import { getId } from "@/utils/getId";
import { autoPickCard } from "./autoPickCard";

export class TrucoPlayer implements Player {
  public canAutoPickCard: boolean;
  private _game: Game;
  private _id: ReturnType<typeof getId>;
  private _name = "";
  private _teamIndex?: Player["teamIndex"];
  private _cards: [] | [Card, Card, Card] = [];

  constructor(game: Game, name: string, canAutoPickCard?: boolean) {
    this._id = getId();
    this._name = name;
    this._game = game;
    this.canAutoPickCard = canAutoPickCard ?? false;
  }

  isEqual(player: Player) {
    return this.id === player.id;
  }

  toString() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get teamIndex() {
    if (this._teamIndex === undefined) {
      throw new PlayerNotInitializedError();
    }
    return this._teamIndex;
  }

  set teamIndex(index: Player["teamIndex"]) {
    this._teamIndex = index;
  }

  receiveCards(cards: Card[]) {
    if (cards.length !== 3) {
      throw new NotEnoughCardsError();
    }
    this._cards = cards as [Card, Card, Card];
  }

  get cards() {
    return this._cards;
  }

  dropCard(card: Card, isHidden?: boolean) {
    if (this._game.currentRound.stake.isAccepted === undefined) {
      throw new PendingStakeRaiseError();
    }
    console.log(`currentPlayer: ${this._game.currentRound.currentPlayer}`);
    if (this._game.currentRound.currentPlayer?.isEqual(this)) {
      this.takeCard(card);
      this._game.currentRound.currentStep.addPlayerCard(this, card, isHidden);
    } else {
      throw new NotYourTurnError();
    }
  }

  takeCard(takenCard: Card) {
    const cardIndex = this.cards.findIndex((card) => card.isEqual(takenCard));
    if (cardIndex === -1) {
      throw new CardNotFoundError();
    }
    return this._cards.splice(cardIndex, 1);
  }

  autoPickCard() {
    const previousFromOurs = this._game.currentRound.steps.map((step) =>
      step.cards
        .filter((stepCard) => stepCard.player.teamIndex === 0)
        .map((stepCard) => stepCard.card),
    );
    const previousFromTheirs = this._game.currentRound.steps.map((step) =>
      step.cards
        .filter((stepCard) => stepCard.player.teamIndex === 1)
        .map((stepCard) => stepCard.card),
    );
    return autoPickCard(
      this.cards,
      previousFromOurs,
      previousFromTheirs,
      this._game.currentRound.steps.map((step) =>
        step.winner ? step.winner.teamIndex === this.teamIndex : undefined,
      ),
      this._game.currentRound.trumpCards,
      this._game.deck.cardsFromLowestToHighest,
    );
  }
}
