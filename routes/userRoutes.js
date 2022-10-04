import express from "express";
import {
  login,
  register,
  setAvatar,
  getAllUsers,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/set-avatar/:id", setAvatar);
userRouter.get("/all-users/:id", getAllUsers);
