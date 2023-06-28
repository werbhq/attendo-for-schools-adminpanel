import {
    EmailField,
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useNotify,
    useRefresh,
    WithRecord,
    useShowController,
    FunctionField,
    ReferenceField,
    ChipField,
    useDataProvider,
} from 'react-admin';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import { AuthorizedTeacher, Teacher } from 'types/models/teacher';
import SK from 'pages/source-keys';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const { record } = useShowController();
    const authorizedTeacher = record as AuthorizedTeacher;
    const [loading, setLoading] = useState(false);

    const dataProvider = useDataProvider();

    // const fetchData = () => {
    //     if (authorizedTeacher) {
    //         dataProvider
    //             .getOne<Teacher>(MAPPING.TEACHERS, { id: authorizedTeacher?.id })
    //             .then((e) => {
    //                 setClassroomData(Object.values(e.data.classrooms));
    //                 setSubjectData(Object.values(e.data.classrooms).map((f) => f.subject));
    //             });
    //     }
    // };

    useEffect(() => {
        setLoading(true);
        // fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleCreation = async (record: AuthorizedTeacher) => {
        setLoading(true);
        try {
            const { message, success } = await AuthTeachersProviderExtended.createEmails([
                record.id,
            ]);
            notify(message, { type: success ? 'success' : 'error' });
        } catch (e: any) {
            notify(e.message, { type: 'error' });
        }
        setLoading(true);
        refresh();
    };

    return loading ? (
        <></>
    ) : (
        <Show>
            <SimpleShowLayout>
            <TextField source={SK.AUTH_TEACHERS('email')}  />
                <EmailField source={SK.AUTH_TEACHERS('email')} />
                <TextField source={SK.AUTH_TEACHERS('userName')} label="Name" />
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
