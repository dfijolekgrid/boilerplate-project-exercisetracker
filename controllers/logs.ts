import { param, query, validationResult } from "express-validator";

import { getUser, getExercises } from "../db";

import { dateFromTimestamp } from "../utils/dateFromTimestamp";

export const get_logs_controller = [
  param("_id", "User ID must be number").toInt().isNumeric(),
  query("limit", "limit must be number > 0").optional().isInt({ min: 1 }),
  query("from", "from must be valid format of date").optional().isDate(),
  query("to", "to must be valid format of date").optional().isDate(),

  function (req: any, res: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      let exercices = getExercises(
        req.params!._id,
        req.query?.from,
        req.query?.to
      );
      const user = getUser(req.params!._id);

      const count = exercices?.length;

      exercices = req.query.limit
        ? exercices?.slice(0, req.query.limit)
        : exercices;

      const sortedExercices = exercices?.sort((a, b) =>
        a.date > b.date ? 1 : -1
      );
      const newExercices = sortedExercices?.map((element) => {
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
  },
];
