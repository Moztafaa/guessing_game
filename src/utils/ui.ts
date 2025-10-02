import { Card, CardStatus } from "../models/card";

const FLIP_DURATION_MS = 600;
const HALF_FLIP_MS = FLIP_DURATION_MS / 2;
const swapTimeouts: Record<number, number | undefined> = {};

export function renderBoard(cards: Card[], app: HTMLElement, onCardClick: (card: Card) => void) {
  app.innerHTML = "";

  // Header with title and stats
  const header = document.createElement("div");
  header.className = "container mb-4";
  header.innerHTML = `
    <div class="row">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold text-white mb-2">
          <i class="bi bi-puzzle-fill text-info me-2"></i>
          Memory Match Game
        </h1>
        <p class="lead text-white-50 mb-4">Find all the matching pairs!</p>
      </div>
    </div>
  `;
  app.appendChild(header);

  // Game stats card
  const statsContainer = document.createElement("div");
  statsContainer.className = "container mb-4";
  statsContainer.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card bg-dark border-secondary shadow-lg">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h5 class="text-white mb-3">
                  <i class="bi bi-trophy-fill text-warning me-2"></i>
                  Progress
                </h5>
                <div class="progress" style="height: 30px;" role="progressbar" aria-label="Matches progress" aria-valuemin="0" aria-valuemax="100">
                  <div id="match-progress" class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: 0%">
                    <span class="fw-bold">0%</span>
                  </div>
                </div>
              </div>
              <div class="col-md-4 text-center mt-3 mt-md-0">
                <div class="bg-secondary bg-opacity-50 rounded p-3">
                  <h6 class="text-white-50 mb-1 small">Matches Found</h6>
                  <h2 class="text-info fw-bold mb-0" id="match-progress-text">0/8</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  app.appendChild(statsContainer);

  // Game grid
  const grid = document.createElement("div");
  grid.className = "grid";
  app.appendChild(grid);

  let cardHTMLWithBootstrap = `
    <div class="container">
      <div class="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-3 g-md-4 justify-content-center">
  `;

  cards.forEach((card, index) => {
    card.index = index;
    const displayImage = card.status === CardStatus.facedown ? "../assets/back.jpg" : card.imagesrc;

    cardHTMLWithBootstrap += `
      <div class="col">
        <div class="card-wrapper">
          <div class="game-card ${card.status}" data-index="${index}" data-id="${card.id}">
            <div class="card-inner">
              <img src="${displayImage}" class="card-img-top img-card" alt="Memory card" />
              <div class="card-glow"></div>
            </div>
          </div>
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
    const clickedCard = target.closest(".game-card") as HTMLElement;

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
  const cardElement = document.querySelector(`.game-card[data-index='${card.index}']`) as HTMLElement;
  if (!cardElement) return;

  const img = cardElement.querySelector("img") as HTMLImageElement;
  if (!img) return;

  const targetSrc = card.status === CardStatus.facedown ? "../assets/back.jpg" : card.imagesrc;

  if (swapTimeouts[card.index] !== undefined) {
    clearTimeout(swapTimeouts[card.index]);
  }

  cardElement.className = `game-card ${card.status}`;
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

    if (matchedPairs === totalPairs) {
      bar.innerHTML = '<span class="fw-bold">🎉 Complete! 🎉</span>';
      bar.classList.remove("bg-info");
      bar.classList.add("bg-success");
    } else {
      bar.innerHTML = `<span class="fw-bold">${percent}%</span>`;
      bar.classList.remove("bg-success");
      bar.classList.add("bg-info");
    }
  }

  if (text) {
    text.textContent = `${matchedPairs}/${totalPairs}`;
  }
}
