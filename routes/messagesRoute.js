import {
  addMessage,
  getAllMessages,
} from "../controllers/messagesController.js";
import express from "express";

export const messagesRouter = express.Router();

messagesRouter.post("add-message", addMessage);
messagesRouter.post("get-messages", getAllMessages);
