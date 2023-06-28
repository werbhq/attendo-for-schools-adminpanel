
import type{ BaseClass } from './base_class';
import type { ClassroomShort } from './classroom';
import type { TeacherShort } from './teacher';

export interface AttendanceShort {
    id: string;
    date: string;
    dateTime: number;
    slot: string;
    classroom: ClassroomShort;
    teacher: TeacherShort;
}

export interface Attendance extends AttendanceShort {
    absentees: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
    leaves?: string[];
}

export interface AttendanceMini {
    id: string;
    date: string;
    dateTime: number;
    slot: string;
    teacherId: string;
    absentees: string[];
    unrecognisedNames?: string[];
    lateComers?: string[];
    leaves?: string[];
}

export interface ClassroomAttendance extends BaseClass{
    id: string;
    classroom: ClassroomShort;
    teachers: { [id: string]: TeacherShort };
    semester: number;
    attendances: { [id: string]: AttendanceMini };
}

export function ClassroomAttendanceToAttendances(data: ClassroomAttendance) {
    const { classroom, attendances, teachers } = data;

    const attendanceData: Attendance[] = [];

    Object.values(attendances).forEach((doc) => {
        const { teacherId } = doc;

        const attendanceDoc: Attendance = {
            id: doc.id,
            date: doc.date,
            dateTime: doc.dateTime,
            slot: doc.slot,
            absentees: doc.absentees ?? [],
            unrecognisedNames: doc.unrecognisedNames ?? [],
            lateComers: doc.lateComers ?? [],
            leaves: doc.leaves ?? [],
            teacher: Object.values(teachers)?.find((e) => e.id === teacherId) ?? {
                id: teacherId,
                emailId: teacherId,
                name: teacherId,
            },
            classroom,
        };

        attendanceData.push(attendanceDoc);
    });

    return attendanceData;
}

