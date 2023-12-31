import { Classroom } from '../types/models/classroom';
import { StudentShort as Student } from '../types/models/student';

export const sortByRoll = (a: Student, b: Student) => {
    if (a.classId && b.classId) {
        if (a.classId !== b.classId) return a.classId.localeCompare(b.classId);
    }
    return a.rollNo - b.rollNo;
};

export const autoCapitalize = (value: string) => value && value.toUpperCase();

export const titleCase = (value: string) => {
    return value
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const convertSingleValueListToSelectList = (value: string) => {
    return { id: value, name: value.toUpperCase() };
};

export const getClassroomId = (data: Classroom) => {
    const dataIdSet = [data.std, data.division, data.year];
    return dataIdSet.join('-').toUpperCase();
};

export const MODE = {
    PROD: 'prod',
    DEV: 'dev',
    EMULATOR: 'emulate',
};

export const validateName = (value: string) => {
    const regex = /\d/;
    if (value && value.includes('.')) return 'Name must not contain a dot';
    if (value && regex.test(value)) return 'Value must not contain a number';
    if (value && Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (regex.test(value[i])) {
                return 'Value must not contain a number';
            }
        }
    }
};
