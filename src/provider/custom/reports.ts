import { MAPPING } from '../mapping';
import { FieldPath, dataProvider, db } from '../firebase';
import { DataProviderCustom } from 'types/DataProvider';
import { Report, ReportAttendance } from 'types/frontend/report';
import { ClassroomAttendance } from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import { sortByRoll } from 'Utils/helpers';
import { developers } from 'constants/developers';

//TODO: CHECK 
type ReportMap = Omit<Report, 'attendance'> & {
    attendance: { [subjectId: string]: ReportAttendance & { absent: number } };
};

/**
 * Don't call this directly
 * Use dataProvider
 */
const ReportsProvider: DataProviderCustom<Report> = {
    resource: MAPPING.REPORTS,

    getList: async (resource, params) => {
        const { filter } = params;
        const { semester, classroomId } = filter;

        const normalAttendances = (
            await db
                .collection(MAPPING.ATTENDANCES)
                .where('semester', '==', semester)
                .where('classroom.id', '==', classroomId)
                .get()
        ).docs.map((e) => e.data() as ClassroomAttendance);

        const fieldPath = new FieldPath('classroom', 'parentClasses', classroomId, 'id');
        const virtualAttendances = (
            await db
                .collection(MAPPING.ATTENDANCES)
                .where('semester', '==', semester)
                .where(fieldPath, '==', classroomId)
                .get()
        ).docs.map((e) => e.data() as ClassroomAttendance);

        if (normalAttendances.length === 0 && virtualAttendances.length === 0) {
            return {
                data: [],
                total: 0,
                status: 200,
            };
        }

        const { data: classroom } = await dataProvider.getOne<Classroom>(MAPPING.CLASSROOMS, {
            id: classroomId,
        });

        const virtualClassIds = virtualAttendances.map((e) => e.classroom.id);

        const { data: classroomsVirtual } = await dataProvider.getMany<Classroom>(
            MAPPING.CLASSROOMS,
            { ids: virtualClassIds }
        );

        const students = new Map<string, ReportMap>(
            Object.entries(classroom.students).map(([e, v]) => {
                return [e, { ...v, attendance: {} }];
            })
        );

        [...normalAttendances, ...virtualAttendances].forEach(
            ({  attendances: e, classroom: attendanceClassroom }) => {
                const attendances = Object.values(e).filter((e) => !developers[e.teacherId]);
                const totalAttendance: number = attendances.length;

                if (totalAttendance === 0) return;

                const currentClassroom = [classroom, ...classroomsVirtual].find(
                    (e) => e.id === attendanceClassroom.id
                );

                // Initializing percentage values
                students.forEach((e, k) => {
                    if (students.get(k)?.attendance[classroom.id] && !currentClassroom?.students[k]) {
                        return;
                    }
                    const val = {
                        ...e,
                        attendance: {
                            ...e.attendance,
                            [classroom.id]: {
                                name: classroom.id.toUpperCase(),
                                // subjectId: subject.id,
                                percentage: currentClassroom?.students[k] ? 100 : -1,
                                absent: 0,
                                isVirtualClass: false,
                            },
                        },
                    };
                    students.set(k, val);
                });

                attendances.forEach(({ absentees }) => {
                    absentees?.forEach((absentee) => {
                        const student = students.get(absentee);
                        if (!student) return;

                        const absent = student.attendance[classroom.id].absent + 1;
                        const percentage = ((totalAttendance - absent) / totalAttendance) * 100;

                        students.set(absentee, {
                            ...student,
                            attendance: {
                                ...student.attendance,
                                [classroom.id]: {
                                    ...student.attendance[classroom.id],
                                    absent,
                                    percentage,
                                },
                            },
                        });
                    });
                });
            }
        );

        const attendances: Report[] = Array.from(students.values())
            .map((e) => ({
                ...e,
                attendance: Object.values(e.attendance).map(
                    ({ name, percentage,  isVirtualClass }) => ({
                        name,
                        percentage,
                        isVirtualClass,
                    })
                ),
            }))
            .sort(sortByRoll);

        return {
            data: attendances,
            total: attendances.length,
            status: 200,
        };
    },
};

export default ReportsProvider;
