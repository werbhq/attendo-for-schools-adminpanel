import SK from 'pages/source-keys';
import { Edit, email, required, SimpleForm, TextInput } from 'react-admin';

const AuthorizedTeacherEdit = () => (
    <Edit>
        <SimpleForm style={{ alignItems: 'stretch' }}>
            <TextInput disabled source={SK.AUTH_TEACHERS('id')} />
            <TextInput disabled source={SK.AUTH_TEACHERS('emailId')} label="Email Id" validate={[required(), email()]} />
            <TextInput source={SK.AUTH_TEACHERS('name')} label="Name" validate={required()} />
            <TextInput source={SK.AUTH_TEACHERS('phone')} label="Phone" validate={required()} />
        </SimpleForm>
    </Edit>
);

export default AuthorizedTeacherEdit;
