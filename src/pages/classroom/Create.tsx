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
import { getClassroomId } from 'Utils/helpers';
// import { Schemes } from 'Utils/Schemes';
// import { Subject, SubjectDoc } from 'types/models/subject';
import { defaultParams } from 'provider/firebase';
import { Classroom } from 'types/models/classroom';
import { AuthorizedTeacher, TeacherShort } from 'types/models/teacher';

import SK from 'pages/source-keys';
// import GroupLink from './components/classroom/GroupLink';

// const CURRENT_CLASS_ID = 'This Classroom';
const url = MAPPING.CLASSROOMS;

const CreateClassroom = ({
    // schemes: schemeData,
    // batchData,
    teacherData,
}: {
    // schemes: SubjectDoc[];
    // batchData: Batch[];
    teacherData: TeacherShort[];
}) => {
    const [update] = useUpdate();
    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    // const { getBranches, getSemesters, getSubjects, isDerived } = new Schemes(schemeData);
    // const [data, setData] = useState<{
    //     scheme: null | string;
    //     branch: null | string;
    //     name: null | string;
    //     group: null | string;
    //     semester: null | number;
    //     batchId: null | string;
    // }>({
    //     scheme: null,
    //     branch: null,
    //     name: null,
    //     group: null,
    //     semester: null,
    //     batchId: null,
    // });

    const validateClassroom = (values: any) => {
        const errors: { [index: string]: string } = {};
        const id = (e: { id: string }) => e.id;

        return errors;
    };

    const transformSubmit = (props: any) => {
        const record = props as Classroom;
        const classroomId = getClassroomId(record);

        const common = {
            id: classroomId,
            students: record.students,
            std: record.std,
            division: record.division,
            year: record.year,
            teachers: teacherData.reduce((key, teacher) => {
                return {
                    ...key,
                    [teacher.id]: teacher,
                };
            }, {}),
        };

        let finalData: Classroom;

        // if (!isDerived(record.name)) {
        const classroomData: Classroom = {
            ...common,
        };
        finalData = classroomData;

        update(
            url,
            { id: finalData.id, data: finalData },
            {
                onSuccess: () => {
                    notify(`Added ${finalData.id}`, { type: 'success' });
                    refresh();
                    redirect('list', url);
                },
            }
        );

        return finalData;
    };

    return (
        <Create transform={transformSubmit}>
            <SimpleForm style={{ alignItems: 'stretch' }} validate={validateClassroom}>
                <TextInput source={SK.CLASSROOM('std')} required />
                <TextInput source={SK.CLASSROOM('division')} required />
                <TextInput source={SK.CLASSROOM('year')} required />

                {/* {isDerived(data.name) && (
                    <> */}
                {/* <SelectInput
                            source={SK.CLASSROOM('semester')}
                            choices={getSemesters(data.scheme)}
                            onChange={(e) => setData({ ...data, semester: e.target.value })}
                            required
                        />

                        <SelectInput
                            source={SK.CLASSROOM('subjectId')}
                            choices={
                                data.semester
                                    ? getSubjects(data.scheme, data.branch, data.semester)
                                    : []
                            }
                            disabled={
                                getSubjects(data.scheme, data.branch, data.semester).length === 0
                                    ? true
                                    : false
                            }
                            onChange={(e) =>
                                setGroupDependency((v) => ({ ...v, subjectId: e.target.value }))
                            }
                            required
                        />

                        <ReferenceArrayInput
                            source={SK.CLASSROOM('parentClasses')}
                            reference={MAPPING.CLASSROOMS}
                            filter={{
                                isDerived: false,
                                branch: data.branch,
                                batch: batchData.find((e) => e.id === data.batchId),
                            }}
                        >
                            <AutocompleteArrayInput
                                optionText="id"
                                source={SK.CLASSROOM('id')}
                                filterToQuery={(searchText) => ({ id: searchText })}
                                onChange={(e) =>
                                    setGroupDependency((v) => ({
                                        ...v,
                                        parentClasses: e,
                                    }))
                                }
                                isRequired
                            />
                        </ReferenceArrayInput>

                        <GroupLink
                            subjectId={groupDependency.subjectId}
                            parentClasses={groupDependency.parentClasses}
                            data={data}
                            currentClassIdAlias={CURRENT_CLASS_ID}
                        /> */}

                <ReferenceArrayInput
                    source={SK.CLASSROOM('teachers')}
                    reference={MAPPING.AUTH_TEACHERS}
                    filter={{ created: true }}
                >
                    <AutocompleteArrayInput
                        optionText={SK.AUTH_TEACHERS('userName')}
                        source={SK.AUTH_TEACHERS('userName')}
                        filterToQuery={(searchText) => ({ userName: searchText })}
                    />
                </ReferenceArrayInput>
                {/* </> */}
                {/* )} */}
            </SimpleForm>
        </Create>
    );
};

const ClassroomsCreate = () => {
    const dataProvider = useDataProvider();
    const [teachers, setTeachers] = useState<TeacherShort[]>([]);
    //     const [batchData, setBatchData] = useState<Batch[]>([]);
    //     const [schemeData, setData] = useState<SubjectDoc[]>([]);
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
        // dataProvider.getList<Batch>(MAPPING.BATCHES, defaultParams).then((e) => {
        //     setBatchData(e.data);
        // });

        // dataProvider
        //     .getList<SubjectDoc>(MAPPING.SUBJECT, defaultParams)
        //     .then((e) => setData(e.data));
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
