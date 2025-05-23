import { io, Socket } from "socket.io-client";

// import { Action, PlayerGameState } from "../client/game/GameState";
import { Action } from "./Action";
import { PlayerGameState } from "./PlayerGameState";
import Card, { CardType } from "./Card";

// constant and global vars
const scaling_factor = 0.5; //for card size
let gameState: PlayerGameState | null = null; // state of uno game from server
const params = new URLSearchParams(window.location.search);
const gid = params.get("gid");
const userId = params.get("pid");
let session_info: { username?: string; userId?: number } = {};
const config = {
  angle: 360,
  radius: 30, // percent
  hand_height: 150,
  hand_width: 200,
};
var graphics_spec = {
  card: {
    width: 62 / scaling_factor,
    height: 93 / scaling_factor,
  },
  hand: {
    fan: 30, // deg
    width: 200 / scaling_factor + 100, // horizontal distance between centers of leftmost and rightmost cards
  },
};

let chat_log: { message: string; user: { userId: number } }[] = [];

// flag for draw card event listener
let draw_el_disabled = true;

// sockets
let socket = io({ query: { userId, gid } });
socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  // socket.emit("join-game", gid);
  // socket.emit("game-state", gid, userId);
});

//for game room messages from server
socket.on("start-game", (msg) => {
  console.log("Start game message received", msg);
  const wait = document.querySelector(".wait");
  if (wait) wait.remove();

  draw_decks_container();
  // socket.emit("game-state", gid, userId);
  fetch("/api/game/state-update", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gid, userId }),
  });
});

socket.on("state-update", (data) => {
  gameState = data;
  console.log(gameState);
  console.log(JSON.stringify(gameState));
  // should be done on server now
  if (
    gameState?.gameState !== "uninitialized" &&
    data?.gameState !== "finished"
  ) {
    console.log("in here in state update");
    // console.log("data: ", data);
    if (!gameState) return;
    if (gameState.turn === 0) {
      draw_el_disabled = false;
    }
    draw_decks(gameState.topCard);
    draw_players(gameState);
  }
});

// potentially chat
socket.on("message", (msg) => {
  console.log("Message from room:", msg);
});

// chat handler
socket.on("chat-message", ({ body, user }) => {
  console.log(`chat message received ${user.id}: ${body}`);
  const newChatMessage = { message: body, user: { userId: user.id } };
  chat_log.push(newChatMessage);
  const chatMsgContainer = document.querySelector(".chat__messages");
  if (!chatMsgContainer) {
    return;
  }
  const newMsgDiv = document.createElement("div");
  newMsgDiv.classList.add("chat__msg");
  const msgGrav = document.createElement("div");
  msgGrav.classList.add("chat__gavitar");
  const msgUser = document.createElement("span");
  msgUser.classList.add("chat__msg-user");
  msgUser.innerText = newChatMessage.user.userId;
  const msgBody = document.createElement("span");
  msgBody.classList.add("chat__msg-body");
  msgBody.innerText = newChatMessage.message;

  newMsgDiv.appendChild(msgGrav);
  newMsgDiv.appendChild(msgUser);
  newMsgDiv.appendChild(msgBody);

  chatMsgContainer.appendChild(newMsgDiv);
});

socket.on("action-update", () => {
  fetch("/api/game/state-update", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gid, userId }),
  });
});

socket.on("draw-notification", (data) => {
  const { drawCount } = data;

  const gc = document.querySelector(".game-container");
  if (!gc) return;

  // Create modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const header = document.createElement("h1");
  header.innerText = `A draw card was played, increasing your hand by ${drawCount}`;
  modal.appendChild(header);

  gc.appendChild(modal);

  // Remove modal after 3 seconds
  setTimeout(() => {
    modal.remove();
  }, 10000);
});

socket.on("wild-selection", (data) => {
  const { color } = data;

  const gc = document.querySelector(".game-container");
  if (!gc) return;

  // Create modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const header = document.createElement("h1");
  header.innerText = `Wild card was played and the selected color: ${color}`;
  modal.appendChild(header);

  gc.appendChild(modal);

  // Remove modal after 3 seconds
  setTimeout(() => {
    modal.remove();
  }, 10000);
});

socket.on("turn-skip", (data) => {
  const string = data;

  const gc = document.querySelector(".game-container");
  if (!gc) return;

  // Create modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const header = document.createElement("h1");
  header.innerText = `Your turn was skipped. ${string}`;
  modal.appendChild(header);

  gc.appendChild(modal);

  // Remove modal after 3 seconds
  setTimeout(() => {
    modal.remove();
  }, 10000);
});

socket.on("reverse", (data) => {
  const string = data;

  const gc = document.querySelector(".game-container");
  if (!gc) return;

  // Create modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const header = document.createElement("h1");
  header.innerText = `Reverse was played. ${string}`;
  modal.appendChild(header);

  gc.appendChild(modal);

  // Remove modal after 3 seconds
  setTimeout(() => {
    modal.remove();
  }, 10000);
});

socket.on("win-notification", (data) => {
  const { winner } = data;
  const gc = document.querySelector(".game-container");
  if (!gc) return;

  const myUserId = userId;
  const message =
    winner.userId === myUserId
      ? "🎉 You won the game! 🎉"
      : `${winner.username ?? "A player"} has won the game.`;

  // Create modal
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const header = document.createElement("h1");
  header.innerText = message;
  modal.appendChild(header);

  // Exit button
  const exitBtn = document.createElement("button");
  exitBtn.innerText = "Exit Game";
  exitBtn.style.backgroundColor = "red";
  exitBtn.style.color = "white";
  exitBtn.style.padding = "1rem 2rem";
  exitBtn.style.fontSize = "1.5rem";
  exitBtn.style.border = "none";
  exitBtn.style.borderRadius = "0.5rem";
  exitBtn.style.marginTop = "2rem";
  exitBtn.style.cursor = "pointer";
  exitBtn.addEventListener("click", () => {
    socket.disconnect();
    window.location.href = "/";
  });

  modal.appendChild(exitBtn);
  gc.appendChild(modal);
});

const main = async () => {
  let res = await fetch("/api/game/state-only", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userId, gid: gid }),
  });
  let resJson = await res.json();
  console.log(resJson);
  if (resJson.success && resJson?.state === "uninitialized") {
    draw_waiting_indicator();
  } else {
    draw_decks_container();
  }
  const chatSubmit = document.getElementById("chat-submit");
  if (chatSubmit) {
    chatSubmit.addEventListener("click", handleChatSubmit);
  }
  res = await fetch("/api/auth/session");
  resJson = await res.json();
  session_info = resJson;
};
window.addEventListener("load", main);

// Main drawing hand functions
const draw_players = (gameState: PlayerGameState) => {
  console.log("drawing players");
  var my_hand = gameState.myPlayer.hand;
  const radians = Math.PI / 180;
  const n = gameState.players.length;
  const gc = document.querySelector(".game-container");
  for (let i = 0; i < gameState.players.length; i++) {
    let div;
    div = selectPlayerContainer(i);
    console.log("selected player, it exists? ", div);
    if (div) {
      div.remove(); // Remove the existing container
    }
    div = document.createElement("div");
    div.classList.add(`player`);
    div.classList.add(`p${i}`);
    if (!(div instanceof HTMLDivElement)) {
      console.log("somehow the div was not a div..?");
      return;
    }
    // place player container
    const angle = -Math.PI / 2 + i * radians * (360 / n);
    const dy = config.radius * Math.sin(angle);
    const dx = config.radius * Math.cos(angle);
    div.style.left = "calc(" + (50 + "%" + " + " + dx + "%") + ")";
    div.style.top = "calc(" + (50 + "%" + " - " + dy + "%") + ")";
    div.style.transform = "translate(-50%, -50%)";
    // to keep cards centered in player container
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    if (!gc) {
      console.log("somehow gc was not defined");
      return;
    }
    gc.appendChild(div);
    if (i == 0) {
      draw_player_hand(my_hand, div);
      draw_player_indicator(div, dx, dy, gameState.myPlayerIdx);
      console.log("about to do select logic");
    } else {
      draw_opponent_hand(gameState.players[i], div);
    }
    if (!document.querySelector(`.select.p${i}`)) {
      console.log("needs to draw original select");
      draw_player_select(div, dx, dy, i);
    } else {
      togglePlayerSelect(i);
    }
  }
};

function draw_player_hand(cards: Card[], player_div: HTMLDivElement) {
  let hand = player_div;
  let d_angle = graphics_spec.hand.fan / (cards.length - 1);
  // let w_card = graphics_spec.card.width;
  let w_card = player_div.getBoundingClientRect().width / 10;
  // let h_card = graphics_spec.card.height;
  let h_card = w_card * (93 / 62);
  console.log(
    `graphics spec hand width: ${graphics_spec.hand.width} vs card length width ${cards.length * w_card}`,
  );
  let w_hand = Math.min(graphics_spec.hand.width, cards.length * w_card);
  console.log("width hand: ", w_hand);
  let rad_deg = Math.PI / 180;

  while (hand.hasChildNodes()) hand.removeChild(hand.firstChild!);

  for (let i = 0; i < cards.length; i++) {
    console.log("drawing player hand");
    let div, img, rot, rot_less, rot_more, d_x, d_y;

    div = document.createElement("div");
    div.classList.add("card");
    div.style.width = w_card + "px";
    div.style.height = h_card + "px";

    img = document.createElement("img");
    img.setAttribute("src", "card_img/" + cards[i].img);

    div.appendChild(img);
    hand.appendChild(div);

    if (cards.length < 2) continue;

    rot = i * d_angle - graphics_spec.hand.fan / 2;

    d_x =
      (i * (w_hand - w_card)) / (cards.length - 1) +
      (cards.length * w_card - w_hand) / 2 -
      i * w_card;

    rot_more = Math.abs(rot);
    rot_less = Math.max(0, rot_more - d_angle);
    d_y =
      (h_card / 2) * Math.cos(rot_less * rad_deg) +
      (w_card / 2) * Math.sin(rot_less * rad_deg) -
      ((h_card / 2) * Math.cos(rot_more * rad_deg) -
        (w_card / 2) * Math.sin(rot_more * rad_deg));

    div.style.transform =
      "translate(" +
      Math.round(d_x) +
      "px," +
      Math.round(d_y) +
      "px) rotate(" +
      rot +
      "deg)";

    // Add event listeners for hover effect
    div.addEventListener("mouseenter", () => {
      div.style.transform += " translateY(-25px)";
    });

    div.addEventListener("mouseleave", () => {
      div.style.transform =
        "translate(" +
        Math.round(d_x) +
        "px," +
        Math.round(d_y) +
        "px) rotate(" +
        rot +
        "deg)";
    });
    // TEST ANIMATE
    div.addEventListener("click", async () => {
      console.log("should be triggering play card");
      let color: string | undefined = undefined;
      if (!isValidCard(cards[i]) || !(gameState!.turn === 0)) {
        console.log("issue playing card, not executed");
        return;
      } else {
        if (cards[i].type === CardType.WILD) {
          // handle wild selection
          color = await handleWildChoice();
          console.log("color is: ", color);
        }
      }
      const rect = div.getBoundingClientRect();
      console.log(rect);
      const abs_container = document.querySelector(".layout");
      const abs_card = document.createElement("div");
      abs_card.classList.add("card");
      abs_card.style.width = w_card + "px";
      abs_card.style.height = h_card + "px";

      const abs_img = document.createElement("img");
      abs_img.setAttribute("src", "card_img/" + cards[i].img);
      abs_card.appendChild(abs_img);
      abs_card.style.position = "absolute";
      abs_card.style.left = `${rect.left + window.scrollX}px`;
      abs_card.style.top = `${rect.top + window.scrollY}px`;
      abs_card.style.transition = "all 0.5s ease-in-out";
      abs_container!.appendChild(abs_card);
      hand.removeChild(div);

      // move abs card
      setTimeout(() => {
        const discard = document.querySelector(".discard");
        if (!discard) {
          return;
        }
        const newRect = discard.getBoundingClientRect(); // Replace with your actual function to get new position
        abs_card.style.left = `${newRect.left + window.scrollX}px`;
        abs_card.style.top = `${newRect.top + window.scrollY}px`;

        // Remove the card after the animation completes
        abs_card.addEventListener("transitionend", () => {
          abs_card.remove();
        });
      }, 50);

      // server play card
      (async () => {
        console.log("in the async is color defined? ", color);
        const success = await play_card(cards[i], i, color);
        if (!success) {
          console.warn("Server rejected card play");
          // Optional: rollback UI or notify user here
        }
      })();
    });
  }
}

function draw_opponent_hand(numCards: number, player_div: HTMLDivElement) {
  let hand = player_div;
  var d_angle = graphics_spec.hand.fan / (numCards - 1);
  let w_card = player_div.getBoundingClientRect().width / 10;
  let h_card = w_card * (93 / 62);
  console.log("opt1: ", graphics_spec.hand.width);
  console.log("opt2: ", numCards * w_card - w_card * (numCards / 2));
  var w_hand = Math.min(
    graphics_spec.hand.width,
    numCards * w_card - w_card * (numCards / 2),
  );
  if (numCards <= 2) {
    w_hand = w_card * 1.5;
  }
  console.log("result: ", w_hand);
  var rad_deg = Math.PI / 180;
  var div, img, rot, rot_less, rot_more, d_x, d_y, i;

  while (hand.hasChildNodes()) hand.removeChild(hand.firstChild!);

  for (i = 0; i < numCards; i++) {
    console.log(
      "in draw opponent hand with player div: ",
      player_div,
      " and opponent card num: ",
      i,
    );
    div = document.createElement("div");
    div.classList.add("card");
    div.style.width = w_card + "px";
    div.style.height = h_card + "px";

    img = document.createElement("img");
    img.setAttribute("src", "card_img/card_back.svg");

    div.appendChild(img);
    hand.appendChild(div);

    if (numCards < 2) continue;

    rot = i * d_angle - graphics_spec.hand.fan / 2;

    d_x =
      (i * (w_hand - w_card)) / (numCards - 1) +
      (numCards * w_card - w_hand) / 2 -
      i * w_card;

    rot_more = Math.abs(rot);
    rot_less = Math.max(0, rot_more - d_angle);
    d_y =
      (h_card / 2) * Math.cos(rot_less * rad_deg) +
      (w_card / 2) * Math.sin(rot_less * rad_deg) -
      ((h_card / 2) * Math.cos(rot_more * rad_deg) -
        (w_card / 2) * Math.sin(rot_more * rad_deg));

    div.style.transform = "translateX(" + Math.round(d_x) + "px)";
  }
}

// helper functions
function draw_waiting_indicator() {
  const gc = document.querySelector(".game-container");
  if (!gc) {
    return;
  }

  const waitDiv = document.createElement("div");
  waitDiv.classList.add("wait");
  waitDiv.style.display = "flex";
  waitDiv.style.flexDirection = "column";
  waitDiv.style.alignItems = "center";

  const title = document.createElement("h1");
  title.innerText = "Waiting for game to begin...";
  title.style.textAlign = "center";
  waitDiv.appendChild(title);

  const spinner = document.createElement("div");
  spinner.style.height = "20px";
  spinner.style.width = "20px";
  spinner.style.backgroundColor = "black";
  waitDiv.appendChild(spinner);

  gc.appendChild(waitDiv);
}

const draw_player_select = (
  playerDiv: HTMLDivElement,
  dx: number,
  dy: number,
  playerIndex: number,
) => {
  const gc = document.querySelector(".game-container");
  if (!gc) {
    return;
  }
  if (document.querySelector(`.select.p${playerIndex}`)) {
    console.log("Whoa wtf why does this already exist");
    return;
  }
  const div = document.createElement("div");
  div.classList.add("select");
  div.classList.add(`p${playerIndex}`);
  if (playerIndex !== gameState!.turn) {
    div.classList.add(`hidden`);
  }
  div.style.left = "calc(" + (50 + "%" + " + " + dx + "%") + ")";
  div.style.top = "calc(" + (50 + "%" + " - " + dy + "%") + ")";
  div.style.transform = "translate(-50%, -15%)";
  gc.appendChild(div);
};
const togglePlayerSelect = (i: number) => {
  console.log("toggling");
  const selectDiv = document.querySelector(`.select.p${i}`);
  if (!selectDiv) {
    console.log("error toggling player select");
    return;
  }
  if (i === gameState!.turn && selectDiv.classList.contains("hidden")) {
    console.log(
      "game state turn is : ",
      gameState!.turn,
      " removing hidden for player: ",
      i,
    );
    selectDiv.classList.remove("hidden");
  }
  if (i !== gameState!.turn && !selectDiv.classList.contains("hidden")) {
    console.log(
      "game state turn is : ",
      gameState!.turn,
      " adding hidden for player: ",
      i,
    );
    selectDiv.classList.add("hidden");
  }
};

const selectPlayerContainer = (playerIdx: number) => {
  const div = document.querySelector(`.player.p${playerIdx}`);
  return div;
};

const draw_player_indicator = (
  playerDiv: HTMLDivElement,
  dx: number,
  dy: number,
  playerIndex: number,
) => {
  const gc = document.querySelector(".game-container");
  if (document.querySelector(`.indicator.p${playerIndex}`)) {
    return;
  }
  const userIndicatorDiv = document.createElement("div");
  userIndicatorDiv.classList.add("indicator");
  userIndicatorDiv.classList.add(`p${playerIndex}`);

  const scoreDiv = document.createElement("div");
  scoreDiv.classList.add("indicator__score");
  const scoreText = document.createElement("span");
  console.log(
    "this should be the value of index: ",
    playerIndex,
    " and the players array: ",
    gameState?.players,
  );
  scoreText.innerText = `${gameState?.players[playerIndex].toString()}`;

  scoreDiv.appendChild(scoreText);

  const playerIdDiv = document.createElement("div");
  playerIdDiv.classList.add("indicator__player");
  const playerText = document.createElement("span");
  playerText.innerText = session_info?.username
    ? `${session_info?.username}`
    : "Unknown";
  playerText.style.fontSize = "clamp(12px, 2vw, 16px)";

  playerIdDiv.appendChild(playerText);

  userIndicatorDiv.appendChild(scoreDiv);
  userIndicatorDiv.appendChild(playerIdDiv);
  playerDiv.appendChild(userIndicatorDiv);
};

async function play_card(
  card: Card,
  cardIndex: number,
  color: string | undefined,
) {
  // if (!(gameState!.turn === 0)) {
  //   //show invalid
  //   return false;
  // }
  // if (!isValidCard(card)) {
  //   //show invalid?
  //   return false;
  // }
  // if (card.type === CardType.WILD) {
  //   // handle wild selection
  //   color = await handleWildChoice();
  // }
  console.log("in play card: ", card);
  let action: Action;
  action = {
    type: "play",
    card,
    cardIndex,
    playerId: userId!,
    gameId: gid!,
    wildColor: color,
  };
  console.log("about to play card with action: ", action);
  const res = await fetch("/api/game/play-card", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, gid, action }),
  });
  const resJson = await res.json();
  if (resJson.success) {
    console.log("play success");
    return true;
  } else {
    console.warn("Invalid action:", resJson?.msg);
    return false;
  }
}

function isValidCard(card: Card): boolean {
  if (!gameState) {
    console.log("game state not defined");
    return false;
  }
  if (gameState.topCard === null) {
    return true;
  }
  if (
    card.type === CardType.REGULAR &&
    gameState?.topCard?.type !== CardType.REGULAR
  ) {
    return card.color === gameState.topCard.color;
  }
  return (
    card.value === gameState.topCard.value ||
    card.color === gameState.topCard.color ||
    card.type === CardType.WILD
  );
}

function handleWildChoice(): Promise<string> {
  return new Promise((resolve) => {
    const gc = document.querySelector(".game-container");
    if (!gc) return resolve("red"); // fallback

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const header = document.createElement("h2");
    header.textContent = "Choose a Color:";
    modal.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("modal__body");
    modal.appendChild(body);

    const colors = ["red", "green", "blue", "yellow"];
    const buttons = colors.map((color) => {
      const btn = document.createElement("div");
      btn.classList.add("card");
      const card_img = document.createElement("img");
      card_img.setAttribute(
        "src",
        `card_img/card_blank_${color.charAt(0)}.svg`,
      );
      btn.appendChild(card_img);
      btn.style.margin = "0.5rem";
      btn.onclick = () => {
        gc.removeChild(modal); // remove modal
        resolve(color);
      };
      return btn;
    });

    buttons.forEach((btn) => body.appendChild(btn));
    gc.appendChild(modal);
  });
}

// Drawing decks in the middle
function draw_decks_container() {
  const gc = document.querySelector(".game-container");
  if (!gc) {
    return;
  }
  let deck = document.createElement("div");
  deck.classList.add("deck");
  gc.appendChild(deck);
}

function draw_decks(topCard: Card | null) {
  console.log("drawing decks");
  draw_pile();
  discard_pile(topCard);
}
function draw_pile() {
  // const deck_div = document.querySelector(".draw")
  const deck_div = document.querySelector(".deck");
  if (!deck_div) {
    return;
  }
  const w_card = (deck_div.getBoundingClientRect().width * 5) / 10;
  const h_card = w_card * (93 / 62);
  if (!deck_div) return;
  while (deck_div.hasChildNodes()) deck_div.removeChild(deck_div.firstChild!);
  let div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("draw");
  div.style.width = w_card + "px";
  div.style.height = h_card + "px";

  let img = document.createElement("img");
  img.setAttribute("src", "card_img/card_back.svg");
  div.appendChild(img);
  div.addEventListener("click", mainPlayerDraw);
  deck_div.appendChild(div);
}
function discard_pile(topCard: Card | null) {
  // const deck_div = document.querySelector(".discard")
  console.log("in discard pile");
  const deck_div = document.querySelector(".deck");
  if (!deck_div) {
    return;
  }
  const w_card = (deck_div.getBoundingClientRect().width * 5) / 10;
  const h_card = w_card * (93 / 62);
  if (!deck_div) return;
  console.log("in discard pile past the check for deck div");
  // while (deck_div.hasChildNodes()) deck_div.removeChild(deck_div.firstChild);
  let div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("discard");
  div.style.width = w_card + "px";
  div.style.height = h_card + "px";

  let img = document.createElement("img");
  console.log("in discard pile done all this shit about to check card image");
  if (!topCard) {
    console.log("in discard pile default card blank");
    img.setAttribute("src", "card_img/" + "card_placeholder.svg");
  } else {
    console.log("in discard pile setting card image: ", topCard.img);
    img.setAttribute("src", "card_img/" + topCard.img);
  }
  div.appendChild(img);
  deck_div.appendChild(div);
}

function handleChatSubmit(e: Event) {
  console.log("handle chat submit");
  const input = document.getElementById("chat-post") as HTMLInputElement;
  if (!input) {
    console.log("no input");
    return;
  }
  const message = input?.value;
  if (!message) {
    console.log("no message");
    return;
  }
  console.log("gotten here");
  input.value = "";
  fetch("/api/chat/post", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, gid, userId }),
  });
}

async function mainPlayerDraw() {
  if (draw_el_disabled) {
    return;
  }
  draw_el_disabled = true;
  if (!userId || !gid) {
    return;
  }
  let action: Action = {
    type: "draw",
    playerId: userId,
    gameId: gid,
  };
  const res = await fetch("/api/game/draw-card", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, gid, action }),
  });
  const resJson = await res.json();
  if (resJson.success) {
    draw_el_disabled = true;
  }
  const cardDrew = resJson.card;
  animateCardToHand(0);
}

function animateCardToHand(playerIndex: number) {
  const lastPlayerHandCard = document.querySelector(`.player.p${playerIndex}`)
    ?.lastElementChild?.previousElementSibling as HTMLElement;
  const computedStyle = window.getComputedStyle(lastPlayerHandCard);
  const transform = computedStyle.transform;
  const draw = document.querySelector(".draw") as HTMLElement;
  if (!lastPlayerHandCard || !draw || !transform) return;

  const rect = draw.getBoundingClientRect();
  const w_card: number = rect.width;
  const h_card: number = rect.height;
  const abs_container = document.querySelector(".layout")!;
  const abs_card = document.createElement("div");
  abs_card.classList.add("card");
  abs_card.style.width = w_card + "px";
  abs_card.style.height = h_card + "px";

  const abs_img = document.createElement("img");
  abs_img.setAttribute("src", "card_img/card_back.svg");
  abs_card.appendChild(abs_img);
  abs_card.style.position = "absolute";
  abs_card.style.left = `${rect.left + window.scrollX}px`;
  abs_card.style.top = `${rect.top + window.scrollY}px`;
  abs_card.style.transition = "all 0.75s ease-in-out";
  abs_container.appendChild(abs_card);

  console.log("right BEFORE timeout in animation card to hand");

  setTimeout(() => {
    console.log("INSIDE timeout in animation card to hand");
    const newRect = lastPlayerHandCard.getBoundingClientRect();
    abs_card.style.left = `${newRect.left + window.scrollX}px`;
    abs_card.style.top = `${newRect.top + window.scrollY}px`;
    abs_card.style.transform = transform;

    abs_card.addEventListener("transitionend", () => {
      abs_card.remove();
    });
  }, 50);
}
