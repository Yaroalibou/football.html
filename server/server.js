const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

app.use(express.static("../client"));

let rooms = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", (room) => {
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = {
        players: {},
        ball: { x: 0, z: 0 }
      };
    }

    rooms[room].players[socket.id] = { x: 0, z: 0 };

    socket.room = room;
  });

  socket.on("move", (data) => {
    const room = socket.room;
    if (rooms[room]) {
      rooms[room].players[socket.id] = data;
    }
  });

  // 🎤 WebRTC signaling
  socket.on("offer", (data) => socket.to(data.room).emit("offer", data));
  socket.on("answer", (data) => socket.to(data.room).emit("answer", data));
  socket.on("ice", (data) => socket.to(data.room).emit("ice", data));

  socket.on("disconnect", () => {
    const room = socket.room;
    if (rooms[room]) {
      delete rooms[room].players[socket.id];
    }
  });
});

// Game loop
setInterval(() => {
  for (let room in rooms) {
    io.to(room).emit("state", rooms[room]);
  }
}, 1000 / 30);

http.listen(3000, () => console.log("Server running on port 3000"));

// rooms.js
const {
  findOrCreateRoom,
  joinRoom,
  leaveRoom,
  updatePlayer,
  getRoomState,
  updateRooms,
  rooms
} = require("./rooms");

io.on("connection", (socket) => {

  socket.on("joinMatch", () => {
    const room = findOrCreateRoom();
    joinRoom(room.id, socket);

    socket.emit("joined", room.id);
  });

  socket.on("move", (data) => {
    updatePlayer(socket, data);
  });

  socket.on("disconnect", () => {
    leaveRoom(socket);
  });

});

// GAME LOOP
setInterval(() => {
  updateRooms();

  for (let roomId in rooms) {
    io.to(roomId).emit("state", getRoomState(roomId));
  }
}, 1000 / 30);
