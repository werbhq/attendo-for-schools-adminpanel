import { BaseClass } from './base_class';
import type { StudentShort } from './student';
import { TeacherShort } from './teacher';

export interface ClassroomShort extends BaseClass {
    id: string;
    std: string;
    division: string;
    year: number;
}

export interface Classroom extends ClassroomShort {
    instituteId: string;
    students: { [id: string]: StudentShort };
    teachers: { [id: string]: TeacherShort };
}

export function ClassroomToClassroomShort(data: Classroom) {
    const classroomShort: ClassroomShort = {
        id: data.id,
        std: data.std,
        division: data.division,
        year: data.year,
    };

    return classroomShort;
}
export interface ClassroomIndex {
    classrooms: {
        [id: string]: Classroom;
    };
}
