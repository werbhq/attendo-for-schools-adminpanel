import { AttendanceMini, ClassroomAttendance } from 'types/models/attendance';

export interface AttendanceFrontEnd {
    id: AttendanceMini['id'];
    attendance: AttendanceMini;
    classroom: ClassroomAttendance['classroom'];
    strength: number;
}
