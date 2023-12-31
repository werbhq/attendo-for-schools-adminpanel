import { Datagrid, TextField, List, FunctionField, SearchInput, TextInput } from 'react-admin';
import { Classroom } from 'types/models/classroom';
import SK from 'pages/source-keys';

const filters = [
    <SearchInput source={SK.CLASSROOM('id')} placeholder="Enter Id" alwaysOn resettable />,
    <TextInput source={SK.CLASSROOM('std')} resettable />,
    <TextInput source={SK.CLASSROOM('division')} resettable />,
    <TextInput source={SK.CLASSROOM('year')} resettable />,
];

const ClassroomsList = () => {
    return (
        <List exporter={false} filters={filters} emptyWhileLoading>
            <Datagrid rowClick="show">
                <TextField source={SK.CLASSROOM('id')} />
                <TextField source={SK.CLASSROOM('std')} />
                <TextField source={SK.CLASSROOM('division')} />
                <TextField source={SK.CLASSROOM('year')} />
                <FunctionField
                    label="Students Count"
                    render={(record: Classroom) => Object.values(record?.students).length}
                />
            </Datagrid>
        </List>
    );
};

export default ClassroomsList;
