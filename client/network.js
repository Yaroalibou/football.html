import { players, createPlayer } from "./game/player.js";

const socket = io();
const room = "room1";

export function initNetwork() {
  socket.emit("joinRoom", room);

  document.addEventListener("keydown", (e) => {
    let move = { x:0, z:0 };

    if (e.key === "w") move.z -= 1;
    if (e.key === "s") move.z += 1;
    if (e.key === "a") move.x -= 1;
    if (e.key === "d") move.x += 1;

    socket.emit("move", move);
  });

  socket.on("state", (state) => {
    for (let id in state.players) {
      if (!players[id]) createPlayer(id);

      players[id].position.x += (state.players[id].x - players[id].position.x) * 0.2;
      players[id].position.z += (state.players[id].z - players[id].position.z) * 0.2;
    }
  });
}

export { socket };