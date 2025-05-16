import Card from "../../client/Card";
import { Color, CardType } from "../../client/Card";
import deck from "./Deck";
import Player from "../../client/Player";
import gameManager from "./GameStore";
import { getIO } from "../socket/socket";
import { CardDB, GameDB, GameStateDB } from "../db/game/GameDbType";
import Game from "../db/game/index";

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
  discard: Card[];
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
    this.discard = [];
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
    // remove distributed from deck
    this.deck.splice(0, this.numPlayers * 7);
    this.state = "wait";
    Game.serializeGame(this.serializeToSQL());
  }

  update(action: Action) {
    console.log("in update");
    switch (this.state) {
      case "wait":
        console.log("in wait");
        if (action.type === "play" && action.card && action.cardIndex) {
          this.state = "play";
          const cardPlayed: Card | null = this.handleCardPlay(
            action.card,
            action.cardIndex,
            action.playerId,
          );
          console.log("after card played");
          if (!cardPlayed) {
            // handle error
          } else {
            // it has to be non null now
            if (!this.topCard) {
              throw Error(
                "somehow top card undefined after successful card play",
              );
            }
            console.log(
              "about to call topCard to db type top is: ",
              typeof this.topCard,
            );
            const cardForUpdate: CardDB = this.topCard.toCardDB();
            // unknown in frontend type
            cardForUpdate.game_id = this.gameId;
            cardForUpdate.location = "discard";
            // userId is indeed sent for this property of action on frontend
            cardForUpdate.owner_id = Number(action.playerId);
            Game.updateCard(cardForUpdate);
            Game.updateGame(this.serializeOnlyGS());

            this.broadcastStateUpdate();
          }
        }
        break;
      case "play":
        // return busy?
        break;
    }
  }

  handleCardPlay(card: Card, cardIndex: number, id: string): Card | null {
    // check if valid
    console.log("in handle play card: ", card);
    const cardPlayed: Card = this.players[this.turn].hand[cardIndex];
    if (!this.isValidCard(card)) {
      return null;
    }
    console.log("in handle play card it is indeed valid");
    this.topCard = cardPlayed;
    this.players[this.turn].hand.splice(cardIndex, 1);
    console.log("in handle play card removed from player hand");
    // handle special card
    if (cardPlayed.type === CardType.REVERSE) {
      this.turnIncrement *= -1;
    } else if (cardPlayed.type === CardType.SKIP) {
      this.turn = this.incrementTurn();
    } else if (cardPlayed.type === CardType.DRAW) {
      // send draw message
      const player = this.incrementTurn();
      if (cardPlayed.value === 2) {
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
    } else if (cardPlayed.type === CardType.WILD) {
      // do something
    }
    console.log("in handle play card about to return");
    this.state = "wait";
    this.turn = this.incrementTurn();
    return cardPlayed;
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

  addPlayer(id: number, username: string | null) {
    this.players.push(new Player(id, username, this.players.length));
    if (this.players.length === this.numPlayers) {
      this.init();
    }
  }

  messagePlayer(index: number, data: any, socketEvent: string) {
    // socket message to player
    const player = this.players[index];
    // call game manager, send message
    const playerSocket = gameManager.players[player.userId].socketId;
    if (!playerSocket) {
      return false;
    }
    getIO().to(playerSocket).emit(socketEvent, data);
    return true;
  }
  messagePlayerId(id: number) {
    // socket message to player
    const player = this.players.findIndex((player) => player.userId === id);
    // call game manager, send message
  }

  broadcastStateUpdate() {
    console.log("broadcast state update");
    for (let i = 0; i < this.numPlayers; i++) {
      this.messagePlayer(
        i,
        this.getPlayerSubset(this.players[i].userId),
        "state-update",
      );
    }
  }

  getPlayerSubset(playerId: number): PlayerGameState | null {
    console.log("in player subset: ", playerId);

    const playerIdx = this.players.findIndex(
      (player) => player.userId === playerId,
    );
    if (playerIdx === null || playerIdx < 0) {
      console.log("whopsie on found index? ", playerIdx);
      return null;
    }

    const players = this.players.map((player) => player.hand.length);
    const playerArray = players
      .slice(playerIdx)
      .concat(players.slice(0, playerIdx));

    const newTurn =
      (this.turn - playerIdx + this.players.length) % this.players.length;

    return {
      gameState: this.state,
      topCard: this.topCard, // null first turn
      myPlayer: this.players[playerIdx],
      myPlayerIdx: playerIdx,
      players: this.players.map((player) => player.hand.length),
      turn: newTurn,
    };
  }

  serializeToSQL(): GameDB {
    const game = {
      game_id: this.gameId,
      state: this.state,
      turn: this.turn,
      turn_increment: this.turnIncrement,
      num_players: this.numPlayers,
      top_card_id: this.topCard ? this.topCard.id : null,
    };
    if (this.state === "uninitialized") {
      return { game, cards: [], players: [] };
    }
    const players = this.players.map((player) => ({
      game_id: this.gameId,
      player_index: player.index,
      user_id: player.userId,
      id: player.uuid,
      username: player.username,
    }));
    console.log("player count from serialization: ", players.length);

    const cards: {
      id: string;
      game_id: string;
      value: number;
      img: string;
      color: string;
      type: string;
      location: string;
      position: number | null;
      owner_id: number | null;
    }[] = this.deck.map((card, idx) => ({
      id: card.id,
      game_id: this.gameId,
      value: card.value,
      img: card.img,
      color: card.color,
      type: card.type,
      location: "deck",
      position: idx,
      owner_id: null,
    }));
    this.players.forEach((player, playerIndex) => {
      player.hand.forEach((card) => {
        cards.push({
          id: card.id,
          game_id: this.gameId,
          value: card.value,
          img: card.img,
          color: card.color,
          type: card.type,
          location: "hand",
          position: -1,
          owner_id: player.userId,
        });
      });
    });
    this.discard
      .map((dCard) => ({
        id: dCard.id,
        game_id: this.gameId,
        value: dCard.value,
        img: dCard.img,
        color: dCard.color,
        type: dCard.type,
        location: "discard",
        position: -1,
        owner_id: null,
      }))
      .forEach((card) => cards.push(card));

    const dbState = { game, players, cards };
    return dbState;
  }

  serializeOnlyGS(): GameStateDB {
    const gs: {
      game_id: string;
      state: string;
      turn: number;
      turn_increment: number;
      num_players: number;
      top_card_id: null | string;
    } = {
      game_id: this.gameId,
      state: this.state,
      turn: this.turn,
      turn_increment: this.turnIncrement,
      num_players: this.numPlayers,
      top_card_id: this.topCard ? this.topCard.id : null,
    };
    return gs;
  }

  static fromSQL(game: GameDB): GameState {
    const gs = new GameState(game.game.game_id, game.game.num_players);

    gs.state = game.game.state;
    gs.turn = game.game.turn;
    gs.turnIncrement = game.game.turn_increment;
    gs.topCard = null;

    // 1. Restore players
    gs.players = game.players.map((p, idx) => {
      return new Player(p.user_id, "", p.player_index); // You may want to load username separately
    });

    // 2. Restore deck & hands
    const deckCards = game.cards
      .filter((c) => c.location === "deck")
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const handCards = game.cards.filter((c) => c.location === "hand");

    gs.deck = deckCards.map(
      (card) =>
        new Card(
          card.value,
          card.img,
          Color[card.color as keyof typeof Color],
          CardType[card.type as keyof typeof CardType],
        ),
    );

    handCards.forEach((card) => {
      const player = gs.players.find((p) => p.userId === card.owner_id);
      if (!player) return;
      player.hand.push(
        new Card(
          card.value,
          card.img,
          Color[card.color as keyof typeof Color],
          CardType[card.type as keyof typeof CardType],
        ),
      );
    });

    return gs;
  }
}

export default GameState;
