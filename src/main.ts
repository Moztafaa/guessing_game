import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "./models/card";
import { Game } from "./utils/game";
import { renderBoard } from "./utils/ui";

const initialCards: Card[] = [
  new Card(1, "../assets/images/0.jpg", 0),
  new Card(1, "../assets/images/0.jpg", 1),
  new Card(2, "../assets/images/1.jpg", 2),
  new Card(2, "../assets/images/1.jpg", 3),
  new Card(3, "../assets/images/2.jpg", 4),
  new Card(3, "../assets/images/2.jpg", 5),
  new Card(4, "../assets/images/3.jpg", 6),
  new Card(4, "../assets/images/3.jpg", 7),
  new Card(5, "../assets/images/4.jpg", 8),
  new Card(5, "../assets/images/4.jpg", 9),
  new Card(6, "../assets/images/8.jpg", 10),
  new Card(6, "../assets/images/8.jpg", 11),
  new Card(7, "../assets/images/6.jpg", 12),
  new Card(7, "../assets/images/6.jpg", 13),
  new Card(8, "../assets/images/7.jpg", 14),
  new Card(8, "../assets/images/7.jpg", 15)
];

const app = document.getElementById("app");

if (app) {
  const game = new Game(initialCards);
  renderBoard(game.cards, app, (card) => game.handleCardClick(card));
}
