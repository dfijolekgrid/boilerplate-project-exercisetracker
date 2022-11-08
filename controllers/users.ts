import { body, validationResult } from "express-validator";

import { getUsers, insertUser } from "../db";

export const get_users_controller = [
  function (req: any, res: any) {
    try {
      const user = getUsers();
      res.status(200).json(user);
    } catch (err: any) {
      if (err.message === "No user in database") {
        res.status(404).json({
          error: { message: "No data in database" },
        });
      } else {
        res.status(503).json({
          error: { message: "Database unavailable" },
        });
      }
    }
  },
];

export const post_user_controller = [
  body("username").trim().isLength({ min: 1 }).escape(),
  function (req: any, res: any) {
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
  },
];
