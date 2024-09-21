
import { Movement } from './movements';

export interface WorkoutTemplate {
  _id?: string;
  name: string;
  movements: Movement[];
}
