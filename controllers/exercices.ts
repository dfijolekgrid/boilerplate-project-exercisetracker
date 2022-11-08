import { param, body, validationResult } from "express-validator";

import { insertExercise } from "../db";

import { dateFromTimestamp } from "../utils/dateFromTimestamp";

export const post_exercie_controller = [
  param("_id", "User ID must be number").toInt().isNumeric(),
  body("duration", "Duration must be number > 0").isInt({ min: 1 }),
  body("description", "Descritpion must not be empty string")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("date", "Date must be valid format of date").optional().isDate(),

  function (req: any, res: any) {
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
  },
];
