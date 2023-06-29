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
    const onSubmit = async (data: any) => {
        const oldData = data;
        let isUpdate = true;
        data = { ...data, id: data.email, created: false };
        dataProvider.getList(url, defaultParams).then((e) => {
            if (e.data.includes(data)) isUpdate = false;
            else isUpdate = true;
        });
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
                <TextInput source={SK.AUTH_TEACHERS('name')} label="Namfe" validate={required()} />
                <TextInput source={SK.AUTH_TEACHERS('phone')} label="Phone" validate={required()} />
            </SimpleForm>
        </Create>
    );
};

export default AuthorizedTeacherCreate;
