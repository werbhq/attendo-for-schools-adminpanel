import {
    EmailField,
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
import { Teacher } from 'types/models/teacher';
import SK from 'pages/source-keys';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [loading, setLoading] = useState(false);

    const handleCreation = async (record: Teacher) => {
        setLoading(true);
        try {
            const { message, success } = await AuthTeachersProviderExtended.createEmails([
                record.id,
            ]);
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
                <TextField source={SK.AUTH_TEACHERS('id')} />
                <EmailField source={SK.AUTH_TEACHERS('emailId')} />
                <TextField source={SK.AUTH_TEACHERS('name')} label="Name" />
                <WithRecord
                    render={(record: Teacher) =>
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
