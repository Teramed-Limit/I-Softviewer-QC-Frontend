import React, { useCallback, useEffect, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { CellClassParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Image } from 'cornerstone-core';
import dicomParser from 'dicom-parser';

import { DicomImage } from '../../interface/dicom-viewport';
import { TagData } from '../../interface/tag-dict';
import { getTag, mapUid } from '../../utils/dicom-utils';
import { escapeSpecialCharacters, isASCII } from '../../utils/general';
import classes from './DicomTag.module.scss';

const maxLength = 128;

interface Props {
    image: Image | DicomImage;
}

const columnDefs: ColDef[] = [
    { field: 'tag', headerName: 'Tag', width: 180 },
    { field: 'tagName', headerName: 'Name', width: 300 },
    { field: 'vr', headerName: 'VR', width: 100 },
    { field: 'tagValue', headerName: 'Value', flex: 1 },
];

const DicomTag = ({ image }: Props) => {
    const [tagRowData, setTagRowData] = useState<TagData[]>([]);

    const dumpDataSet = useCallback((dataSet, level) => {
        try {
            let keys: string[] = [];
            Object.keys(dataSet.elements).forEach((property) => keys.push(property));
            keys = keys.filter((key) => key !== 'xfffee00d' && key !== 'xfffee0dd');
            keys.sort();

            for (let k = 0; k < keys.length; k++) {
                const propertyName = keys[k];
                const element = dataSet.elements[propertyName];
                const tag = getTag(element.tag);

                if (element.items) {
                    setTagRowData((data) => {
                        return [
                            ...data,
                            {
                                level,
                                tag: tag.tag,
                                tagName: tag.name,
                                tagValue: '',
                                vr: tag.vr,
                                vm: tag.vm,
                                isPrivateTag: dicomParser.isPrivateTag(element.tag),
                                element,
                            },
                        ];
                    });
                    element.items.forEach((item) => {
                        dumpDataSet(item.dataSet, level + 1);
                    });
                } else {
                    // use VR to display the right value
                    let vr;
                    if (element.vr !== undefined) {
                        vr = element.vr;
                    } else {
                        vr = tag.vr;
                    }

                    let text = '';
                    if (element.length < maxLength) {
                        // Since the dataset might be encoded using implicit transfer syntax and we aren't using
                        // a data dictionary, we need some simple logic to figure out what data types these
                        // elements might be.  Since the dataset might also be explicit we could be switch on the
                        // VR and do a better job on this, perhaps we can do that in another example
                        // First we check to see if the element's length is appropriate for a UI or US VR.
                        // US is an important type because it is used for the
                        // image Rows and Columns so that is why those are assumed over other VR types.

                        if (element.vr === undefined && tag === undefined) {
                            if (element.length === 2) {
                                text = `(${dataSet.uint16(propertyName)})`;
                            } else if (element.length === 4) {
                                text = `(${dataSet.uint32(propertyName)})`;
                            }

                            // Next we ask the dataset to give us the element's data in string form.  Most elements are
                            // strings but some aren't so we do a quick check to make sure it actually has all ascii
                            // characters so we know it is reasonable to display it.
                            const str = dataSet.string(propertyName);
                            const stringIsAscii = isASCII(str);

                            if (stringIsAscii) {
                                // the string will be undefined if the element is present but has no data
                                // (i.e. attribute is of type 2 or 3 ) so we only display the string if it has
                                // data.  Note that the length of the element will be 0 to indicate "no data"
                                // so we don't put anything here for the value in that case.
                                if (str !== undefined) {
                                    text += `${escapeSpecialCharacters(str)}${mapUid(str)}`;
                                }
                            } else if (element.length !== 2 && element.length !== 4) {
                                // If it is some other length and we have no string
                                text += '<binary data>';
                            }
                        } else if (dicomParser.isStringVr(vr)) {
                            // Next we ask the dataset to give us the element's data in string form.  Most elements are
                            // strings but some aren't so we do a quick check to make sure it actually has all ascii
                            // characters so we know it is reasonable to display it.
                            const str = dataSet.string(propertyName);
                            const stringIsAscii = isASCII(str);

                            if (stringIsAscii) {
                                // the string will be undefined if the element is present but has no data
                                // (i.e. attribute is of type 2 or 3 ) so we only display the string if it has
                                // data.  Note that the length of the element will be 0 to indicate "no data"
                                // so we don't put anything here for the value in that case.
                                if (str !== undefined) {
                                    text = `${escapeSpecialCharacters(str)}${mapUid(str)}`;
                                }
                            } else if (element.length !== 2 && element.length !== 4) {
                                // If it is some other length and we have no string
                                text = '<binary data>';
                            }
                        } else if (vr === 'US') {
                            text = dataSet.uint16(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 2; i++) {
                                text += `\\${dataSet.uint16(propertyName, i)}`;
                            }
                        } else if (vr === 'SS') {
                            text = dataSet.int16(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 2; i++) {
                                text += `\\${dataSet.int16(propertyName, i)}`;
                            }
                        } else if (vr === 'UL') {
                            text = dataSet.uint32(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 4; i++) {
                                text += `\\${dataSet.uint32(propertyName, i)}`;
                            }
                        } else if (vr === 'SL') {
                            text = dataSet.int32(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 4; i++) {
                                text += `\\${dataSet.int32(propertyName, i)}`;
                            }
                        } else if (vr === 'FD') {
                            text = dataSet.double(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 8; i++) {
                                text += `\\${dataSet.double(propertyName, i)}`;
                            }
                        } else if (vr === 'FL') {
                            text = dataSet.float(propertyName);
                            for (let i = 1; i < dataSet.elements[propertyName].length / 4; i++) {
                                text += `\\${dataSet.float(propertyName, i)}`;
                            }
                        } else if (vr === 'OB' || vr === 'OW' || vr === 'UN' || vr === 'OF' || vr === 'UT') {
                            text = '<binary data>';
                        } else if (vr === 'AT') {
                            const tagGroup = dataSet.uint16(propertyName, 0);
                            const groupHexStr = `0000${tagGroup.toString(16)}`.substr(-4);
                            const tagElement = dataSet.uint16(propertyName, 1);
                            const elementHexStr = `0000${tagElement.toString(16)}`.substr(-4);
                            text += `x${groupHexStr}${elementHexStr}`;
                        } else if (vr === 'SQ') {
                            text = '';
                        } else {
                            // If it is some other length and we have no string
                            text += `no display code for VR ${vr}`;
                        }
                    } else {
                        text += '<binary data>';
                    }

                    setTagRowData((data) => {
                        return [
                            ...data,
                            {
                                level,
                                tag: tag.tag,
                                tagName: tag.name,
                                tagValue: text,
                                vr: tag.vr,
                                vm: tag.vm,
                                isPrivateTag: dicomParser.isPrivateTag(element.tag),
                                element,
                            },
                        ];
                    });
                }
            }
        } catch (err) {
            console.error({ exception: err });
        }
    }, []);

    useEffect(() => {
        if (image && 'data' in image && image?.data) {
            setTagRowData([]);
            dumpDataSet(image.data, 0);
        }
    }, [dumpDataSet, image]);

    return (
        <div className={`ag-theme-dark ${classes.gridContainer}`}>
            <AgGridReact
                defaultColDef={{
                    resizable: true,
                }}
                rowData={tagRowData}
                suppressClickEdit
                suppressCellSelection
                suppressRowClickSelection
            >
                {columnDefs.map((col) => (
                    <AgGridColumn
                        headerName={col.headerName}
                        cellStyle={(params: CellClassParams) => {
                            if (params.colDef.field === 'tag') {
                                return { paddingLeft: `${(params.data as TagData).level * 24 + 17}px` };
                            }
                            return { paddingLeft: `17px` };
                        }}
                        key={col.field}
                        field={col.field}
                        width={col.width}
                        flex={col.flex}
                        sortable
                        resizable
                    />
                ))}
            </AgGridReact>
        </div>
    );
};

export default DicomTag;
