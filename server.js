import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRoutes.js";
import cors from "cors";
import { messagesRouter } from "./routes/messagesRoute.js";
import { Socket } from "socket.io";

const app = express();
const server = createServer(app);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log(err.message, "error"));

// io.on("connection", (socket) => {
//   console.log("what is socket", socket);
//   console.log("Socket is active to be connected");

//   socket.on("chat", (payload) => {
//     console.log("what is payload", payload);
//     io.emit("chat", payload);
//   });
// });

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages", messagesRouter);

server.listen(process.env.PORT, () =>
  console.log(`⚡️server⚡️ is active in port ${process.env.PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-received", data.message);
    }
  });
});
