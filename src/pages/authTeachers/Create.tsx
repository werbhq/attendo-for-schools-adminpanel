import {
    Create,
    email,
    required,
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { defaultParams } from 'provider/firebase';
import SK from 'pages/source-keys';
import { AuthorizedTeacher } from 'types/models/teacher';

const url = MAPPING.AUTH_TEACHERS;

const AuthorizedTeacherCreate = () => {
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const checkUpdate = async(data: any) => {
        let isUpdate: boolean = false;
       await  dataProvider.getList(url, defaultParams).then((e) => {
            console.log(e.data);
            console.log(data);
            if (e.data.includes(data)) isUpdate = false;
            else {
                if (e.data.findIndex((f) => f.emailId === data.emailId) != -1) {
                    console.log('ho');
                    isUpdate = false;
                } else isUpdate = true;
            }
        });
        return isUpdate;
    };
    const onSubmit = async (data: any) => {
        const oldData = data;
        const isUpdate = await checkUpdate(data);
        data = { ...data, id: data.emailId, created: false };

        console.log(isUpdate);
        if (isUpdate === true) {
            await dataProvider.update<AuthorizedTeacher>(url, {
                id: data.id,
                data,
                previousData: oldData,
            });
            notify(`Added ${data.id}`, { type: 'success' });
            refresh();
            redirect('list', url);
        } else {
            notify(`${data.id} is already present`, { type: 'success' });
            refresh();
            redirect('list', url);
        }
    };

    return (
        <Create>
            <SimpleForm style={{ alignItems: 'stretch' }} onSubmit={onSubmit}>
                <TextInput source={SK.AUTH_TEACHERS('emailId')} validate={[required(), email()]} />
                <TextInput source={SK.AUTH_TEACHERS('name')} label="Name" validate={required()} />
                <TextInput source={SK.AUTH_TEACHERS('phone')} label="Phone" validate={required()} />
            </SimpleForm>
        </Create>
    );
};

export default AuthorizedTeacherCreate;
