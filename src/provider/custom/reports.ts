import { MAPPING } from '../mapping';
import { FieldPath } from '../firebase';
import { DataProviderCustom } from 'types/DataProvider';
import { Report, ReportAttendance } from 'types/frontend/report';
import { ClassroomAttendance } from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import { sortByRoll } from 'Utils/helpers';
import { developers } from 'constants/developers';

type ReportMap = Omit<Report, 'attendance'> & {
    attendance: { [subjectId: string]: ReportAttendance & { absent: number } };
};

/**
 * Don't call this directly
 * Use dataProvider
 */
const ReportsProvider: DataProviderCustom<Report> = {
    resource: MAPPING.REPORTS,

    getList: async (resource, params, providers) => {
        const { filter } = params;
        const { semester, classroomId } = filter;
        const { dataProviderCustom, firebaseCollection } = providers;

        const normalAttendances = (
            await firebaseCollection(MAPPING.ATTENDANCES)
                .where('semester', '==', semester)
                .where('classroom.id', '==', classroomId)
                .get()
        ).docs.map((e) => e.data() as ClassroomAttendance);

        const fieldPath = new FieldPath('classroom', 'parentClasses', classroomId, 'id');
        const virtualAttendances = (
            await firebaseCollection(MAPPING.ATTENDANCES)
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

        const { data: classroom } = await dataProviderCustom.getOne<Classroom>(MAPPING.CLASSROOMS, {
            id: classroomId,
        });

        const virtualClassIds = virtualAttendances.map((e) => e.classroom.id);

        const { data: classroomsVirtual } = await dataProviderCustom.getMany<Classroom>(
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
                    if (students.get(k)?.attendance[classroom.id] && !currentClassroom?.students[k]) { //check
                        return;
                    }
                    const val = {
                        ...e,
                        attendance: {
                            ...e.attendance,
                            [classroom.id]: {//check
                                name: classroom.id.toUpperCase(),//check
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

                        const absent = student.attendance[classroom.id].absent + 1;//checl
                        const percentage = ((totalAttendance - absent) / totalAttendance) * 100;

                        students.set(absentee, {
                            ...student,
                            attendance: {
                                ...student.attendance,
                                [classroom.id]: {
                                    ...student.attendance[classroom.id],//check
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
                    ({ name, percentage }) => ({
                        name,
                        percentage,

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
