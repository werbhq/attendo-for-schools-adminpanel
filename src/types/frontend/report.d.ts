import { StudentShort } from 'types/models/student';

export interface ReportAttendance {
    name: string;
    // subjectId: string;
    percentage: number;
}

export interface Report extends StudentShort {
    attendance: ReportAttendance[];
}
