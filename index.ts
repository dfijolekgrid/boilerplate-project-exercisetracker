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
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use("/api/users", usersRouter);

try {
  setupDB();
} catch (err) {
  console.error(err);
  exit;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  const adress = listener.address()!;
  if (typeof adress !== "string") {
    console.log(`Your app is listening on port ${adress.port}`);
  }
});
