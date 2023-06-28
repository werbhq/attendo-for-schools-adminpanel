import { AttendanceMini, ClassroomAttendance } from 'types/models/attendance';

export interface AttendanceFrontEnd {
    id: AttendanceMini['id'];
    attendance: AttendanceMini;
    classroom: ClassroomAttendance['classroom'];
    semester: ClassroomAttendance['semester'];
    subject: ClassroomAttendance['subject'];
    strength: number;
}
