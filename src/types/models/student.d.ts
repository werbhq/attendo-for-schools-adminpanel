import { Classroom } from './classroom';

export interface StudentShort {
    id: string;
    name: string;
    rollNo: number;
    admNo: string;
    email?: string;
    classId?: string;
    phoneNo?: string;
    aliases?: string[];
}
