import { sourceKey } from 'Utils/source-key';
import { SourceKeys } from 'types/frontend/record-keys';
import { ClassroomAttendance } from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import { StudentShort } from 'types/models/student';
import { AuthorizedTeacher } from 'types/models/teacher';

const SK = {
    ATTENDANCE: sourceKey<SourceKeys<ClassroomAttendance>>,
    AUTH_TEACHERS: sourceKey<SourceKeys<AuthorizedTeacher>>,
    CLASSROOM: sourceKey<SourceKeys<Classroom>>,
    STUDENT: sourceKey<SourceKeys<StudentShort>>,
};

export default SK;
