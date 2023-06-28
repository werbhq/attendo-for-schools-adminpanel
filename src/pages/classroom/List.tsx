import {
    Datagrid,
    BooleanField,
    TextField,
    List,
    FunctionField,
    ReferenceField,
    SearchInput,
    TextInput,
    NumberField,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { Schemes } from 'Utils/Schemes';
import { Classroom } from 'types/models/classroom';
import QuickFilter from 'components/ui/QuickFilter';
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
                <NumberField source={SK.CLASSROOM('year')} />
            </Datagrid>
        </List>
    );
};

export default ClassroomsList;
