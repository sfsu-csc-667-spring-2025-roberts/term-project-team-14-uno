import Card from "../../client/Card";
import { Color, CardType } from "../../client/Card";
import deck from "./Deck";
import Player from "../../client/Player";
import gameManager from "./GameStore";
import { getIO } from "../socket/socket";

export interface Action {
  type: string;
  card?: Card;
  wildColor?: string;
  cardIndex?: number;
  playerId: string;
  gameId: string;
}

export interface PlayerGameState {
  gameState: string;
  topCard: Card | null;
  myPlayer: Player;
  myPlayerIdx: number;
  players: number[];
  turn: number;
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
    this.turnIncrement = -1;
    this.state = "uninitialized";
    this.numPlayers = numPlayers;
    this.topCard = null;
  }

  init() {
    // shuffle this.deck
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    // distribute cards
    for (let i = 0; i < this.numPlayers * 7; i++) {
      this.players[i % this.numPlayers].hand.push(this.deck[i]);
    }
    this.deck = this.deck.splice(0, this.numPlayers * 7);
    // this.topCard = this.deck.pop()!;
    this.state = "wait";
  }

  update(action: Action) {
    console.log("in update");
    switch (this.state) {
      case "wait":
        console.log("in wait");
        if (action.type === "play" && action.card && action.cardIndex) {
          this.state = "play";
          const cardPlayed = this.handleCardPlay(
            action.card,
            action.cardIndex,
            action.playerId,
          );
          console.log("after card played");
          if (!cardPlayed) {
            // handle error
          } else {
            this.broadcastStateUpdate();
          }
        }
        break;
      case "play":
        // return busy?
        break;
    }
  }

  handleCardPlay(card: Card, cardIndex: number, id: string) {
    // check if valid
    console.log("in handle play card: ", card);
    if (!this.isValidCard(card)) {
      return false;
    }
    console.log("in handle play card it is indeed valid");
    this.topCard = card;
    this.players[this.turn].hand.splice(cardIndex, 1);
    console.log("in handle play card removed from player hand");
    // handle special card
    if (card.type === CardType.REVERSE) {
      this.turnIncrement *= -1;
    } else if (card.type === CardType.SKIP) {
      this.turn = this.incrementTurn();
    } else if (card.type === CardType.DRAW) {
      // send draw message
      const player = this.incrementTurn();
      if (card.value === 2) {
        this.players[player].hand = [
          ...this.players[player].hand,
          this.deck.pop()!,
          this.deck.pop()!,
        ];
      } else {
        this.players[player].hand = [
          ...this.players[player].hand,
          this.deck.pop()!,
          this.deck.pop()!,
          this.deck.pop()!,
          this.deck.pop()!,
        ];
      }
    } else if (card.type === CardType.WILD) {
      // do something
    }
    console.log("in handle play card about to return");
    this.state = "wait";
    this.turn = this.incrementTurn();
    return true;
  }

  incrementTurn(): number {
    return (this.turn + this.turnIncrement + this.numPlayers) % this.numPlayers;
  }

  isValidCard(card: Card) {
    if (this.topCard === null) {
      return true;
    }
    return (
      card.value !== this.topCard!.value ||
      card.color !== this.topCard!.color ||
      card.type !== this.topCard!.type ||
      card.type === CardType.WILD
    );
  }

  handleWinner() {
    // do stuff
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

  messagePlayer(index: number, data: any, socketEvent: string) {
    // socket message to player
    const player = this.players[index];
    // call game manager, send message
    const playerSocket = gameManager.players[player.id].socketId;
    if (!playerSocket) {
      return false;
    }
    getIO().to(playerSocket).emit(socketEvent, data);
    return true;
  }
  messagePlayerId(id: string) {
    // socket message to player
    const player = this.players.findIndex((player) => player.id === id);
    // call game manager, send message
  }

  broadcastStateUpdate() {
    console.log("broadcast state update");
    for (let i = 0; i < this.numPlayers; i++) {
      this.messagePlayer(
        i,
        this.getPlayerSubset(this.players[i].id),
        "state-update",
      );
    }
  }

  getPlayerSubset(playerId: string): PlayerGameState | null {
    const playerIdx = this.players.findIndex(
      (player) => player.id === playerId,
    );
    if (playerIdx === null || playerIdx < 0) {
      return null;
    }

    const players = this.players.map((player) => player.hand.length);
    const playerArray = players
      .slice(playerIdx)
      .concat(players.slice(0, playerIdx));

    const newTurn =
      (this.turn - playerIdx + this.players.length) % this.players.length;
    console.log(
      "in get player subset with idx: ",
      playerIdx,
      " side note top card is: ",
      this.topCard,
    );
    return {
      gameState: this.state,
      topCard: this.topCard, // null first turn
      myPlayer: this.players[playerIdx],
      myPlayerIdx: playerIdx,
      players: this.players.map((player) => player.hand.length),
      turn: newTurn,
    };
  }
}

export default GameState;
