import path from "path";
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { User } from "./types/IUser";
import { Exercise } from "./types/IExercise";

const DB_PATH = path.join(__dirname, "test.db");
const MYDB_PATH = path.join(__dirname, "mydb.sql");

export function setupDB() {
    const db = new Database(DB_PATH);
    try {
        const initSQL = readFileSync(MYDB_PATH, "utf-8");
        db.exec(initSQL);
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}

export function insertUser(username: string): User | undefined {
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const insertUser = db.prepare(
            "INSERT INTO Users (username) VALUES (?)"
        );
        const info = insertUser.run(username);
        return {
            id: info.lastInsertRowid,
            username: username,
        };
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}

export function getUsers(): User[] | undefined {
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const selectUser = db.prepare("SELECT * from Users");
        const users = selectUser.all();
        if (users.length === 0) {
            throw new Error("No user in database");
        }
        return users;
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}

export function insertExercise(
    userId: number | BigInt,
    description: string,
    duration: number,
    date?: string
): Exercise | undefined {
    if (!date) {
        const newDate = new Date();
        date = `${newDate.getFullYear()}-${
            newDate.getMonth() + 1
        }-${newDate.getDate()}`;
    }
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const insertExercise = db.prepare(
            'INSERT INTO Exercises (userId, "description", duration, "date") VALUES (?, ? , ?, ?)'
        );
        const info = insertExercise.run(userId, description, duration, date);
        return {
            id: info.lastInsertRowid,
            userId,
            description,
            duration,
            date,
        };
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}

export function getExercises(userId: number | BigInt): Exercise[] | undefined {
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const selectExercises = db.prepare(
            "SELECT * from Exercises WHERE userId = ?"
        );
        const exercises = selectExercises.all(userId);
        return exercises;
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}
