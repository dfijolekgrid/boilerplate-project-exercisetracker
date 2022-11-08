import { Exercise } from "./IExercise";
import { User } from "./IUser";

interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}
