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
        const { firebaseCollection } = providers;

        const ref = firebaseCollection(MAPPING.CLASSROOMS);
        await ref
            .doc(data.id)
            .update({ ...data, 'meta.lastUpdated': FieldValue.serverTimestamp() });

        return { data: { ...data, id }, status: 200 };
    },

    create: async (resource, params, providers) => {
        const { data } = params;
        const { firebaseCollection } = providers;
        const ref = firebaseCollection(MAPPING.CLASSROOMS).doc(data.id);

        const { exists: documentExists } = await ref.get();
        if (documentExists) throw new Error(`${data.id} classroom already exists`);

        await ref.set({
            ...data,
            meta: {
                createdAt: FieldValue.serverTimestamp(),
                lastUpdated: FieldValue.serverTimestamp(),
                deleted: false,
                version: 2,
            },
        });

        return { data, status: 200 };
    },
};

export default ClassroomProvider;
