import { io, Socket } from "socket.io-client";

const username = generateRandomId();
const chat_log = [];

let socket = io({ query: { gid: "lobby" } });
socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  // socket.emit("join-game", gid);
  // socket.emit("game-state", gid, userId);
});

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

export interface GameStateDB {
  game_id: string;
  state: string;
  turn: number;
  turn_increment: number;
  num_players: number;
  top_card_id: null | string;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".join-game-container");
  if (!container) return;
  const containerActive = document.querySelector(".active-games-container");
  if (!containerActive) return;

  try {
    const res = await fetch("/api/game/open-games");
    const resJson = await res.json();
    console.log("here first");

    const res_active = await fetch("/api/game/my-active");
    const resActiveJson = await res_active.json();
    console.log("then here: ", resActiveJson);

    if ((resJson as GameStateDB[]).length === 0) {
      const p = document.createElement("p");
      p.innerText = "No open games available right now, start a new game!";
      container.appendChild(p);
    } else {
      for (let game of resJson as GameStateDB[]) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <div class="header-container">
                      <h2>Join a waiting game "${game.game_id}"</h2>
                  </div>
                  <p>${game.num_players} players haven't started yet.
                  </p>
                  <button class="btn join-btn" data-game-id="${game.game_id}">Join Game</button>`;

        container.appendChild(card);
      }
    }

    if ((resActiveJson.games as GameStateDB[]).length === 0) {
      console.log("got here");
      const p = document.createElement("p");
      p.innerText =
        "You have no active games available right now, start a new game!";
      containerActive.appendChild(p);
    } else {
      for (let game of resActiveJson as GameStateDB[]) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <div class="header-container">
                      <h2>Enter your active game "${game.game_id}"</h2>
                  </div>
                  <p>${game.num_players - 1} currently playing.
                  </p>
                  <button class="btn active-btn" data-game-id="${game.game_id}">Join Game</button>`;

        container.appendChild(card);
      }
    }
  } catch (err) {
    alert("Failed to load open games.");
    console.error(err);
  }

  container.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("join-btn")) {
      const gameId = target.dataset.gameId;
      console.log(`Joining game ${gameId}`);
      try {
        const res = await fetch("/api/game/join-game", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, gid: gameId }),
        });
        const resJson = await res.json();
        if (!resJson.success) {
          alert("Unable to join game. It may be full or unavailable.");
          return;
        }
        window.location.href = `/game?gid=${resJson.gid}&pid=${resJson.userId}`;
      } catch (err) {
        alert("Error joining game.");
        console.error(err);
      }
    }
  });
  containerActive.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("active-btn")) {
      const gameId = target.dataset.gameId;
      console.log(`Joining game ${gameId}`);
      try {
        const res = await fetch("/api/game/join-game", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, gid: gameId }),
        });
        const resJson = await res.json();
        if (!resJson.success) {
          alert("Unable to join game. It may be full or unavailable.");
          return;
        }
        window.location.href = `/game?gid=${resJson.gid}&pid=${resJson.userId}`;
      } catch (err) {
        alert("Error joining game.");
        console.error(err);
      }
    }
  });
});

document.querySelector(".start-btn")!.addEventListener("click", () => {
  document.querySelector(".modal")!.classList.remove("hidden");
});

document.querySelector(".modal-close")!.addEventListener("click", () => {
  document.querySelector(".modal")!.classList.add("hidden");
});

document
  .getElementById("new-game-form")!
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const gameName = (document.getElementById("game-name") as HTMLInputElement)
      .value;
    //unimplemented feature
    // const systemPlayers = parseInt(
    //   (document.getElementById("system-players") as HTMLSelectElement).value,
    // );
    const systemPlayers = 0;

    try {
      const res = await fetch("/api/game/new-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName,
          systemPlayers,
        }),
      });

      const resJson = await res.json();
      if (!resJson.success) {
        alert("Failed to create new game.");
        return;
      }
      window.location.href = `/game?gid=${resJson.gid}&pid=${resJson.userId}`;
    } catch (err) {
      alert("Error creating new game.");
      console.error(err);
    }
  });

document
  .getElementById("chat-submit")!
  .addEventListener("click", handleChatSubmit);

document.querySelector(".open-chat")!.addEventListener("click", () => {
  const chat = document.querySelector(".chat");
  const layout = document.querySelector(".layout");
  const chat_button = document.querySelector(".open-chat") as HTMLElement;
  if (!chat || !layout || !chat_button) return;

  if (chat.classList.contains("hidden")) {
    chat.classList.remove("hidden");
    layout.classList.remove("chat-closed");

    chat_button.innerHTML = "›";
    const layout_rect = layout.getBoundingClientRect();
    const chat_rect = chat.getBoundingClientRect();

    const offset = layout_rect.right - chat_rect.left;
    chat_button.style.right = `${offset}px`;
    chat_button.style.right = `${offset}px`;
  } else {
    chat.classList.add("hidden");
    layout.classList.add("chat-closed");
    chat_button.innerHTML = "‹";
    chat_button.style.right = `0px`;
  }
});

// Persistent username thru localStorage
function getOrCreateUsername(): string {
  const key = "uno-username";
  let name = localStorage.getItem(key);
  if (!name) {
    name = generateRandomId();
    localStorage.setItem(key, name);
  }
  return name;
}

function generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
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
    body: JSON.stringify({ message, gid: "lobby", userId: username }),
  });
}
