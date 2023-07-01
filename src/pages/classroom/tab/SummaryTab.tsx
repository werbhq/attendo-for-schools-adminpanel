import {
    TextField,
    FunctionField,
    SimpleShowLayout,
    Tab,
    ChipField,
    useShowController,
    ReferenceField,
} from 'react-admin';
import { Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { MAPPING } from 'provider/mapping';
import { Classroom } from 'types/models/classroom';
import SK from 'pages/source-keys';
import { useEffect, useState } from 'react';
import EditClassroom from '../components/classroom/Edit';
import { TeacherShort } from 'types/models/teacher';

const SummaryTab = ({ label, ...rest }: { label: string }) => {
    const { record, isLoading } = useShowController();
    const [classroomDialog, setClassroomDialog] = useState<boolean>(false);
    const [teachersData, setTeachersData] = useState<TeacherShort[]>([]);

    useEffect(() => {
        if (!isLoading) setTeachersData(Object.values(record.teachers));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    if (isLoading) return <></>;

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
                            {teachersData.length !== 0 ? (
                                teachersData?.map((e: TeacherShort) => (
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
