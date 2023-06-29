import {
    // BooleanField,
    TextField,
    FunctionField,
    SimpleShowLayout,
    Tab,
    ReferenceArrayField,
    ChipField,
    SingleFieldList,
    useRecordContext,
    ReferenceField,
    // ArrayField,
    // Datagrid,
    // SelectField,
    // ReferenceField,
} from 'react-admin';
import { Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// import { Schemes } from 'Utils/Schemes';
import { MAPPING } from 'provider/mapping';
import { Classroom } from 'types/models/classroom';
import SK from 'pages/source-keys';
import EmptySingleDisplay from 'components/ui/EmptySingleField';
import { useState } from 'react';
import EditClassroom from '../components/classroom/Edit';
import { ClassroomFrontend } from 'types/frontend/classroom';
import TeacherField from '../components/classroom/CustomTeacherField';

const SummaryTab = ({ label, ...rest }: { label: string }) => {
    const [classroomDialog, setClassroomDialog] = useState<boolean>(false);

    return (
        <Tab {...rest} label={label}>
            <SimpleShowLayout>
                <TextField source={SK.CLASSROOM('id')} />
                <TextField source={SK.CLASSROOM('std')} />
                <TextField source={SK.CLASSROOM('division')} />
                <TextField source={SK.CLASSROOM('year')} />
                <FunctionField
                    label="Students Count"
                    render={(record: Classroom) => Object.values(record?.students).length}
                />
                <ReferenceArrayField
                    label="Teachers"
                    source={SK.AUTH_TEACHERS('id')}
                    reference={MAPPING.AUTH_TEACHERS}
                    resource={MAPPING.AUTH_TEACHERS}
                    sx={{ margin: '10px 0px' }}
                >
                    <TeacherField></TeacherField>
                </ReferenceArrayField>
            </SimpleShowLayout>

            <div style={{ margin: '20px 0px' }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setClassroomDialog((e) => !e)}
                    >
                        Edit
                    </Button>
                </Stack>
            </div>
            {/* Popup */}
            {classroomDialog && (
                <EditClassroom
                    state={{
                        dialog: classroomDialog,
                        setDialog: setClassroomDialog,
                    }}
                />
            )}
        </Tab>
    );
};

export default SummaryTab;
