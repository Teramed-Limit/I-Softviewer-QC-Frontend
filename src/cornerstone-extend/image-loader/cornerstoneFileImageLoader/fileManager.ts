import { generateUUID } from '../../../utils/general';

let files: Blob[] = [];

function setSelectedFiles(selectFiles: FileList) {
    files = [];
    const imageIds: string[] = [];
    for (let i = 0; i < selectFiles.length; i++) {
        const file = selectFiles.item(i);
        files.push(file as Blob);
        imageIds.push(`imagefile:${i}_${generateUUID()}`);
    }
    return imageIds;
}

function get(index) {
    return files[index];
}

export default {
    setSelectedFiles,
    get,
};
