import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNotify, useDataProvider, useUpdate } from 'react-admin';
import { useRef } from 'react';
import { MAPPING } from 'provider/mapping';
import CSVReader from 'react-csv-reader';
import { AuthorizedTeacher } from 'types/models/teacher';

const resource = MAPPING.AUTH_TEACHERS;

export const ImportButton = ({ csvExportHeaders, ...rest }: { csvExportHeaders: string[] }) => {
    const importRef = useRef<HTMLInputElement | null>(null);
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const [update] = useUpdate<AuthorizedTeacher>();

    const fileLoadHandler = async (data: AuthorizedTeacher[]) => {
        const invalidEmails: string[] = [];

        const validateData = (e: AuthorizedTeacher) => {
            invalidEmails.push(e.emailId);
            if (!(e.emailId && e.name)) return false;
            if (
                typeof e.emailId !== 'string' ||
                typeof e.name !== 'string' ||
                (typeof e.phone !== 'string' &&
                    typeof e.phone !== 'number' &&
                    typeof e.phone !== 'undefined')
            ) {
                return false;
            }

            invalidEmails.pop();
            return true;
        };

        const invalidHeader = data.some((e) => {
            const keys = Object.keys(e).sort();
            const containsAllHeaders = csvExportHeaders.every((header) => keys.includes(header));
            return !containsAllHeaders;
        });

        const dataInvalid = !data.every((e) => validateData(e));

        if (invalidHeader) {
            notify(`Headers are invalid. Proper headers are ${csvExportHeaders.join(',')}`, {
                type: 'error',
            });
        }

        if (dataInvalid) {
            notify(
                `The emailId, name should be provided. Please check emails: ${invalidEmails.filter(
                    (e) => e !== undefined
                )}`,
                { type: 'error' }
            );
        }

        if (invalidHeader || dataInvalid) return;

        data.forEach((item) => {
            item.emailId = item.emailId.toString();
            item.name = item.name.toString();
            item.phone = item.phone ? item.phone.toString() : '';
        });

        const alreadyExistingTeachers = (
            await dataProvider.getMany<AuthorizedTeacher>(resource, {
                ids: data.map((e) => e.emailId),
            })
        ).data.map((e) => e.emailId);

        const filteredData = data.filter((e) => !alreadyExistingTeachers.includes(e.emailId));

        await Promise.all(
            filteredData.map((e) => update(resource, { id: e.id, data: { ...e, created: false } }))
        );

        notify(
            [
                `Ignored ${alreadyExistingTeachers.length} Already Existing Teachers`,
                `Added ${filteredData.length} Teachers`,
            ].join('. '),
            {
                type: 'success',
            }
        );
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
