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
import { authProviderLegacy, defaultParams } from 'provider/firebase';
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
    const fetchPermission = async () => {
        let instituteId = '';
        try {
            const permission = await authProviderLegacy.getPermissions({});
            instituteId = permission['institute'];
        } catch (e: any) {
            notify(e.message, { type: 'error' });
        }
        return instituteId;
    };
    const onSubmit = async (props: any) => {
        const propRecord = props as Classroom;
        const instituteId = await fetchPermission();

        const common = {
            id: propRecord.std+"-"+propRecord.division+"-"+propRecord.year,
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
            instituteId: instituteId,
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
                <TextInput source={SK.CLASSROOM('std')} required  disabled/>
                <TextInput source={SK.CLASSROOM('division')} required disabled/>
                <TextInput source={SK.CLASSROOM('year')} required disabled/>
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
                .map(({ id, emailId, name }) => ({
                    id,
                    emailId: emailId,
                    name: name,
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
