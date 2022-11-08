import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { setupDB } from "./db";
import { usersRouter } from "./routes/users";
import { exit } from "process";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
// app.use("/api/users/:_id/logs", logsRouter);

try {
  setupDB();
} catch (err) {
  console.error(err);
  exit;
}

// try {
//     const exercice = insertExercise(1, "TEST", 5);
//     console.log(exercice);
// } catch (err: any) {
//     if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
//         console.error("username already taken");
//     } else {
//         console.error("faild to connect to database");
//     }
// }

// try {
//     const exercices = getExercises(2);
//     console.log(exercices);
// } catch (err: any) {
//     if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
//         console.error("username already taken");
//     } else {
//         console.error("faild to connect to database");
//     }
// }

const listener = app.listen(process.env.PORT || 3000, () => {
  const adress = listener.address()!;
  if (typeof adress !== "string") {
    console.log(`Your app is listening on port ${adress.port}`);
  }
});
