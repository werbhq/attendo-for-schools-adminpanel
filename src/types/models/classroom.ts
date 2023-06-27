import type { BaseClass } from './base_class';
import type { StudentShort } from './student';

export interface ClassroomShort extends BaseClass {
    id: string;
    std: string;
    division: string;
    year: number;
}

export interface Classroom extends ClassroomShort {
    students: { [id: string]: StudentShort };
}
