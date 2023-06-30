import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNotify, useRefresh, useDataProvider, useUpdate } from 'react-admin';
import { useRef } from 'react';
import { MAPPING } from 'provider/mapping';
import CSVReader from 'react-csv-reader';
import { AuthorizedTeacher } from 'types/models/teacher';
import { defaultParams } from 'provider/firebase';

const resource = MAPPING.AUTH_TEACHERS;

export const ImportButton = ({ csvExportHeaders, ...rest }: { csvExportHeaders: string[] }) => {
    const importRef = useRef<HTMLInputElement | null>(null);
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const [update] = useUpdate();
    const fileLoadHandler = async (data: AuthorizedTeacher[]) => {
        let filteredData = [];
        const record = await dataProvider.getList(resource, defaultParams).then((e) => e.data); //whole data will be read only while importing
        console.log(record);
        console.log(data);
        const invalidHeader = data.some((e) => {
            const keys = Object.keys(e).sort();
            const containsAllHeaders = csvExportHeaders.every((header) => keys.includes(header));
            return !containsAllHeaders;
        });
        if (invalidHeader) {
            const message = `Headers are invalid. Proper headers are ${csvExportHeaders.join(',')}`;
            return notify(message, { type: 'error' });
        } else {
            const dataRemoveNull = data.filter((e) => e.emailId && e.name && e.phone);

            let matchingRecord: any;
            const updatedTeachersCount = dataRemoveNull.reduce((count, e) => {
                matchingRecord = record.find(({ id }) => id === e.emailId);
                console.log(matchingRecord);
                return count + (matchingRecord ? 0 : 1);
            }, 0);
            filteredData = dataRemoveNull.filter((e) => {
                e.id = e.emailId;
                const { id } = e;

                const message = matchingRecord
                    ? 'No updation'
                    : `Updated ${updatedTeachersCount} Teachers`;
                const shouldInclude = !matchingRecord
                    ? e
                    : !record.some(({ id: recordId }) => recordId === id);
                refresh();
                notify(message, {
                    type: 'success',
                });

                return shouldInclude;
            });
        }
        filteredData.forEach((e) => {
            e.created = false;
            update(resource, { id: e.id, data: e });
        });
    };

    return (
        <Button
            size="small"
            startIcon={<UploadIcon />}
            onClick={() => {
                if (importRef.current) {
                    importRef.current.value = '';
                    importRef.current.click();
                }
            }}
        >
            <CSVReader
                parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                }}
                inputRef={(ref: HTMLInputElement) => {
                    importRef.current = ref;
                }}
                inputStyle={{ display: 'none' }}
                onFileLoaded={fileLoadHandler}
                onError={() => notify(`Error Importing CSV`, { type: 'error' })}
            />
            Import
        </Button>
    );
};
