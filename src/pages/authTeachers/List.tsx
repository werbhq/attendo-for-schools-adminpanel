import {
    Datagrid,
    TextField,
    List,
    SearchInput,
    EmailField,
    BooleanField,
    useNotify,
    BulkActionProps,
    useRefresh,
    Button,
    downloadCSV,
    TopToolbar,
    ExportButton,
    FilterButton,
    CreateButton,
    BulkDeleteWithConfirmButton,
    BooleanInput,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { ImportButton } from './components/Button';
import jsonExport from 'jsonexport/dist';
import { MAPPING } from 'provider/mapping';
import { AuthorizedTeacher } from 'types/models/teacher';
import SK from 'pages/source-keys';
import useInstitute from 'provider/hook/useInstitute';

const filters = [
    <SearchInput source={SK.AUTH_TEACHERS('id')} alwaysOn resettable />,
    <BooleanInput source={SK.AUTH_TEACHERS('created')} />,
];

const AuthorizedTeacherList = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const csvHeaders = ['name', 'emailId', 'phone'];
    const instituteId = useInstitute();

    const PostBulkActionButtons = (data: BulkActionProps) => {
        return (
            <>
                <Button
                    label="Create Account"
                    startIcon={<AddIcon />}
                    onClick={async () => {
                        AuthTeachersProviderExtended.createAccounts(
                            data.selectedIds as string[],
                            instituteId
                        ).then((e) => {
                            notify(e.message, { type: e.success ? 'success' : 'error' });
                            refresh();
                        });
                    }}
                />
                <BulkDeleteWithConfirmButton mutationMode="optimistic" />
            </>
        );
    };

    const teachersExporter = (data: AuthorizedTeacher[]) => {
        const dataForExport = data;
        const dataForExportWithoutCreated = dataForExport.map(({ created, ...rest }) => rest); // created parameter wont be presented
        csvHeaders.unshift('id');
        const csvExportHeaders = csvHeaders;
        jsonExport(dataForExportWithoutCreated, { headers: csvExportHeaders }, (err, csv) => {
            downloadCSV(csv, `Teachers`);
        });
    };

    const TopToolBar = () => {
        return (
            <TopToolbar>
                <CreateButton />
                <FilterButton />
                <ExportButton />
                <ImportButton csvExportHeaders={csvHeaders} />
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
                <EmailField source={SK.AUTH_TEACHERS('emailId')} label="Email Id" />
                <TextField source={SK.AUTH_TEACHERS('name')} label="Name" />
                <BooleanField source={SK.AUTH_TEACHERS('created')} sortable={false} />
                <TextField source={SK.AUTH_TEACHERS('phone')} label="Phone Number" />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
