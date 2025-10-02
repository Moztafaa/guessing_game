import { Card, CardStatus } from "../models/card";

const FLIP_DURATION_MS = 600;
const HALF_FLIP_MS = FLIP_DURATION_MS / 2;
const swapTimeouts: Record<number, number | undefined> = {};

export function renderBoard(cards: Card[], app: HTMLElement, onCardClick: (card: Card) => void) {
  app.innerHTML = "";

  const progressContainer = document.createElement("div");
  progressContainer.className = "container mb-3";
  progressContainer.innerHTML = `
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="text-light small">Matches</span>
          <span id="match-progress-text" class="text-light small"></span>
        </div>
        <div class="progress" role="progressbar" aria-label="Matches progress" aria-valuemin="0" aria-valuemax="100">
          <div id="match-progress" class="progress-bar" style="width: 0%"></div>
        </div>
      </div>
    </div>
  `;

  app.appendChild(progressContainer);

  const grid = document.createElement("div");
  grid.className = "grid";
  app.appendChild(grid);

  let cardHTMLWithBootstrap = `
    <div class="container">
      <div class="row row-cols-4 g-3">
  `;

  cards.forEach((card, index) => {
    card.index = index;
    const displayImage = card.status === CardStatus.facedown ? "../assets/back.jpg" : card.imagesrc;

    cardHTMLWithBootstrap += `
      <div class="col">
        <div class="card ${card.status}" data-index="${index}" data-id="${card.id}">
          <img src="${displayImage}" class="card-img-top img-card" alt="..." />
        </div>
      </div>
    `;
  });

  cardHTMLWithBootstrap += `
      </div>
    </div>
  `;

  grid.innerHTML = cardHTMLWithBootstrap;
  updateProgressBar(cards);

  grid.addEventListener("click", (event: Event) => {
    const target = event.target as HTMLElement;
    const clickedCard = target.closest(".card") as HTMLElement;

    if (!clickedCard) return;

    const cardIndex = clickedCard.getAttribute("data-index");
    if (cardIndex) {
      const card = cards[parseInt(cardIndex)];
      if (card && card.isFaceDown()) {
        onCardClick(card);
      }
    }
  });
}

export function updateCardView(card: Card) {
  const cardElement = document.querySelector(`.card[data-index='${card.index}']`) as HTMLElement;
  if (!cardElement) return;

  const img = cardElement.querySelector("img") as HTMLImageElement;
  if (!img) return;

  const targetSrc = card.status === CardStatus.facedown ? "../assets/back.jpg" : card.imagesrc;

  if (swapTimeouts[card.index] !== undefined) {
    clearTimeout(swapTimeouts[card.index]);
  }

  cardElement.className = `card ${card.status}`;
  cardElement.classList.remove("flip-half");

  requestAnimationFrame(() => {
    cardElement.classList.add("flip-half");
  });

  swapTimeouts[card.index] = window.setTimeout(() => {
    img.src = targetSrc;
    cardElement.classList.remove("flip-half");
  }, HALF_FLIP_MS);
}

export function updateProgressBar(cards: Card[]) {
  const totalPairs = cards.length / 2;
  const matchedCards = cards.filter(c => c.isMatched()).length;
  const matchedPairs = Math.floor(matchedCards / 2);
  const percent = Math.round((matchedPairs / totalPairs) * 100);

  const bar = document.getElementById("match-progress") as HTMLDivElement | null;
  const text = document.getElementById("match-progress-text") as HTMLSpanElement | null;

  if (bar) {
    bar.style.width = `${percent}%`;
    bar.setAttribute("aria-valuenow", String(percent));
    bar.textContent = `${percent}%`;
    bar.classList.toggle("bg-success", matchedPairs === totalPairs);
  }

  if (text) {
    text.textContent = `${matchedPairs}/${totalPairs} matches`;
  }
}
