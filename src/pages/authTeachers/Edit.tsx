import SK from 'pages/source-keys';
import { Edit, email, required, SimpleForm, TextInput } from 'react-admin';

const AuthorizedTeacherEdit = () => (
    <Edit>
        <SimpleForm style={{ alignItems: 'stretch' }}>
            <TextInput disabled source={SK.AUTH_TEACHERS('id')} />
            {/* <TextInput source="email" validate={required()} />
            <TextInput source="userName" label="name" validate={required()} /> */}
            <TextInput source={SK.AUTH_TEACHERS('emailId')} validate={[required(), email()]} />
            <TextInput source={SK.AUTH_TEACHERS('name')} label="name" validate={required()} />
        </SimpleForm>
    </Edit>
);

export default AuthorizedTeacherEdit;
