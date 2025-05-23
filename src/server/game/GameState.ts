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

  constructor(gameId: string, numPlayers: number = 4, numSystemPlayers = 0) {
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
    console.log("in update with action: ", action);
    switch (this.state) {
      case "wait":
        console.log("in wait");
        if (action.type === "play" && action.card && action.cardIndex != null) {
          this.state = "play";
          const player = this.players[this.turn];
          const cardPlayed: Card | null = this.handleCardPlay(
            action.card,
            action.cardIndex,
            action.playerId,
            action.wildColor ? action.wildColor : null,
          );
          console.log("the card played was: ", cardPlayed);
          console.log("after card played");
          if (!cardPlayed) {
            // handle error
            console.log("in update this is not a card played...");
          } else {
            // it has to be non null now
            if (!this.topCard) {
              throw Error(
                "somehow top card undefined after successful card play",
              );
            }
            console.log(
              "**ok it seems play was correct now top card is:  ",
              this.topCard,
            );
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
            if (player.hand.length === 0) {
              this.handleWinner(player);
            }
          }
        } else if (action.type === "draw") {
          this.state = "play";
          const drewCard: Card | null = this.handleDrawCard(action);
          if (!drewCard) {
            // do what, throw error?
          } else {
            const updateCard: CardDB = drewCard.toCardDB();
            updateCard.game_id = this.gameId;
            updateCard.owner_id = Number(action.playerId);
            updateCard.location = "hand";
            Game.updateCard(updateCard);
          }
          this.state = "wait";
          this.turn = this.incrementTurn();
          Game.updateGame(this.serializeOnlyGS());
          this.broadcastStateUpdate();
        }
        break;
      case "play":
        // return busy?
        break;
    }
  }

  handleCardPlay(
    card: Card,
    cardIndex: number,
    id: string,
    color: string | null,
  ): Card | null {
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
      const playerNotify_1 = this.incrementTurn();
      this.messagePlayer(playerNotify_1, "Your turn is skipped.", "reverse");
      this.turnIncrement *= -1;
      const playerNotify_2 = this.incrementTurn();
      this.messagePlayer(playerNotify_2, "It is now your turn", "reverse");
    } else if (cardPlayed.type === CardType.SKIP) {
      const playerNotify_1 = this.incrementTurn();
      this.messagePlayer(playerNotify_1, "skip card played.", "turn-skip");
      this.turn = this.incrementTurn();
    } else if (cardPlayed.type === CardType.DRAW) {
      const player = this.incrementTurn();
      // *todo* fix if deck runs out
      const drawnCards: Card[] = [this.deck.pop()!, this.deck.pop()!];
      Game.updateCards(
        drawnCards.map((card) => {
          const db_card = card.toCardDB();
          db_card.owner_id = this.players[player].userId;
          db_card.location = "hand";
          return db_card;
        }),
      );
      this.players[player].hand.push(...drawnCards);
      // send draw message
      let nextPlayerSocket =
        gameManager.players[
          this.players[this.incrementTurn()].userId.toString()
        ][this.gameId].socketId;
      if (!nextPlayerSocket) {
        console.log(
          "ANOTHER BIG ERROR, increment turn should produce increment: ",
          this.incrementTurn(),
          " and player: ",
          this.players[this.incrementTurn()],
        );
      } else {
        getIO().to(nextPlayerSocket).emit("draw-notification", {
          drawCount: 2,
        });
      }
      this.turn = this.incrementTurn();
    } else if (cardPlayed.type === CardType.WILD) {
      // do something
      if (!(color && color.toUpperCase() in Color)) {
        // Invalid color
        console.log("incorrect wild color: ", color);
        throw new Error("the action color from wild is incorrect");
      }
      console.log("this is the actual color: ", color, " and");
      console.log(
        "selected color for wild is: ",
        Color[color.toUpperCase() as keyof typeof Color],
      );
      this.topCard.color = Color[color.toUpperCase() as keyof typeof Color];
      // notify next player of color picked

      // this indicates it is a wild draw 4
      if (card.value === 4) {
        console.log("it is a draw 4 card");
        // first notify skipped player of draw
        const player = this.incrementTurn();
        let nextPlayerSocket =
          gameManager.players[
            this.players[this.incrementTurn()].userId.toString()
          ][this.gameId].socketId;
        if (!nextPlayerSocket) {
          console.log(
            "ANOTHER BIG ERROR, increment turn should produce increment: ",
            this.incrementTurn(),
            " and player: ",
            this.players[this.incrementTurn()],
          );
        } else {
          getIO().to(nextPlayerSocket).emit("draw-notification", {
            drawCount: 4,
          });
        }
        this.turn = this.incrementTurn();
        nextPlayerSocket =
          gameManager.players[
            this.players[this.incrementTurn()].userId.toString()
          ][this.gameId].socketId;
        if (!nextPlayerSocket) {
          console.log(
            "ANOTHER BIG ERROR, increment turn should produce increment: ",
            this.incrementTurn(),
            " and player: ",
            this.players[this.incrementTurn()],
          );
        } else {
          getIO().to(nextPlayerSocket).emit("wild-selection", {
            color: color.toUpperCase(),
          });
        }
        // *todo* fix if deck runs out
        const drawnCards: Card[] = [
          this.deck.pop()!,
          this.deck.pop()!,
          this.deck.pop()!,
          this.deck.pop()!,
        ];
        const mapped_cards: CardDB[] = drawnCards.map((card) => {
          const db_card = card.toCardDB();
          db_card.owner_id = this.players[player].userId;
          db_card.game_id = this.gameId;
          db_card.location = "hand";
          return db_card;
        });
        console.log("result of mapped cards for draw 4: ", mapped_cards);
        Game.updateCards(mapped_cards);
        this.players[player].hand.push(...drawnCards);
      } else {
        // it is a normal wild card
        const nextPlayerSocket =
          gameManager.players[
            this.players[this.incrementTurn()].userId.toString()
          ][this.gameId].socketId;
        if (!nextPlayerSocket) {
          console.log(
            "ANOTHER BIG ERROR, increment turn should produce increment: ",
            this.incrementTurn(),
            " and player: ",
            this.players[this.incrementTurn()],
          );
        } else {
          getIO().to(nextPlayerSocket).emit("wild-selection", {
            color: color.toUpperCase(),
          });
        }
      }
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
    if (
      card.type === CardType.REGULAR &&
      this.topCard?.type !== CardType.REGULAR
    ) {
      return card.color === this.topCard.color;
    }
    return (
      card.value === this.topCard!.value ||
      card.color === this.topCard!.color ||
      card.type === CardType.WILD
    );
  }

  handleDrawCard(action: Action): Card | null {
    if (this.deck.length === 0) {
      return null;
    }
    const drewCard: Card | undefined = this.deck.pop();
    if (!drewCard) {
      return null;
    }
    const idx = this.players.findIndex(
      (player) => player.userId === Number(action.playerId),
    );
    if (idx === -1) {
      console.log("MEGA BIG ERROR IN HANDLE DRAW");
      return null;
    }
    this.players[idx].hand.push(drewCard);
    console.log("in handle draw, card drawn is: ", drewCard);
    return drewCard;
  }

  handleWinner(player: Player) {
    this.state = "gg";
    this.broadcastWinner(player);
    gameManager.removeGame(
      this.gameId,
      this.players.map((player) => player.userId),
    );
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
    const playerSocket =
      gameManager.players[player.userId][this.gameId].socketId;
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
  broadcastWinner(player: Player) {
    console.log("broadcast winner");
    for (let i = 0; i < this.numPlayers; i++) {
      this.messagePlayer(i, { winner: player }, "win-notification");
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
