import Card from "./Card";
import { Color, CardType } from "./Card";
import deck from "./Deck";
import Player from "./Player";
import gameManager from "./GameStore";

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
  turnIncrement: number;
  state: string;
  numPlayers: number;
  topCard: Card | null;

  constructor(gameId: string, numPlayers: number = 4) {
    this.gameId = gameId;
    this.deck = deck.map(
      (card) =>
        new Card(
          card.value,
          card.img,
          Color[card.color as keyof typeof Color],
          CardType[card.type as keyof typeof CardType],
        ),
    );
    this.players = [];
    this.turn = 0;
    this.turnIncrement = 1;
    this.state = "uninitialized";
    this.numPlayers = numPlayers;
    this.topCard = null;
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
    this.deck = this.deck.splice(0, this.numPlayers * 7);
    this.state = "ready";
  }

  update(action: Action) {
    switch (this.state) {
      case "wait":
        if (action.type === "play" && action.card) {
          this.state = "play";
          const cardPlayed = this.handleCardPlay(action.card, action.playerId);
          if (!cardPlayed) {
            // handle error
          }
          this.turn += this.turnIncrement;
          this.state = "wait";
          this.topCard = action.card;
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
      const idx = selectPlayer?.hand.findIndex(
        (handCard) =>
          handCard.value !== card.value && handCard.color !== card.color,
      );
      if (idx && idx !== -1 && selectPlayer) {
        selectPlayer.hand.splice(idx, 1);
      }
      return true;
    }

    return true;
  }
  isValidCard(card: Card) {
    return true;
  }

  /*
    these are all the app management methods. Not directly related to the management of game flow
  **/
  addPlayer(id: string) {
    this.players.push(new Player(id, this.players.length));
    if (this.players.length === this.numPlayers) {
      this.init();
    }
  }

  getPlayerSubset(playerId: string) {
    const playerIdx = this.players.findIndex(
      (player) => player.id === playerId,
    );
    console.log(playerIdx);
    if (playerIdx === null || playerIdx < 0) {
      return null;
    }
    console.log("in get player subset with idx: ", playerIdx);
    return {
      gameState: this.state,
      topCard: this.topCard, // null first turn
      myPlayer: this.players[playerIdx],
      myPlayerIdx: playerIdx,
      players: this.players.map((player) => player.hand.length),
    };
  }
}

export default GameState;
