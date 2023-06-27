import { sourceKey } from 'Utils/source-key';
import { SourceKeys } from 'types/frontend/record-keys';
import { ClassroomAttendance } from 'types/models/attendance';
// import { Batch } from 'types/models/batch';
import { Classroom } from 'types/models/classroom';
// import { Course } from 'types/models/courses';
import { StudentShort } from 'types/models/student';
// import { Subject } from 'types/models/subject';
import { Teacher } from 'types/models/teacher';

const SK = {
    ATTENDANCE: sourceKey<SourceKeys<ClassroomAttendance>>,
    AUTH_TEACHERS: sourceKey<SourceKeys<Teacher>>,
    // BATCHES: sourceKey<SourceKeys<Batch>>,
    CLASSROOM: sourceKey<SourceKeys<Classroom>>,
    // SUBJECT: sourceKey<SourceKeys<Subject>>,
    // COURSE: sourceKey<SourceKeys<Course>>,
    STUDENT: sourceKey<SourceKeys<StudentShort>>,
};

export default SK;
