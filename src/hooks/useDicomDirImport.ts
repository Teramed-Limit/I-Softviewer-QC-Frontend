import { useSetRecoilState } from 'recoil';
import { EMPTY, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../api/axios';
import { atomNotification } from '../atoms/notification';
import { RootRecord } from '../interface/dicom-directory-record';
import { MessageType } from '../interface/notification';

export const useDicomDirImport = () => {
    const setNotification = useSetRecoilState(atomNotification);

    const parseDicomDir = (e): Observable<{ dicomDirectoryRecord: RootRecord; fileLookup: Record<string, File> }> => {
        if (!e.target.files.length) return EMPTY;

        const files = e.target.files as FileList; //選取之目標目錄內的檔案清單
        const fileLookup: Record<string, File> = {};
        Array.from(files).forEach((file) => {
            const relativePath = files[0].webkitRelativePath;
            const startFolder = relativePath.split('/')[0];
            const referencePath = file.webkitRelativePath
                .replace(`${startFolder}/`, '')
                .replace(new RegExp('/', 'g'), '\\');
            fileLookup[referencePath] = file;
        });

        const dicomDirFile = fileLookup.DICOMDIR;
        if (!dicomDirFile) {
            setNotification({
                messageType: MessageType.Error,
                message: 'There is no DICOMDIR in the selected file directory',
            });
            return EMPTY;
        }

        const formData = new FormData();
        formData.append('dicomDirFile', dicomDirFile);
        return http.post<RootRecord>('dicomDir/parseDicomDir', formData).pipe(
            take(1),
            map((res) => ({
                dicomDirectoryRecord: res.data,
                fileLookup,
            })),
        );
    };

    return { parseDicomDir };
};
