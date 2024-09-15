
import { Movement } from './movements';

export interface WorkoutTemplate {
  id?: string;
  name: string;
  movements: Movement[];
}
