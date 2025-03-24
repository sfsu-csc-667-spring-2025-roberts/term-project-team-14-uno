import Card from "./Card";
import { Color } from "./Card";
import deck from "./Deck";
import Player from "./Player";

interface Action {
  type: string;
  card?: Card;
  playerId: string;
}

class GameState {
  gameId: string;
  deck: Card[];
  players: Player[];
  turn: number;
  state: string;
  numPlayers: number;

  constructor(gameId: string, numPlayers: number = 4) {
    this.gameId = gameId;
    this.deck = deck.map(
      (card) =>
        new Card(card.value, card.img, Color[card.color as keyof typeof Color]),
    );
    this.players = [];
    this.turn = 0;
    this.state = "uninitialized";
    this.numPlayers = numPlayers;
  }

  addPlayer(id: string) {
    this.players.push(new Player(id));
    if (this.players.length === this.numPlayers) {
      this.init();
    }
  }

  init() {
    // shuffle deck
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // distribute cards
    for (let i = 0; i < this.numPlayers * 7; i++) {
      this.players[i % 4].hand.push(this.deck[i]);
    }
    this.state = "wait";
  }

  update(action: Action) {
    switch (this.state) {
      case "wait":
        if (action.type === "play" && action.card) {
          this.state = "play";
          this.handleCardPlay(action.card, action.playerId);
        }
        break;
      case "play":
        // do something
        break;
    }
  }

  handleCardPlay(card: Card, id: string) {
    if (this.isValidCard(card)) {
      const selectPlayer = this.players.find((player) => player.id === id);
      selectPlayer?.hand.filter(
        (handCard) =>
          handCard.value !== card.value && handCard.color !== card.color,
      );
    }

    return true;
  }
  isValidCard(card: Card) {
    return true;
  }
}

export default GameState;
