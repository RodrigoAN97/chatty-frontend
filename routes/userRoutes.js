import express from "express";
import { register } from "../controllers/userController.js";

export const userRoutes = express.Router();

userRoutes.post("/register", register);
