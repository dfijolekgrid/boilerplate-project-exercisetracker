PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY ASC,
    username TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS Exercises (
    id INTEGER PRIMARY KEY ASC,
    userId INTEGER,
    "description" TEXT,
    duration INTEGER,
    "date" TEXT,
    FOREIGN KEY (userId) REFERENCES Users(id)
);