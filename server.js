import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRoutes.js";
import cors from "cors";
import { messagesRouter } from "./routes/messagesRoute.js";

const app = express();
const server = createServer(app);
dotenv.config();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

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
