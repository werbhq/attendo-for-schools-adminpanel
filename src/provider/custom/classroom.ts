import { DataProviderCustom } from 'types/DataProvider';
import {
    Classroom,

} from 'types/models/classroom';
import {  db } from '../firebase';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const ClassroomProvider: DataProviderCustom<Classroom> = {
    resource: MAPPING.CLASSROOMS,

    update: async (resource, params) => {
        const { id, data } = params;


            delete data.teachers;
         
        

        const ref = db.collection(MAPPING.CLASSROOMS);
        const promises = [ref.doc(data.id).update({ ...data })];

        await Promise.all(promises);

        return { data: { ...data, id }, status: 200 };
    },

    create: async (resource, params) => {
        const { data } = params;

        const { exists: documentExists } = await db
            .collection(MAPPING.CLASSROOMS)
            .doc(data.id)
            .get();

        if (documentExists) throw new Error(`${data.id} classroom already exists`);

        

        const ref = db.collection(MAPPING.CLASSROOMS);
        const promises = [ref.doc(data.id).set(data)];

        await Promise.all(promises);

        return { data, status: 200 };
    },
};

export default ClassroomProvider;
