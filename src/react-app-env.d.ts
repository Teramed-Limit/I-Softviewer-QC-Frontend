/// <reference types="react-scripts" />

import { ByteArrayParser, DataSet, explicitDataSetToJSType } from 'dicom-parser';

declare module 'dicom-parser' {
    export let a: number;
    export function explicitDataSetToJS(
        dataSet: DataSet,
        options?: { omitPrivateAttibutes: boolean; maxElementLength: number },
    ): Record<string, explicitDataSetToJSType> | Record<string, explicitDataSetToJSType[]>;
    export class ByteStream {
        constructor(byteArrayParser: ByteArrayParser, byteArray: ByteArray, position: number);
        byteArray: ByteArray;
        byteArrayParser: ByteArrayParser;
        position: number;
        warnings: string[];
        seek: (offset: number) => void;
        readByteStream: (numBytes: number) => ByteStream;
        readUint16: () => number;
        readUint32: () => number;
        readFixedString: (length: number) => string;
    }
}
