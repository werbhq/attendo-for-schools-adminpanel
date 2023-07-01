import { Button, Stack } from '@mui/material';
import {
    Datagrid,
    EmailField,
    ListContextProvider,
    NumberField,
    Tab,
    downloadCSV,
    useList,
    TextField,
    useRecordContext,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import jsonExport from 'jsonexport/dist';
import { useState } from 'react';
import { StudentShort as Student } from 'types/models/student';
import { MAPPING } from 'provider/mapping';
import EditStudent from '../components/student/Edit';
import {
    CustomStudentBulkDeleteButton,
    CustomStudentEditButton,
    ImportButton,
} from '../components/student/Buttons';
import { sortByRoll } from 'Utils/helpers';
import SK from 'pages/source-keys';
import { ClassroomFrontend } from 'types/frontend/classroom';

const resource = MAPPING.STUDENTS;

type studentDialog = {
    enable: boolean;
    add: boolean;
    record: Student | undefined;
};

const StudentTab = ({ label, path, ...props }: { label: string; path: string; props?: any }) => {
    const record: ClassroomFrontend = useRecordContext();

    const csvExportHeaders = ['id', 'email', 'rollNo', 'name', 'admnNo', 'phoneNo'];

    const classroomStudents = record.students
        ? Object.values(record.students).sort(sortByRoll)
        : [];

    const [studentDialog, setStudentDialog] = useState<studentDialog>({
        enable: false,
        add: false,
        record: undefined,
    });

    const [listData, setListData] = useState<Student[]>(classroomStudents.sort(sortByRoll));

    const sort = { field: '', order: '' };
    const listContext = useList({
        data: listData,
        resource,
        sort: sort,
    });

    return (
        <Tab label={label} path={path} {...props}>
            <Stack
                spacing={'10px'}
                sx={{ margin: '20px 0px' }}
                justifyContent="space-between"
                direction="row"
            >
                <Stack spacing="10px" direction="row">
                    <Button
                        size="medium"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setStudentDialog({
                                ...studentDialog,
                                add: true,
                                enable: true,
                                record: undefined,
                            });
                        }}
                    >
                        Add Student
                    </Button>
                </Stack>

                <Stack spacing="10px" direction="row">
                    <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                            jsonExport(listData, { headers: csvExportHeaders }, (err, csv) => {
                                downloadCSV(csv, `${record.id}`);
                            });
                        }}
                    >
                        Export
                    </Button>
                    <ImportButton
                        setListData={setListData}
                        csvExportHeaders={csvExportHeaders.filter((e) => e !== 'id')}
                    />
                </Stack>
            </Stack>

            <ListContextProvider value={listContext}>
                <Datagrid
                    sx={{ paddingTop: '30px' }}
                    bulkActionButtons={<CustomStudentBulkDeleteButton setList={setListData} />}
                >
                    <NumberField source={SK.STUDENT('rollNo')} />
                    <TextField source={SK.STUDENT('admnNo')} />
                    <TextField source={SK.STUDENT('name')} />
                    <EmailField source={SK.STUDENT('email')} emptyText="-" />
                    <TextField source={SK.STUDENT('phoneNo')} emptyText="-" />

                    <CustomStudentEditButton
                        state={{
                            dialog: studentDialog,
                            setDialog: setStudentDialog,
                        }}
                    />
                </Datagrid>
            </ListContextProvider>

            {/* Popup */}
            {studentDialog.enable && (
                <EditStudent
                    state={{
                        dialog: studentDialog,
                        setDialog: setStudentDialog,
                    }}
                />
            )}
        </Tab>
    );
};

export default StudentTab;
