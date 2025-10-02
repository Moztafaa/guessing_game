import { Card } from "../models/card";
import { playFlipSound, playMatchSound, playNoMatchSound, playWinSound } from "./audio";
import { updateCardView, updateProgressBar } from "./ui";

export function shuffle(array: Card[]): Card[] {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export class Game {
  cards: Card[];
  flippedCards: Card[] = [];
  isChecking: boolean = false;

  constructor(cards: Card[]) {
    this.cards = shuffle(cards);
  }

  handleCardClick(card: Card) {
    if (this.isChecking || this.flippedCards.length >= 2) return;

    card.flip();
    this.flippedCards.push(card);
    playFlipSound();
    updateCardView(card);

    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch() {
    this.isChecking = true;
    const [firstCard, secondCard] = this.flippedCards;

    if (firstCard.id === secondCard.id) {
      console.log("Match found!");
      firstCard.setMatched();
      secondCard.setMatched();
      this.flippedCards = [];
      this.isChecking = false;
      playMatchSound();
      updateCardView(secondCard);
      updateProgressBar(this.cards);
      this.checkGameComplete();
    } else {
      console.log("No match - flip back in 0.5 second ...");
      setTimeout(() => {
        firstCard.flipBack();
        secondCard.flipBack();
        this.flippedCards = [];
        this.isChecking = false;
        playNoMatchSound();
        updateCardView(firstCard);
        updateCardView(secondCard);
      }, 500);
    }
  }

  checkGameComplete() {
    const allMatched = this.cards.every(card => card.isMatched());
    if (allMatched) {
      playWinSound();
      console.log("Mabrook ya 7areeef :)");
    }
  }
}
