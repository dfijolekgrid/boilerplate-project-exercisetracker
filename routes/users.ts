import express from "express";
import { body, validationResult } from "express-validator";

import { getUsers, insertUser } from "../db";

export const usersRouter = express.Router();

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
    body("username").isLength({ min: 1 }),
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
                res.status(400).json({
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
