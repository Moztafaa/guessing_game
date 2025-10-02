export enum CardStatus {
  facedown = "facedown",
  faceup = "faceup",
  matched = "matched"
}

export class Card {
  id: number;
  imagesrc: string;
  status: CardStatus;
  index: number;

  constructor(id: number, imagesrc: string, index: number) {
    this.id = id;
    this.imagesrc = imagesrc;
    this.status = CardStatus.facedown;
    this.index = index;
  }

  flip() {
    if (this.status === CardStatus.facedown) {
      this.status = CardStatus.faceup;
    }
  }

  flipBack() {
    this.status = CardStatus.facedown;
  }

  setMatched() {
    this.status = CardStatus.matched;
  }

  isFaceDown(): boolean {
    return this.status === CardStatus.facedown;
  }

  isMatched(): boolean {
    return this.status === CardStatus.matched;
  }
}
