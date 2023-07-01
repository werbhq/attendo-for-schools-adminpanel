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
import useInstitute from 'provider/hook/useInstitute';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [loading, setLoading] = useState(false);
    const instituteId = useInstitute();

    const handleCreation = async (record: AuthorizedTeacher) => {
        setLoading(true);
        try {
            const { message, success } = await AuthTeachersProviderExtended.createAccounts(
                [record.id],
                instituteId
            );
            notify(message, { type: success ? 'success' : 'error' });
        } catch (e: any) {
            notify(e.message, { type: 'error' });
        }
        setLoading(false);
        refresh();
    };

    return (
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
