import SK from 'pages/source-keys';
import { Edit, email, required, SimpleForm, TextInput } from 'react-admin';

const AuthorizedTeacherEdit = () => (
    <Edit>
        <SimpleForm style={{ alignItems: 'stretch' }}>
            <TextInput disabled source="id" />
            <TextInput source={SK.AUTH_TEACHERS('email')} validate={[required(), email()]} />
            <TextInput source={SK.AUTH_TEACHERS('userName')} label="name" validate={required()} />
        </SimpleForm>
    </Edit>
);

export default AuthorizedTeacherEdit;
