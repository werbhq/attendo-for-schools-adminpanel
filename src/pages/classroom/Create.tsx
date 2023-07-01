import { useEffect, useState } from 'react';
import {
    Create,
    SimpleForm,
    useDataProvider,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    TextInput,
    useNotify,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { defaultParams } from 'provider/firebase';
import { Classroom } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';
import SK from 'pages/source-keys';
import useInstitute from 'provider/hook/useInstitute';

const url = MAPPING.CLASSROOMS;

const CreateClassroom = ({ teacherData }: { teacherData: TeacherShort[] }) => {
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    const instituteId = useInstitute();

    const transformSubmit = async (
        propRecord: Omit<Classroom, 'teachers'> & { teachers: string[] }
    ) => {
        const classroomId = `${propRecord.std}-${propRecord.division}-${propRecord.year}`;
        const filteredTeachers = teacherData.filter((teacher) =>
            propRecord.teachers.includes(teacher.id)
        );

        const data = {
            id: classroomId,
            students: propRecord.students ?? {},
            std: propRecord.std,
            division: propRecord.division,
            year: Number(propRecord.year),
            teachers:
                filteredTeachers.reduce((key, teacher) => {
                    return {
                        ...key,
                        [teacher.id]: teacher,
                    };
                }, {}) ?? {},
            instituteId: instituteId,
        };

        update(
            url,
            { id: data.id, data: data },
            {
                onSuccess: () => {
                    notify(`Added ${data.id}`, { type: 'success' });
                    refresh();
                    redirect('list', url);
                },
            }
        );

        return data;
    };

    return (
        <Create transform={transformSubmit}>
            <SimpleForm style={{ alignItems: 'stretch' }}>
                <TextInput source={SK.CLASSROOM('std')} required />
                <TextInput source={SK.CLASSROOM('division')} required />
                <TextInput source={SK.CLASSROOM('year')} required />
                <ReferenceArrayInput
                    source={SK.CLASSROOM('teachers')}
                    reference={MAPPING.AUTH_TEACHERS}
                    filter={{ created: true }}
                >
                    <AutocompleteArrayInput
                        optionText={SK.AUTH_TEACHERS('name')}
                        source={SK.AUTH_TEACHERS('name')}
                        filterToQuery={(searchText) => ({ userName: searchText })}
                    />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
};

const ClassroomsCreate = () => {
    const dataProvider = useDataProvider();
    const [teachers, setTeachers] = useState<TeacherShort[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        dataProvider.getList<AuthorizedTeacher>(MAPPING.AUTH_TEACHERS, defaultParams).then((e) => {
            const teacherData = e.data
                .filter((e) => e.created)
                .map(({ id, emailId, name, phone }) => ({
                    id,
                    emailId: emailId,
                    name: name,
                    phone: phone,
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

    return <>{loading ? <></> : <CreateClassroom teacherData={teachers} />}</>;
};

export default ClassroomsCreate;
