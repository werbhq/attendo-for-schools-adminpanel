import { Classroom } from './classroom';

export interface StudentShort {
    id: string;
    name: string;
    rollNo: number;
    admnNo: string;
    email?: string;
    classId?: string;
    phoneNo?: string;
    aliases?: string[];
}
