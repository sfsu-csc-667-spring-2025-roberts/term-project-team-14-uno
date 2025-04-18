console.log("hello world");
const userId = generateRandomId();
document.querySelector(".start")!.addEventListener("click", async () => {
  const res = await fetch("/api/game/join", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const resJson = await res.json();
  if (!resJson.success) {
    console.log("error");
  }
  window.location.href = `/game?gid=${resJson.gid}&pid=${userId}`;
});
// replace with cookie/auth system
function generateRandomId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
