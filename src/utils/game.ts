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
      setTimeout(() => {
        playWinSound();
        this.showVictoryModal();
      }, 500);
    }
  }

  showVictoryModal() {
    const modalHTML = `
      <div class="modal fade" id="victoryModal" tabindex="-1" aria-labelledby="victoryModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white border-success">
            <div class="modal-header border-success">
              <h5 class="modal-title fw-bold" id="victoryModalLabel">
                <i class="bi bi-trophy-fill text-warning me-2"></i>
                Congratulations! 🎉
              </h5>
            </div>
            <div class="modal-body text-center py-4">
              <div class="mb-4">
                <i class="bi bi-emoji-smile-fill text-warning" style="font-size: 4rem;"></i>
              </div>
              <h4 class="text-success mb-3">You Won!</h4>
              <p class="text-white-50 mb-4">
                You've successfully matched all the cards!<br>
                <span class="text-info">Mabrook ya 7areeef! 🎊</span>
              </p>
              <button type="button" class="btn btn-success btn-lg px-5" onclick="location.reload()">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new (window as any).bootstrap.Modal(document.getElementById('victoryModal'));
    modal.show();
  }
}
