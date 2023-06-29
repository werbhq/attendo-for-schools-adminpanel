import type { ClassroomShort } from './classroom';
import type { Subject } from './subject';

export interface TeacherShort {
    id: string;
    name: string;
    emailId: string;
    profilePic?: string;
}

export interface Teacher extends TeacherShort {
    userName?: string;
    status: string;
    phone?: string;
    classrooms: {
        [id: string]: ClassroomShort;
    };
}

export interface AuthorizedTeacher {
    id: string;
    emailId: string;
    name: string;
    created: boolean;
    phone: string;
}

export interface AuthorizedTeacherIndex {
    instituteId: string;
    teachers: {
        [email: string]: AuthorizedTeacher;
    };
}

export interface TeachersIndex {
    teachers: {
        [key: string]: TeacherShort;
    };
}
