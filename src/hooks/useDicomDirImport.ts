import { useSetRecoilState } from 'recoil';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { loading } from '../atoms/loading';
import { atomNotification } from '../atoms/notification';
import { DicomDirectory } from '../dicom.core/media/DicomDirectory';
import { MessageType } from '../interface/notification';

export const useDicomDirImport = () => {
    const setNotification = useSetRecoilState(atomNotification);
    const setLoading = useSetRecoilState(loading);

    const importDicomDir = (e): Observable<DicomDirectory> => {
        const dicomDirectory = new DicomDirectory();

        if (!e.target.files.length) return of(dicomDirectory);

        const files = e.target.files as FileList; //選取之目標目錄內的檔案清單
        const fileLookup: Record<string, File> = {};
        Array.from(files).forEach((file) => {
            const relativePath = files[0].webkitRelativePath;
            const startFolder = relativePath.split('/')[0];
            const referencePath = file.webkitRelativePath.replace(`${startFolder}/`, '');
            fileLookup[referencePath] = file;
        });

        const dicomDirFile = fileLookup.DICOMDIR;
        if (!dicomDirFile) {
            setNotification({
                messageType: MessageType.Error,
                message: 'There is no DICOMDIR in the selected file directory',
            });
            return of(dicomDirectory);
        }

        // setLoading(true);
        return dicomDirectory.load(dicomDirFile, fileLookup).pipe(
            map(() => dicomDirectory),
            // // finalize(() => setLoading(false)),
            // watch('SwitchMap to interval(500)', 2000),
        );
    };

    return { importDicomDir };
};
