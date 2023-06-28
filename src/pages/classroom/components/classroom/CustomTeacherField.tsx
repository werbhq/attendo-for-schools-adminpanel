import { Chip } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Classroom } from 'types/models/classroom';
import { TeacherShort } from 'types/models/teacher';

 const TeacherField = () => {
    const record = useRecordContext() as Classroom;
    if (!record?.teachers) return null;
     return (
        
        <ul style={{ padding: 0, margin: 0 }}>
            {Object.values(record.teachers).map((teacher: TeacherShort) => (
                <Chip key={teacher.id} sx={{ ml: 0.5, mt: 1 }} label={teacher.name} />
            ))}
        </ul>
     );
 };

 export default TeacherField;
