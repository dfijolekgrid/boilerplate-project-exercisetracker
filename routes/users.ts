import express from "express";

import {
  get_users_controller,
  post_user_controller,
} from "../controllers/users";
import { post_exercie_controller } from "../controllers/exercices";
import { get_logs_controller } from "../controllers/logs";

export const usersRouter = express.Router();

// Get users array from database
usersRouter.get("/", get_users_controller);

// Post new user to database
usersRouter.post("/", post_user_controller);

// Post new exercise to database
usersRouter.post("/:_id/exercises", post_exercie_controller);

// Get logs of user from database
usersRouter.get("/:_id/logs", get_logs_controller);
