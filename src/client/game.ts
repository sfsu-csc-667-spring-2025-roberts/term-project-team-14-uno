import { io, Socket } from "socket.io-client";

import { PlayerGameState } from "../server/game/GameState";
import Card from "../server/game/Card";

// constant and global vars
const scaling_factor = 0.5; //for card size
let gameState = null; // state of uno game from server
const params = new URLSearchParams(window.location.search);
const gid = params.get("gid");
const userId = params.get("pid");
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

// sockets
let socket = io({ query: { userId } });
socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  socket.emit("join-game", gid);
  socket.emit("game-state", gid, userId);
});

//for game room messages from server
socket.on("start-game", (msg) => {
  console.log("Message from room start notification :", msg);
  const wait = document.querySelector(".wait");
  if (wait) wait.remove();

  draw_decks_container();
  socket.emit("game-state", gid, userId);
});

socket.on("state-update", (data) => {
  gameState = data;
  console.log(gameState);
  console.log(JSON.stringify(gameState));
  // reorder players so that current player is p1 at index 0
  gameState.players = gameState?.players
    .slice(gameState?.myPlayerIdx)
    .concat(gameState?.players.slice(0, gameState?.myPlayerIdx));
  if (
    gameState?.gameState !== "uninitialized" &&
    data?.gameState !== "finished"
  ) {
    console.log("in here in state update");
    console.log("data: ", data);
    draw_decks(gameState.top);
    draw_players(gameState);
  }
});

// potentially chat
socket.on("message", (msg) => {
  console.log("Message from room:", msg);
});

const main = async () => {
  // draw_decks_container()
  // let res = await fetch("gs.json")
  // res = await res.json()
  // console.log(res)
  // gameState = res
  // draw_decks(gameState.topCard)
  // draw_players(gameState)
  console.log("main fn");
  draw_waiting_indicator();
};
window.addEventListener("load", main);

// Main drawing hand functions
const draw_players = (gameState: PlayerGameState) => {
  var my_hand = gameState.myPlayer.hand;
  const radians = Math.PI / 180;
  const n = gameState.players.length;
  const gc = document.querySelector(".game-container");
  for (let i = 0; i < gameState.players.length; i++) {
    let div;
    div = selectPlayerContainer(i);
    if (!div) {
      div = document.createElement("div");
      div.classList.add(`player`);
      div.classList.add(`p${i}`);
    }
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
      draw_player_select(div, dx, dy);
      draw_player_indicator(div, dx, dy);
    } else {
      draw_opponent_hand(gameState.players[i], div);
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
    div.addEventListener("click", () => {
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
    });
  }
}

function draw_opponent_hand(numCards: number, player_div: HTMLDivElement) {
  let hand = player_div;
  var d_angle = graphics_spec.hand.fan / (numCards - 1);
  let w_card = player_div.getBoundingClientRect().width / 10;
  let h_card = w_card * (93 / 62);
  var w_hand = Math.min(
    graphics_spec.hand.width,
    numCards * w_card - w_card * (numCards / 2),
  );
  var rad_deg = Math.PI / 180;
  var div, img, rot, rot_less, rot_more, d_x, d_y, i;

  while (hand.hasChildNodes()) hand.removeChild(hand.firstChild!);

  for (i = 0; i < numCards; i++) {
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
) => {
  const gc = document.querySelector(".game-container");
  if (!gc) {
    return;
  }
  const div = document.createElement("div");
  div.classList.add("select");
  div.style.left = "calc(" + (50 + "%" + " + " + dx + "%") + ")";
  div.style.top = "calc(" + (50 + "%" + " - " + dy + "%") + ")";
  div.style.transform = "translate(-50%, -15%)";
  gc.appendChild(div);
};

const selectPlayerContainer = (playerIdx: number) => {
  const div = document.querySelector(`.p${playerIdx}`);
  return div;
};

const draw_player_indicator = (
  playerDiv: HTMLDivElement,
  dx: number,
  dy: number,
) => {
  const gc = document.querySelector(".game-container");
  const userIndicatorDiv = document.createElement("div");
  userIndicatorDiv.classList.add("indicator");

  const scoreDiv = document.createElement("div");
  scoreDiv.classList.add("indicator__score");
  const scoreText = document.createElement("span");
  scoreText.innerText = "0";

  scoreDiv.appendChild(scoreText);

  const playerIdDiv = document.createElement("div");
  playerIdDiv.classList.add("indicator__player");
  const playerText = document.createElement("span");
  playerText.innerText = "miles1266";

  playerIdDiv.appendChild(playerText);

  userIndicatorDiv.appendChild(scoreDiv);
  userIndicatorDiv.appendChild(playerIdDiv);
  playerDiv.appendChild(userIndicatorDiv);
};

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
function draw_decks(topCard: Card) {
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
  deck_div.appendChild(div);
}
function discard_pile(topCard: Card) {
  // const deck_div = document.querySelector(".discard")
  const deck_div = document.querySelector(".deck");
  if (!deck_div) {
    return;
  }
  const w_card = (deck_div.getBoundingClientRect().width * 5) / 10;
  const h_card = w_card * (93 / 62);
  if (!deck_div) return;
  // while (deck_div.hasChildNodes()) deck_div.removeChild(deck_div.firstChild);
  let div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("discard");
  div.style.width = w_card + "px";
  div.style.height = h_card + "px";

  let img = document.createElement("img");
  if (!topCard) {
    img.setAttribute("src", "card_img/" + "card_placeholder.svg");
  } else {
    img.setAttribute("src", "card_img/" + topCard.img);
  }
  div.appendChild(img);
  deck_div.appendChild(div);
}
