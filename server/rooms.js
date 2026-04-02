// rooms.js
const { randomUUID } = require("crypto");

const rooms = {};

// 🔹 CREATE ROOM
function createRoom() {
  const id = randomUUID();

  rooms[id] = {
    id,
    players: {},
    ball: { x: 0, z: 0 },
    score: { A: 0, B: 0 },
    time: 90,
    maxPlayers: 10,
    state: "waiting" // waiting | playing | ended
  };

  return rooms[id];
}

// 🔹 FIND OR CREATE ROOM
function findOrCreateRoom() {
  for (let id in rooms) {
    const room = rooms[id];

    if (
      room.state === "waiting" &&
      Object.keys(room.players).length < room.maxPlayers
    ) {
      return room;
    }
  }

  return createRoom();
}

// 🔹 JOIN ROOM
function joinRoom(roomId, socket) {
  const room = rooms[roomId];
  if (!room) return null;

  if (Object.keys(room.players).length >= room.maxPlayers) {
    return null;
  }

  room.players[socket.id] = {
    x: 0,
    z: 0,
    team: assignTeam(room)
  };

  socket.join(roomId);
  socket.roomId = roomId;

  return room;
}

// 🔹 LEAVE ROOM
function leaveRoom(socket) {
  const roomId = socket.roomId;
  if (!roomId || !rooms[roomId]) return;

  delete rooms[roomId].players[socket.id];

  // delete empty room
  if (Object.keys(rooms[roomId].players).length === 0) {
    delete rooms[roomId];
  }
}

// 🔹 TEAM BALANCE
function assignTeam(room) {
  const players = Object.values(room.players);

  const teamA = players.filter(p => p.team === "A").length;
  const teamB = players.filter(p => p.team === "B").length;

  return teamA <= teamB ? "A" : "B";
}

// 🔹 UPDATE PLAYER
function updatePlayer(socket, data) {
  const room = rooms[socket.roomId];
  if (!room) return;

  if (room.players[socket.id]) {
    room.players[socket.id].x = data.x;
    room.players[socket.id].z = data.z;
  }
}

// 🔹 BALL PHYSICS (SERVER SIDE)
function updateBall(room) {
  // simple follow logic (you can upgrade later)
  const players = Object.values(room.players);

  if (players.length > 0) {
    const target = players[0];

    room.ball.x += (target.x - room.ball.x) * 0.02;
    room.ball.z += (target.z - room.ball.z) * 0.02;
  }
}

// 🔹 GOAL DETECTION
function checkGoal(room) {
  if (room.ball.x < -25) {
    room.score.B++;
    resetBall(room);
  }

  if (room.ball.x > 25) {
    room.score.A++;
    resetBall(room);
  }
}

// 🔹 RESET BALL
function resetBall(room) {
  room.ball.x = 0;
  room.ball.z = 0;
}

// 🔹 MATCH TIMER
function updateTimer(room) {
  if (room.state !== "playing") return;

  room.time -= 1 / 30;

  if (room.time <= 0) {
    room.state = "ended";
  }
}

// 🔹 START MATCH
function tryStartMatch(room) {
  if (
    room.state === "waiting" &&
    Object.keys(room.players).length >= 2
  ) {
    room.state = "playing";
  }
}

// 🔹 UPDATE ROOM (MAIN LOOP)
function updateRooms() {
  for (let id in rooms) {
    const room = rooms[id];

    tryStartMatch(room);
    updateBall(room);
    checkGoal(room);
    updateTimer(room);
  }
}

// 🔹 GET STATE
function getRoomState(roomId) {
  return rooms[roomId];
}

// 🔹 EXPORT
module.exports = {
  rooms,
  createRoom,
  findOrCreateRoom,
  joinRoom,
  leaveRoom,
  updatePlayer,
  getRoomState,
  updateRooms
};
