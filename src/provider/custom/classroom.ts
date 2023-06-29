import { DataProviderCustom } from 'types/DataProvider';
import { Classroom } from 'types/models/classroom';
import { FieldValue } from '../firebase';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const ClassroomProvider: DataProviderCustom<Classroom> = {
    resource: MAPPING.CLASSROOMS,

    update: async (resource, params, providers) => {
        const { id, data } = params;
        const { dataProviderCustom, firebaseCollection } = providers;

        delete data.teachers;

        const ref = firebaseCollection(MAPPING.CLASSROOMS);
        const promises = [
            ref.doc(data.id).update({ ...data, 'meta.lastUpdated': FieldValue.serverTimestamp() }),
        ];

        await Promise.all(promises);

        return { data: { ...data, id }, status: 200 };
    },

    create: async (resource, params, providers) => {
        const { data } = params;
        const { dataProviderCustom, firebaseCollection } = providers;
        console.log(data);
        const { exists: documentExists } = await firebaseCollection(MAPPING.CLASSROOMS)
            .doc(data.id)
            .get();

        if (documentExists) throw new Error(`${data.id} classroom already exists`);

        const ref = firebaseCollection(MAPPING.CLASSROOMS);
        const promises = [
            ref.doc(data.id).set({
                ...data,
                meta: {
                    createdAt: FieldValue.serverTimestamp(),
                    lastUpdated: FieldValue.serverTimestamp(),
                    deleted: false,
                    version: 2,
                },
            }),
        ];

        await Promise.all(promises);

        return { data, status: 200 };
    },
};

export default ClassroomProvider;
