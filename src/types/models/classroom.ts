import type { BaseClass } from './base_class';
import type { StudentShort } from './student';
import { TeacherShort } from './teacher';

export interface ClassroomShort extends BaseClass {
    id: string;
    std: string;
    division: string;
    year: number;
    teachers: { [id: string]: TeacherShort };
}

export interface Classroom extends ClassroomShort {
    students: { [id: string]: StudentShort };
}
export function ClassroomToClassroomShort(data: Classroom) {
    const teachersObject: { [id: string]: TeacherShort } = {};
    for (const key in data.teachers) {
        teachersObject[key] = data.teachers[key];
    }
    const classroomShort: ClassroomShort = {
        id: data.id,
        std: data.std,
        division: data.division,
        year: data.year,
        teachers: teachersObject,
    };

    return classroomShort;
}
