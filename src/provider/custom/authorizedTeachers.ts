import { httpsCallable } from 'firebase/functions';
import { defaultParams, FieldPath, FieldValue } from '../firebase';
import { MAPPING } from '../mapping';
import { DataProviderCustom } from 'types/DataProvider';
import { AuthorizedTeacher } from 'types/models/teacher';
import { paginateSingleDoc } from '../helpers/pagination';
import { getFunctions } from 'firebase/functions';

/**
 * Don't call this directly
 * Use dataProvider
 */
const AuthTeachersProvider: DataProviderCustom<AuthorizedTeacher> = {
    resource: MAPPING.AUTH_TEACHERS,

    getList: async (resource, params, config) => {
        const { dataProviderCustom } = config;
        const { data } = await dataProviderCustom.getOne(MAPPING.DATA, {
            id: MAPPING.AUTH_TEACHERS,
        });
        const values = Object.values(data.teachers) as AuthorizedTeacher[];
        return { data: paginateSingleDoc(params, values), total: values.length, status: 200 };
    },

    getOne: async (resource, params, config) => {
        const { dataProviderCustom } = config;
        const { data } = await dataProviderCustom.getOne(MAPPING.DATA, {
            id: MAPPING.AUTH_TEACHERS,
        });
        return { data: data.teachers[params.id], status: 200 };
    },

    getMany: async (resource, params, config) => {
        const { dataProviderCustom } = config;
        const { ids } = params;
        const { data } = await dataProviderCustom.getList<AuthorizedTeacher>(
            resource,
            defaultParams
        );
        const finalData = data.filter((e) => ids.includes(e.id));
        return { data: finalData, status: 200 };
    },

    getManyReference: async (resource, params, config) => {
        const { ids } = params;
        const { dataProviderCustom } = config;
        const { data } = await dataProviderCustom.getList<AuthorizedTeacher>(
            resource,
            defaultParams
        );
        const finalData = data.filter((e) => ids.includes(e.id));
        return { data: finalData, status: 200 };
    },

    update: async (resource, params, config) => {
        const { id, data } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('teachers', id as string);
        await firestore.collection(MAPPING.DATA).doc(MAPPING.AUTH_TEACHERS).update(fieldPath, data);

        return { data, status: 200 };
    },

    updateMany: async (resource, params, config) => {
        const { ids, data } = params;
        const { dataProviderCustom } = config;

        await Promise.all(
            ids.map((e) => {
                return dataProviderCustom.update(resource, {
                    id: e,
                    data,
                    previousData: data,
                });
            })
        );

        return { data: ids as string[], status: 200 };
    },

    delete: async (resource, params, config) => {
        const { id } = params;
        const { firestore } = config;

        const fieldPath = new FieldPath('teachers', id);
        await firestore
            .collection(MAPPING.DATA)
            .doc(MAPPING.AUTH_TEACHERS)
            .update(fieldPath, FieldValue.delete());

        return { data: { id }, status: 200 };
    },

    deleteMany: async (resource, params, config) => {
        const { dataProviderCustom } = config;
        const { ids } = params;
        for (const id of ids) await dataProviderCustom.delete(resource, { id });
        return { data: ids, status: 200 };
    },
};

export const AuthTeachersProviderExtended = {
    //TODO: FIXME
    createEmails: async (selectedIds: string[]) => {
        const cloudFunctions = getFunctions();
        const createAccountApi = httpsCallable(cloudFunctions, 'createAccounts');
        const response = await (await createAccountApi(selectedIds)).data;
        return response as { message: string; success: boolean };
    },
};

export default AuthTeachersProvider;
