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

export function getUser(userId: number): User | undefined {
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const selectUser = db.prepare("SELECT * from Users WHERE id = ?");
        const user = selectUser.get(userId);
        if (!user) {
            throw new Error("No user in database");
        }
        return user;
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
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(1, 0, 0, 0);
    const timestamp = newDate.getTime().toString();
    const db = new Database(DB_PATH, { fileMustExist: true });
    try {
        const insertExercise = db.prepare(
            'INSERT INTO Exercises (userId, "description", duration, "date") VALUES (?, ? , ?, ?)'
        );
        const info = insertExercise.run(
            userId,
            description,
            duration,
            timestamp
        );
        return {
            id: info.lastInsertRowid,
            userId,
            description,
            duration,
            date: timestamp,
        };
    } catch (err: any) {
        throw err;
    } finally {
        db.close();
    }
}

export function getExercises(
    userId: number | BigInt,
    from?: string,
    to?: string
): Exercise[] | undefined {
    const db = new Database(DB_PATH, { fileMustExist: true });

    const fromDate = from ? new Date(from) : undefined;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    const fromTimestamp = fromDate ? fromDate.getTime() : undefined;
    const toTimestamp = to ? new Date(to).getTime() : undefined;
    try {
        let queryString = "SELECT * from Exercises WHERE userId = ?";
        let exercises = [];
        if (from && to) {
            queryString += " AND date >= ? AND date <= ?";
            const selectExercises = db.prepare(queryString);
            exercises = selectExercises.all(userId, fromTimestamp, toTimestamp);
        } else if (from !== undefined) {
            queryString += " AND date >= ?";
            const selectExercises = db.prepare(queryString);
            exercises = selectExercises.all(userId, fromTimestamp);
        } else if (to) {
            queryString += " AND date <= ?";
            const selectExercises = db.prepare(queryString);
            exercises = selectExercises.all(userId, toTimestamp);
        } else {
            const selectExercises = db.prepare(queryString);
            exercises = selectExercises.all(userId);
        }
        return exercises;
    } catch (err) {
        throw err;
    } finally {
        db.close();
    }
}
