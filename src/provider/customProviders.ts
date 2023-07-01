import ClassroomProvider from './custom/classroom';
import StudentsProvider from './custom/students';
import AuthTeachersProvider from './custom/authorizedTeachers';
import ReportsProvider from './custom/reports';
import { DataProviderCustom } from '../types/DataProvider';
import AttendanceProvider from './custom/attendance';

// ADD YOUR PROVIDERS HERE
const CustomProviders: DataProviderCustom<any>[] = [
    ClassroomProvider,
    StudentsProvider,
    AuthTeachersProvider,
    ReportsProvider,
    AttendanceProvider,
];

export default CustomProviders;
