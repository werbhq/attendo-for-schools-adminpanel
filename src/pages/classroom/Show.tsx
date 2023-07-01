import { Show, TabbedShowLayout, useShowController, RecordContextProvider } from 'react-admin';
import { Classroom } from 'types/models/classroom';
import StudentTab from './tab/StudentTab';
import SummaryTab from './tab/SummaryTab';

export const ClassroomShow = () => {
    const { record, isLoading } = useShowController<Classroom>();
    if (isLoading) return <></>;

    return (
        <Show>
            <RecordContextProvider value={record}>
                <TabbedShowLayout>
                    <SummaryTab label="summary" />
                    <StudentTab label="students" path="students" />
                    {/* TODO: ADD REPORT TAB */}
                </TabbedShowLayout>
            </RecordContextProvider>
        </Show>
    );
};

export default ClassroomShow;
