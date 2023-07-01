import icon from '@mui/icons-material/CheckCircle';
import { MAPPING } from 'provider/mapping';
import { ResourceProps } from 'react-admin';

import AttendanceList from './List';
import AttendanceShow from './Show';

const Attendance: ResourceProps = {
    name: MAPPING.ATTENDANCES,
    icon,
    options: { label: 'Attendances' },
    list: AttendanceList,
    show: AttendanceShow,
};

export default Attendance;
