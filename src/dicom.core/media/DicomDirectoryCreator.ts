import { getTag } from '../../utils/dicom-utils';
import { lowercaseFirstLetter } from '../../utils/general';
import {
    DicomDirectoryRecord,
    DirectoryRecordNodeType,
    ExplicitDataSet,
    ImageDirectoryRecordNode,
    PatientDirectoryRecordNode,
    SeriesDirectoryRecordNode,
    SRDocDirectoryRecordNode,
    StudyDirectoryRecordNode,
} from './DicomDirectoryRecord';

export class DicomDirectoryCreator {
    factoryMapper: Record<string, (dataSet) => DicomDirectoryRecord> = {
        [DirectoryRecordNodeType.PATIENT]: (dataSet) => new PatientDirectoryRecordNode(dataSet),
        [DirectoryRecordNodeType.STUDY]: (dataSet) => new StudyDirectoryRecordNode(dataSet),
        [DirectoryRecordNodeType.SERIES]: (dataSet) => new SeriesDirectoryRecordNode(dataSet),
        [DirectoryRecordNodeType.IMAGE]: (dataSet) => new ImageDirectoryRecordNode(dataSet),
        [DirectoryRecordNodeType.SRDOCUMENT]: (dataSet) => new SRDocDirectoryRecordNode(dataSet),
    };

    createRecordInstance(explicitDataSet: ExplicitDataSet): DicomDirectoryRecord | null {
        // directoryRecordType
        const type = explicitDataSet.x00041430 as string;
        const dataset = this.switchToTagNameKey(explicitDataSet);
        const creator = this.factoryMapper[type];

        if (!creator) {
            return null;
        }
        return creator(dataset);
    }

    switchToTagNameKey = (instance: ExplicitDataSet, oriInstance = {}): ExplicitDataSet => {
        const newInstance = { ...oriInstance };
        Object.entries(instance).forEach(([k, v]) => {
            const tag = getTag(k);
            const tagName = lowercaseFirstLetter(tag.name);
            // newInstance[tagName] = { value: v, tag: k };
            newInstance[tagName] = v;

            if (tagName === 'directoryRecordSequence') {
                const directoryRecordSequence = newInstance[tagName] as [];
                newInstance[tagName] = directoryRecordSequence.map((value) => {
                    const tagElement = {};
                    return this.switchToTagNameKey(value, tagElement);
                });
            }
        });

        return newInstance;
    };
}
