import express from "express";
import { param, body, validationResult } from "express-validator";

import {
  getUsers,
  getUser,
  insertUser,
  insertExercise,
  getExercises,
} from "../db";

export const usersRouter = express.Router();

const dateFromTimestamp = (date: string) => {
  const newDate = new Date(Number.parseInt(date));
  return `${newDate.getFullYear()}-${
    newDate.getMonth() + 1
  }-${newDate.getDate()}`;
};

usersRouter.get("/", function (req, res) {
  try {
    const user = getUsers();
    res.status(200).json(user);
  } catch (err: any) {
    if (err.message === "No user in database") {
      res.status(404).json({
        error: { message: "No data in database" },
      });
    } else {
      console.error("faild to connect to database");
    }
  }
});

usersRouter.post(
  "/",
  body("username").trim().isLength({ min: 1 }).escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const users = insertUser(req.body.username);
      res.status(200).json(users);
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        res.status(404).json({
          error: { message: "Username already taken" },
        });
      } else {
        res.status(503).json({
          message: "DB not avalibale",
        });
      }
    }
  }
);

usersRouter.post(
  "/:_id/exercises",
  param("_id", "User ID must be number").toInt().isNumeric(),
  body("duration", "Duration must be number > 0").isInt({ min: 1 }),
  body("description", "Descritpion must not be empty string")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("date", "Date must be valid format of date").optional().isDate(),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const { duration, description } = req.body;
    const userId = req.params!._id;
    try {
      let exercice = insertExercise(
        userId,
        description,
        duration,
        req.body.date
      );

      exercice!.date = dateFromTimestamp(exercice!.date);
      res.status(200).json(exercice);
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        res.status(404).json({
          error: { message: "Username with this id dosen't exist" },
        });
      }
      res.status(503).json({
        message: "DB not avalibale",
      });
    }
  }
);

usersRouter.get(
  "/:_id/logs",
  param("_id", "User ID must be number").toInt().isNumeric(),
  body("limit", "limit must be number > 0").optional().isInt({ min: 1 }),
  body("from", "from must be valid format of date").optional().isDate(),
  body("to", "to must be valid format of date").optional().isDate(),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      let exercices = getExercises(
        req.params!._id,
        req.body?.from,
        req.body?.to
      );
      const user = getUser(req.params!._id);

      const count = exercices?.length;

      exercices = req.body.limit
        ? exercices?.slice(0, req.body.limit)
        : exercices;
      const newExercices = exercices?.map((element) => {
        const date = dateFromTimestamp(element!.date);
        return {
          id: element.id,
          date,
          description: element.description,
          duration: element.duration,
        };
      });

      const resObject = {
        id: user?.id,
        username: user?.username,
        logs: newExercices,
        count,
      };
      res.status(200).json(resObject);
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        res.status(404).json({
          error: { message: "Username with this id dosen't exist" },
        });
      }
      if (err.message === "No user in database") {
        res.status(400).json({
          error: { message: "User with this id don't exist" },
        });
      } else {
        res.status(503).json({
          message: "DB not avalibale",
        });
      }
    }
  }
);
