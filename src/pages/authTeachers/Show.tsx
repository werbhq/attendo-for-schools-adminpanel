import {
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useNotify,
    useRefresh,
    WithRecord,
} from 'react-admin';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { AuthorizedTeacher } from 'types/models/teacher';
import SK from 'pages/source-keys';
import { authProviderLegacy } from 'provider/firebase';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [loading, setLoading] = useState(false);

    // TODO: Display teacher classroom display
    // const { record } = useShowController();
    // const authorizedTeacher = record as AuthorizedTeacher;
    // const [classroomData, setClassroomData] = useState<TeacherClassroom[]>([]);
    // const [subjectData, setSubjectData] = useState<Subject[]>([]);
    // const dataProvider = useDataProvider();

    // const fetchData = () => {
    //     if (authorizedTeacher) {
    //         dataProvider
    //             .getOne<Teacher>(MAPPING.TEACHERS, { id: authorizedTeacher?.id })
    //             .then((e) => {
    //                 setClassroomData(Object.values(e.data.classrooms));
    //                 setSubjectData(Object.values(e.data.classrooms).map((f) => f.subject));
    //             }).catch(()=>{
    //                 console.error("Data not found in teachers");

    //             });
    //     }
    // };

    // useEffect(() => {
    //     setLoading(true);
    //     setLoading(false);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleCreation = async (record: AuthorizedTeacher) => {
        setLoading(true);
        try {
            const permission = await authProviderLegacy.getPermissions({});
            const { message, success } = await AuthTeachersProviderExtended.createAccounts(
                [record.id],
                permission['institute']
            );
            notify(message, { type: success ? 'success' : 'error' });
        } catch (e: any) {
            notify(e.message, { type: 'error' });
        }
        setLoading(false);
        refresh();
    };

    return loading ? (
        <></>
    ) : (
        <Show>
            <SimpleShowLayout>
                <TextField source={SK.AUTH_TEACHERS('emailId')} />
                <TextField source={SK.AUTH_TEACHERS('name')} label="Name" />
                <TextField source={SK.AUTH_TEACHERS('phone')} label="Phone Number" />
                <BooleanField source={SK.AUTH_TEACHERS('created')} looseValue />
                <WithRecord
                    render={(record: AuthorizedTeacher) =>
                        !record?.created ? (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                loading={loading}
                                onClick={() => handleCreation(record)}
                            >
                                Create Account
                            </LoadingButton>
                        ) : (
                            <></>
                        )
                    }
                />
            </SimpleShowLayout>
        </Show>
    );
};

export default AuthorizedTeacherShow;
