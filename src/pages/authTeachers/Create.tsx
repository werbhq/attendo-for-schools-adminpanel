import {
    Create,
    email,
    required,
    SimpleForm,
    TextInput,
    useNotify,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import SK from 'pages/source-keys';

const url = MAPPING.AUTH_TEACHERS;

const AuthorizedTeacherCreate = () => {
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSubmit = (data: any) => {
        data = { ...data, id: data.email, created: false };
        update(
            url,
            { id: data.id, data },
            {
                onSuccess: () => {
                    notify(`Added ${data.id}`, { type: 'success' });
                    refresh();
                    redirect('list', url);
                },
            }
        );
    };

    return (
        <Create>
            <SimpleForm style={{ alignItems: 'stretch' }} onSubmit={onSubmit}>
            <TextInput source={SK.AUTH_TEACHERS('email')} validate={[required(), email()]} />
            <TextInput source={SK.AUTH_TEACHERS('userName')} label="name" validate={required()} />                <TextInput source="branch" validate={required()} />
            </SimpleForm>
        </Create>
    );
};

export default AuthorizedTeacherCreate;
