import type { Movement } from './movements';

export interface Workout {
    workoutId: string;
    userId: string;
    workoutTemplateId: string;
    date: string;
    name: string;
    movements: Movement[];
    }
