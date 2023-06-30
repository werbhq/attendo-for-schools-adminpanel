import {
    // BooleanField,
    TextField,
    FunctionField,
    SimpleShowLayout,
    Tab,
    ReferenceArrayField,
    ChipField,
    SingleFieldList,
    useShowController,
    ReferenceField,
    useDataProvider,
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
import { useEffect, useState } from 'react';
import EditClassroom from '../components/classroom/Edit';
import { ClassroomFrontend } from 'types/frontend/classroom';
import TeacherField from '../components/classroom/CustomTeacherField';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';

const SummaryTab = ({ label, ...rest }: { label: string }) => {
    const { record } = useShowController();
    const [classroomDialog, setClassroomDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [teachersData, setTeachersData] = useState<TeacherShort[]>();
    const dataProvider = useDataProvider();

    const fetchData = () => {
        console.log(Object.values(record.teachers));
        setTeachersData(Object.values(record.teachers));
        // console.log(Object.values(record.teachers));

    };
    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Tab {...rest} label={label}>
            <SimpleShowLayout>
                <TextField source={SK.CLASSROOM('id')} />
                <TextField source={SK.CLASSROOM('std')} />
                <TextField source={SK.CLASSROOM('division')} />
                <TextField source={SK.CLASSROOM('year')} />
                <FunctionField
                    label="Students Count"
                    render={(record: Classroom) => Object.values(record.students ?? {}).length}
                />
                <FunctionField
                        label="Teachers"
                        emptyText="-"
                        render={() => (
                            <ul style={{ padding: 0, margin: 0 }}>
                                {teachersData?.length !== 0 ? (
                                    teachersData?.map((e:TeacherShort) => (
                                            <ReferenceField
                                                key={e.id}
                                                record={e}
                                                reference={MAPPING.AUTH_TEACHERS}
                                                source="id"
                                                link="show"
                                                label={e.id}
                                            >
                                                <ChipField source="name" />
                                            </ReferenceField>
                                        ))
                                ) : (
                                    <> - </>
                                )}
                            </ul>
                        )}
                    />
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
