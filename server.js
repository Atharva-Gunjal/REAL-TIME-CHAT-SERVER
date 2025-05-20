// TASK-2: Real-Time Chat Backend using Node.js and Socket.IO

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Store users in rooms
const chatRooms = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Join a room
  socket.on("joinRoom", ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!chatRooms[room]) {
      chatRooms[room] = [];
    }

    chatRooms[room].push({ id: socket.id, username });
    io.to(room).emit("userList", chatRooms[room]);
    socket.to(room).emit("receiveMessage", {
      user: "System",
      message: `${username} has joined the chat`
    });
  });

  // Send message to room
  socket.on("sendMessage", (message) => {
    io.to(socket.room).emit("receiveMessage", {
      user: socket.username,
      message
    });
  });

  // Leave room on disconnect
  socket.on("disconnect", () => {
    const room = socket.room;
    if (room && chatRooms[room]) {
      chatRooms[room] = chatRooms[room].filter(user => user.id !== socket.id);
      io.to(room).emit("userList", chatRooms[room]);
      socket.to(room).emit("receiveMessage", {
        user: "System",
        message: `${socket.username} has left the chat`
      });
    }
    console.log("Client disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});