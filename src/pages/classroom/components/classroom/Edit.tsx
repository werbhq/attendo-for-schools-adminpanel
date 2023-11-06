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
    AutocompleteArrayInput,
    ReferenceArrayInput,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { defaultParams } from 'provider/firebase';
import { Classroom } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import SK from 'pages/source-keys';
import { Dialog } from '@mui/material';

type Props = {
    dialog: boolean;
    setDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditClassroomModal = ({
    teacherData,
    state,
}: {
    teacherData: TeacherShort[];
    state: Props;
}) => {
    const record: Classroom = useRecordContext();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();
    const notify = useNotify();

    const onSubmit = async (props: any) => {
        const propRecord = props as Classroom;

        const filteredTeachers = teacherData
            .filter((teacher) => props.teachers.includes(teacher.id))
            .reduce(
                (key, teacher) => ({
                    ...key,
                    [teacher.id]: teacher,
                }),
                {}
            );

        const newTeachers = { ...record.teachers, ...filteredTeachers };
        const updatedData = {
            ...record,
            id: `${propRecord.std}-${propRecord.division}-${propRecord.year}`,
            teachers: newTeachers,
        };

        await dataProvider.update<Classroom>(MAPPING.CLASSROOMS, {
            id: updatedData.id,
            data: updatedData,
            previousData: record,
        });

        refresh();
        notify(`Edited ${updatedData.id}`, { type: 'success' });
        state.setDialog(false);
    };

    const convertTeacherObject = (recordData: Classroom) => {
        return {
            ...recordData,
            teachers: Object.keys(recordData.teachers),
        } as Omit<Classroom, 'teachers'> & { teachers: string[] };
    };

    return (
        <Dialog open={state.dialog} onClose={() => state.setDialog(false)} fullWidth={true}>
            <SimpleForm
                style={{ alignItems: 'stretch' }}
                onSubmit={onSubmit}
                record={convertTeacherObject(record)}
                toolbar={
                    <Toolbar sx={{ justifyContent: 'space-between', display: 'flex' }}>
                        <SaveButton alwaysEnable />
                        <DeleteButton />
                    </Toolbar>
                }
            >
                <TextInput source={SK.CLASSROOM('std')} required disabled />
                <TextInput source={SK.CLASSROOM('division')} required disabled />
                <TextInput source={SK.CLASSROOM('year')} required disabled />
                <ReferenceArrayInput
                    source={SK.CLASSROOM('teachers')}
                    reference={MAPPING.AUTH_TEACHERS}
                    filter={{ created: true }}
                >
                    <AutocompleteArrayInput
                        optionText={SK.AUTH_TEACHERS('name')}
                        source={SK.AUTH_TEACHERS('name')}
                        filterToQuery={(searchText) => ({ name: searchText })}
                    />
                </ReferenceArrayInput>
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

    return <>{loading ? <></> : <EditClassroomModal teacherData={teachers} state={state} />}</>;
};

export default ClassroomsEdit;
