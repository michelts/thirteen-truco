import type { Card } from "@/core";
import type { AutoPickCardFunc, Game, Player } from "@/types";
import {
  CardNotFoundError,
  NotEnoughCardsError,
  NotYourTurnError,
  PendingStakeRaiseError,
  PlayerNotInitializedError,
} from "@/utils/errors";
import { getId } from "@/utils/getId";

export class TrucoPlayer implements Player {
  public autoPickCard?: AutoPickCardFunc;
  private _game: Game;
  private _id: ReturnType<typeof getId>;
  private _name = "";
  private _teamIndex?: Player["teamIndex"];
  private _cards: [] | [Card, Card, Card] = [];

  constructor(game: Game, name: string, autoPickupCard?: AutoPickCardFunc) {
    this._id = getId();
    this._name = name;
    this._game = game;
    this.autoPickCard = autoPickupCard;
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
    if (this._game.currentPlayer === this) {
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
}