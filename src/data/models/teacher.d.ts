import { ClassroomShort, ClassroomShortTeacher } from './classroom';

export interface Teacher {
    id: string;
    emailId: string;
    name: string;
    userName: string;
    status: string;
    phone?: number;
    profilePic?: string;
    classrooms: TeacherClassroom[];
}

export interface AuthorizedTeacher {
    teachers: {
        [email: string]: {
            id: string;
            email: string;
            userName: string;
            branch: string;
        };
    };
}

export interface TeacherClassroom {
    gclassroomId: string;
    meetLookup?: string;
    periods?: {
        day: DAY;
        hour: number;
        lastUpdate: string;
        weight: number;
    }[];
    classroom: ClassroomShortTeacher;
    subject: {
        id: string;
        name: string;
        code?: string;
    };
    recognised?: boolean;
}

export interface TeacherShort {
    id: string;
    name: string;
    emailId: string;
    profilePic: string;
}

declare enum DAY {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7,
}
