import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("what is socket", socket);
  console.log("Socket is active to be connected");

  socket.on("chat", (payload) => {
    console.log("what is payload", payload);
    io.emit("chat", payload);
  });
});

server.listen(8000, () => console.log("⚡️server⚡️ is active in port 8000"));
