// constant and global vars
const scaling_factor = 0.5; //for card size
const params = new URLSearchParams(window.location.search);
let gameState = null;
const gid = params.get("gid");
const userId = params.get("pid");
// const test_players = 4
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

//for game room messages from server
socket.on("start-game", (msg) => {
  console.log("Message from room start notification :", msg);
  const wait = document.querySelector(".wait");
  if (wait) wait.remove();

  draw_decks_container();
  socket.emit("game-state", gid, userId);
});
socket.on("message", (msg) => {
  console.log("Message from room:", msg);
});

function draw_player_hand(cards, player_div) {
  console.log("***drawing player hand***");
  let hand = player_div;
  let d_angle = graphics_spec.hand.fan / (cards.length - 1);
  let w_card = graphics_spec.card.width;
  let h_card = graphics_spec.card.height;
  console.log(
    `graphics spec hand width: ${graphics_spec.hand.width} vs card length width ${cards.length * w_card}`,
  );
  let w_hand = Math.min(graphics_spec.hand.width, cards.length * w_card);
  let rad_deg = Math.PI / 180;

  while (hand.hasChildNodes()) hand.removeChild(hand.firstChild);

  for (let i = 0; i < cards.length; i++) {
    let div, img, rot, rot_less, rot_more, d_x, d_y;

    div = document.createElement("div");
    div.classList.add("card");

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
      const abs_container = document.querySelector(".game-container");
      const abs_card = document.createElement("div");
      abs_card.classList.add("card");

      const abs_img = document.createElement("img");
      abs_img.setAttribute("src", cards[i] + ".svg");
      abs_card.appendChild(abs_img);
      abs_card.style.position = "absolute";
      abs_card.style.left = `${rect.left + window.scrollX}px`;
      abs_card.style.top = `${rect.top + window.scrollY}px`;
      abs_card.style.transition = "all 0.5s ease-in-out";
      abs_container.appendChild(abs_card);
      hand.removeChild(div);

      // move abs card
      setTimeout(() => {
        const discard = document.querySelector(".discard");
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

function draw_opponent_hand(numCards, player_div) {
  let hand = player_div;
  var d_angle = graphics_spec.hand.fan / (numCards - 1);
  var w_card = graphics_spec.card.width;
  var h_card = graphics_spec.card.height;
  var w_hand = Math.min(graphics_spec.hand.width, numCards * w_card);
  var rad_deg = Math.PI / 180;
  var div, img, rot, rot_less, rot_more, d_x, d_y, i;

  while (hand.hasChildNodes()) hand.removeChild(hand.firstChild);

  for (i = 0; i < numCards; i++) {
    div = document.createElement("div");
    div.classList.add("card");

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

const draw_players = (gameState) => {
  console.log("in draw players: ", gameState);
  var my_hand = gameState.myPlayer.hand;
  const radians = Math.PI / 180;
  const n = gameState.players.length;
  const gc = document.querySelector(".game-container");
  for (let i = 0; i < gameState.players.length; i++) {
    let div;
    div = selectPlayerContainer(i);
    if (!div) {
      console.log("should have hit this");
      div = document.createElement("div");
      div.classList.add(`player`);
      div.classList.add(`p${i}`);
    }
    const angle = -Math.PI / 2 + i * radians * (360 / n);
    const dy = config.radius * Math.sin(angle);
    console.log(
      "i: ",
      i,
      "\tplayers: ",
      gameState.players,
      "\tangle: ",
      angle,
      "\tdy: ",
      dy,
    );
    const dx = config.radius * Math.cos(angle);
    div.style.left = "calc(" + (50 + "%" + " + " + dx + "%") + ")";
    div.style.top = "calc(" + (50 + "%" + " - " + dy + "%") + ")";
    div.style.transform = "translate(-50%, -50%)";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    gc.appendChild(div);
    if (i == 0) {
      draw_player_hand(my_hand, div);
    } else {
      draw_opponent_hand(gameState.players[i], div);
    }
  }
};

const selectPlayerContainer = (playerIdx) => {
  const div = document.querySelector(`.p${playerIdx}`);
  return div;
};

function draw_decks_container() {
  const gc = document.querySelector(".game-container");
  let deck = document.createElement("div");
  deck.classList.add("deck");

  let draw = document.createElement("div");
  draw.classList.add("draw");
  deck.appendChild(draw);
  let discard = document.createElement("div");
  discard.classList.add("discard");
  deck.appendChild(discard);

  gc.appendChild(deck);
}

function draw_decks(topCard) {
  draw_pile();
  discard_pile(topCard);
}

function draw_pile() {
  const deck_div = document.querySelector(".draw");
  if (!deck_div) return;
  while (deck_div.hasChildNodes()) deck_div.removeChild(deck_div.firstChild);
  let div = document.createElement("div");
  div.classList.add("card");

  let img = document.createElement("img");
  img.setAttribute("src", "card_img/card_back.svg");
  div.appendChild(img);
  deck_div.appendChild(div);
}
function discard_pile(topCard) {
  console.log("in discard pile: ", topCard);
  const deck_div = document.querySelector(".discard");
  if (!deck_div) return;
  while (deck_div.hasChildNodes()) deck_div.removeChild(deck_div.firstChild);
  let div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("discard");

  let img = document.createElement("img");
  if (!topCard) {
    console.log("in here");
    img.setAttribute("src", "card_img/" + "card_placeholder.svg");
  } else {
    console.log("actually in here");
    img.setAttribute("src", "card_img/" + topCard.img);
  }
  div.appendChild(img);
  deck_div.appendChild(div);
}

function draw_waiting_indicator() {
  const gc = document.querySelector(".game-container");

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

const main = () => {
  draw_waiting_indicator();
  // socket.emit("game-state", gid, userId)
  // draw_decks()
  // draw_players(4)
};
