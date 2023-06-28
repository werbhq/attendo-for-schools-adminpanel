import { useEffect, useState } from 'react';
import {
    SimpleForm,
    useDataProvider,
    useRecordContext,
    useNotify,
    useRefresh,
    Toolbar,
    SaveButton,
    DeleteButton,
    TextInput,
    useUpdate,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { defaultParams } from 'provider/firebase';
import { Classroom } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import SK from 'pages/source-keys';
import { Dialog } from '@mui/material';
const url = MAPPING.CLASSROOMS;

type Props = {
    dialog: boolean;
    setDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditClassroom = ({ teacherData, state }: { teacherData: TeacherShort[]; state: Props }) => {
    const record: Classroom & { parentClasses: string[] } = useRecordContext();
    const dataProvider = useDataProvider();
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();

    const validateClassroom = (values: any) => {
        const errors: { [index: string]: string } = {};
        const id = (e: { id: string }) => e.id;

        return errors;
    };

    const onSubmit = async (props: any) => {
        const propRecord = props as Classroom;

        const common = {
            id: propRecord.id,
            std: propRecord.std,
            division: propRecord.division,
            year: propRecord.year,
            teachers: teacherData.reduce((key, teacher) => {
                return {
                    ...key,
                    [teacher.id]: teacher,
                };
            }, {}),
            students: propRecord.students,
        };

        let finalData: Classroom;

        const classroomData: Classroom = {
            ...common,
        };
        finalData = classroomData;

        await dataProvider.update<Classroom>(MAPPING.CLASSROOMS, {
            id: finalData.id,
            data: finalData,
            previousData: record,
        });
        update(
            url,
            { id: finalData.id, data: finalData },
            {
                onSuccess: () => {
                    refresh();
                    notify(`Edited ${finalData.id}`, { type: 'success' });
                    state.setDialog(false);
                },
            }
        );

        refresh();
        notify(`Edited ${finalData.id}`, { type: 'success' });
        state.setDialog(false);
    };

    return (
        <Dialog open={state.dialog} onClose={() => state.setDialog(false)} fullWidth={true}>
            <SimpleForm
                style={{ alignItems: 'stretch' }}
                validate={validateClassroom}
                onSubmit={onSubmit}
                record={record}
                toolbar={
                    <Toolbar sx={{ justifyContent: 'space-between', display: 'flex' }}>
                        <SaveButton alwaysEnable />
                        <DeleteButton />
                    </Toolbar>
                }
            >
                <TextInput source={SK.CLASSROOM('std')} required />
                <TextInput source={SK.CLASSROOM('division')} required />
                <TextInput source={SK.CLASSROOM('year')} required />
            </SimpleForm>
        </Dialog>
    );
};

const ClassroomsEdit = ({ state }: { state: Props }) => {
    const dataProvider = useDataProvider();
    const [teachers, setTeachers] = useState<TeacherShort[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        dataProvider.getList<AuthorizedTeacher>(MAPPING.AUTH_TEACHERS, defaultParams).then((e) => {
            const teacherData = e.data
                .filter((e) => e.created)
                .map(({ id, email, userName }) => ({
                    id,
                    emailId: email,
                    name: userName,
                }));
            setTeachers(teacherData);
        });
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{loading ? <></> : <EditClassroom teacherData={teachers} state={state} />}</>;
};

export default ClassroomsEdit;
