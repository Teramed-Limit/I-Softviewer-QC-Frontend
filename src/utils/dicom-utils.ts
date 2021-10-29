import { TAG_DICT } from '../constant/dicom-tag-dict';
import { DICOM_UID } from '../constant/dicom-uid';
import { TagElement } from '../interface/tag-dict';

export function mapUid(str) {
    const uid = DICOM_UID[str];
    if (uid) {
        return ` [ ${uid} ]`;
    }
    return '';
}

export function getTag(tag): TagElement {
    const group = tag.substring(1, 5);
    const element = tag.substring(5, 9);
    const tagIndex = `(${group},${element})`.toUpperCase();
    return TAG_DICT[tagIndex];
}
