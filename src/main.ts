import "bootstrap"


interface Card {
  id: number,
  imagesrc: string,
  status: Cardstatus,
  index: number
}

const enum Cardstatus {
  facedown = "facedown",
  faceup = "faceup",
  matched = "matched"
}

let cards: Card[] = [
  { id: 1, imagesrc: "../assets/images/0.jpg", status: Cardstatus.facedown, index: 0 },
  { id: 1, imagesrc: "../assets/images/0.jpg", status: Cardstatus.facedown, index: 1 },
  { id: 2, imagesrc: "../assets/images/1.jpg", status: Cardstatus.facedown, index: 2 },
  { id: 2, imagesrc: "../assets/images/1.jpg", status: Cardstatus.facedown, index: 3 },
  { id: 3, imagesrc: "../assets/images/2.jpg", status: Cardstatus.facedown, index: 4 },
  { id: 3, imagesrc: "../assets/images/2.jpg", status: Cardstatus.facedown, index: 5 },
  { id: 4, imagesrc: "../assets/images/3.jpg", status: Cardstatus.facedown, index: 6 },
  { id: 4, imagesrc: "../assets/images/3.jpg", status: Cardstatus.facedown, index: 7 },
  { id: 5, imagesrc: "../assets/images/4.jpg", status: Cardstatus.facedown, index: 8 },
  { id: 5, imagesrc: "../assets/images/4.jpg", status: Cardstatus.facedown, index: 9 },
  { id: 6, imagesrc: "../assets/images/8.jpg", status: Cardstatus.facedown, index: 10 },
  { id: 6, imagesrc: "../assets/images/8.jpg", status: Cardstatus.facedown, index: 11 },
  { id: 7, imagesrc: "../assets/images/6.jpg", status: Cardstatus.facedown, index: 12 },
  { id: 7, imagesrc: "../assets/images/6.jpg", status: Cardstatus.facedown, index: 13 },
  { id: 8, imagesrc: "../assets/images/7.jpg", status: Cardstatus.facedown, index: 14 },
  { id: 8, imagesrc: "../assets/images/7.jpg", status: Cardstatus.facedown, index: 15 }
];


let app: HTMLElement | null = document.getElementById("app")

function createBoard() {
  cards = shuffle(cards)
  renderBoard();

}


function shuffle(array: Card[]): Card[] {
  let currentIndex = array.length
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;

}

function renderBoard() {
  if (!app) return;
  app.innerHTML = "";

  const grid = document.createElement("div")
  grid.className = "grid"
  app.appendChild(grid)
  let cardHTMLWithBootstrap = `
        <div class="container">
            <div class="row row-cols-4 g-3">
        `;

  cards.forEach((card, index) => {
    card.index = index;
    const displayImage = card.status === Cardstatus.facedown ? "../assets/back.jpg" : card.imagesrc;

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



  grid.addEventListener("click", handleBoardclick)


}

let flippedCards: Card[] = [];
let isChecking: boolean = false;

// Flip animation timing (keep in sync with CSS .card transition)
const FLIP_DURATION_MS = 600; // total animation time (90 out + 90 back)
const HALF_FLIP_MS = FLIP_DURATION_MS / 2;

// Track mid-flip swaps per card to avoid overlapping timers
const swapTimeouts: Record<number, number | undefined> = {};


function updateCardView(index: number) {
  const cardData = cards[index]
  const cardElement = document.querySelector(`.card[data-index='${index}'`) as HTMLElement

  if (!cardElement) return;

  const img = cardElement.querySelector("img") as HTMLImageElement;

  if (!img) return;

  const targetSrc = cardData.status === Cardstatus.facedown ? "../assets/back.jpg" : cardData.imagesrc;

  // Clear any pending mid-flip swap for this card
  if (swapTimeouts[index] !== undefined) {
    clearTimeout(swapTimeouts[index]);
  }
  // no end timeout needed with half-flip approach

  // Ensure base classes reflect current status and start from 0deg
  cardElement.className = `card ${cardData.status}`;
  cardElement.classList.remove("flip-half");
  // Trigger half flip to 90deg so we can swap mid-way
  requestAnimationFrame(() => {
    cardElement.classList.add("flip-half");
  });

  // Swap the image at 90deg, then animate back to 0deg
  swapTimeouts[index] = window.setTimeout(() => {
    img.src = targetSrc;
    cardElement.classList.remove("flip-half");
    // className remains `card ${status}` with base transition animating back
  }, HALF_FLIP_MS);
}


function handleBoardclick(this: HTMLDivElement, event: Event) {
  const target = event.target as HTMLElement;

  const clickedCard = target.closest(".card") as HTMLElement


  if (!clickedCard) return;

  const cardIndex = clickedCard.getAttribute("data-index")
  const cardId = clickedCard.getAttribute("data-id")

  if (isChecking || flippedCards.length >= 2) return;

  if (cardIndex) {
    const card = cards[parseInt(cardIndex)]
    if (card && card.status === Cardstatus.facedown) {
      console.log(`Card with ID ${cardId} at index ${cardIndex} clicked`);
      flipCard(card)
    }
  }
}


function flipCard(card: Card) {
  if (card.status === Cardstatus.facedown) {
    card.status = Cardstatus.faceup;
    flippedCards.push(card)
    updateCardView(card.index)

    if (flippedCards.length === 2) checkForMatch();
  }
}


function checkForMatch() {
  isChecking = true;
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.id === secondCard.id) {
    console.log("Match found!");
    firstCard.status = Cardstatus.matched;
    secondCard.status = Cardstatus.matched;
    flippedCards = [];
    isChecking = false;

    updateCardView(secondCard.index)
    ckeckGameComplete();
  } else {
    console.log("No match - flipp back in 1 second ...");
    setTimeout(() => {
      firstCard.status = Cardstatus.facedown;
      secondCard.status = Cardstatus.facedown;
      flippedCards = []
      isChecking = false
      updateCardView(firstCard.index)
      updateCardView(secondCard.index)

    }, 500);
  }
}


function ckeckGameComplete() {
  const allMatched = cards.every(card => card.status === Cardstatus.matched)
  if (allMatched) {
    console.log("Mabrook ya 7areeef :)");

  }
}


createBoard()

