import { DataProviderCustom } from 'types/DataProvider';
import { ClassroomAttendance } from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import { FieldPath, defaultParams } from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';
import { AttendanceFrontEnd } from 'types/frontend/attendance';

const convertAttendanceMini = (id: string, doc: ClassroomAttendance, classrooms: Classroom[]) => {
    const { classroom, attendances } = doc;
    const attendance = attendances[id];

    const students = classrooms.find((e) => e.id === classroom.id)?.students ?? {};

    const classroomStrength = Object.keys(students ?? {}).length;

    attendance.absentees = attendance.absentees.map((e) => {
        const values = [students[e].rollNo, students[e].name];
        return values.join('. ');
    });

    const absentees = attendance.absentees.length;
    const strength = classroomStrength - absentees;
    return {
        id: attendance.id,
        attendance,
        classroom,
        strength,
    };
};

/**
 * Don't call this directly
 * Use dataProvider
 */
const AttendanceProvider: DataProviderCustom<AttendanceFrontEnd> = {
    resource: MAPPING.ATTENDANCES,

    getList: async (resource, params, providers) => {
        const { dataProviderLegacy } = providers;
        const { data } = await dataProviderLegacy.getList<ClassroomAttendance>(
            resource,
            defaultParams
        );

        const { data: classrooms } = await dataProviderLegacy.getMany<Classroom>(
            MAPPING.CLASSROOMS,
            {
                ids: data.map((e) => e.classroom.id),
            }
        );

        const attendances: AttendanceFrontEnd[] = [];

        data.forEach((e) =>
            Object.values(e.attendances).forEach((attendance) =>
                attendances.push(convertAttendanceMini(attendance.id, e, classrooms))
            )
        );

        return { data: paginateSingleDoc(params, attendances), total: attendances.length };
    },

    getOne: async (resource, params, providers) => {
        const { firebaseCollection, dataProviderCustom } = providers;
        const { id } = params;

        const fieldPath = new FieldPath(`attendances`, id as string, 'id');
        const { docs } = await firebaseCollection(MAPPING.ATTENDANCES)
            .where(fieldPath, '==', id)
            .get();

        if (docs.length === 0) throw Error('Attendance does not exist');

        const e = docs[0].data() as ClassroomAttendance;
        const { data: classrooms } = await dataProviderCustom.getMany<Classroom>(
            MAPPING.CLASSROOMS,
            {
                ids: [e.classroom.id],
            }
        );

        const data = convertAttendanceMini(id, e, classrooms);
        return { data, status: 200 };
    },
};

export default AttendanceProvider;
