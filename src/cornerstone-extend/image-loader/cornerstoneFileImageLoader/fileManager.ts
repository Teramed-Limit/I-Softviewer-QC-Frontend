import { generateUUID } from '../../../utils/general';

let files: Blob[] = [];

function init() {
    files = [];
}

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

function setFile(file: File | undefined, index: number) {
    files.push(file as Blob);
    return `imagefile:${index}_${generateUUID()}`;
}

function get(index) {
    return files[index];
}

export default {
    init,
    setSelectedFiles,
    setFile,
    get,
};
