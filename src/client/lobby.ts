const username = generateRandomId();

export interface GameStateDB {
  game_id: string;
  state: string;
  turn: number;
  turn_increment: number;
  num_players: number;
  top_card_id: null | string;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".join-game");
  if (!container) return;

  try {
    const res = await fetch("/api/game/open-games");
    const resJson = await res.json();
    console.log(resJson);

    if ((resJson as GameStateDB[]).length === 0) {
      container.innerHTML = "<p>No open games available right now.</p>";
      return;
    }

    for (let game of resJson as GameStateDB[]) {
      const card = document.createElement("div");
      card.classList.add("game-card");

      card.innerHTML = `
        <div class="game-info">
          <p><strong>Game ID:</strong> ${game.game_id}</p>
          <p><strong>Players:</strong> ${game.num_players}</p>
          <p><strong>State:</strong> ${game.state}</p>
          <p><strong>Turn:</strong> ${game.turn}</p>
        </div>
        <button class="join-button" data-game-id="${game.game_id}">Join Game</button>
      `;

      container.appendChild(card);

      // add the user current games
    }
  } catch (err) {
    alert("Failed to load open games.");
    console.error(err);
  }

  container.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("join-button")) {
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

document.querySelector(".start-btn")!.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/game/new-game", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
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
