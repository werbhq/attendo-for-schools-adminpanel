import {
    Datagrid,
    TextField,
    List,
    SearchInput,
    TextInput,
    EmailField,
    BooleanField,
    BulkDeleteButton,
    BulkUpdateButton,
    useNotify,
    BulkActionProps,
    useRefresh,
    Button,
    downloadCSV,
    TopToolbar,
    ExportButton,
    FilterButton,
    CreateButton,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import QuickFilter from 'components/ui/QuickFilter';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { ImportButton } from './components/Button';
import jsonExport from 'jsonexport/dist';
import { MAPPING } from 'provider/mapping';
import { TeacherShort } from 'types/models/teacher';
import SK from 'pages/source-keys';

const filters = [
    <SearchInput source="id" alwaysOn resettable />,
    <TextInput source="branch" resettable />,
    <QuickFilter source="created" label="Account created" defaultValue={true} />,
];

const AuthorizedTeacherList = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const csvExportHeaders = ['id', 'email', 'branch', 'userName'];
    const PostBulkActionButtons = (data: BulkActionProps) => {
        return (
            <>
                <Button
                    label="Create Account"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        AuthTeachersProviderExtended.createEmails(
                            data.selectedIds as string[]
                        ).then((e) => {
                            notify(e.message, { type: e.success ? 'success' : 'error' });
                            refresh();
                        })
                    }
                />
                <BulkUpdateButton />
                <BulkDeleteButton />
            </>
        );
    };

    const teachersExporter = (data: TeacherShort[]) => {
        const dataForExport = data;
        jsonExport(dataForExport, { headers: csvExportHeaders }, (err, csv) => {
            downloadCSV(csv, `Teachers`);
        });
    };

    const TopToolBar = () => {
        return (
            <TopToolbar>
                <CreateButton />
                <FilterButton />
                <ExportButton />
                <ImportButton csvExportHeaders={csvExportHeaders} />
            </TopToolbar>
        );
    };

    return (
        <List
            resource={MAPPING.AUTH_TEACHERS}
            exporter={teachersExporter}
            filters={filters}
            actions={<TopToolBar />}
        >
            <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons />}>
                <EmailField source={SK.AUTH_TEACHERS('emailId')} />
                <TextField source={SK.AUTH_TEACHERS('name')} label="Name" />
                <BooleanField source={SK.AUTH_TEACHERS('created')} looseValue sortable={false} />
                
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
