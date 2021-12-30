import { ColDef } from 'ag-grid-community';
import * as R from 'ramda';

import { ImageBufferAndData } from '../interface/create-and-modify-study-params';

export const generateUUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNum(num) {
    let text = '';
    for (let i = 0; i < num; i++) text += getRandom(0, 9);
    return text;
}

function randomLetter(max) {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text.toUpperCase();
}

export function generateAccessionNum() {
    return `A${randomLetter(1)}${randomNum(8)}`;
}

export const coerceArray = (ary: string | any[]) => {
    if (Array.isArray(ary)) {
        return ary;
    }
    return [ary];
};

export const isProduction: boolean = process.env.NODE_ENV === 'production';

export const trim = (str: string) => str.replace(/^\s+|\s+$/gm, '');

export const isEmptyOrNil = (value: any) => {
    return R.isEmpty(value) || R.isNil(value);
};

export function getFileNameWithExt(event) {
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        return;
    }

    const { name } = event.target.files[0];
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    return { fileName, ext };
}

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function isASCII(str) {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(str);
}

export function escapeSpecialCharacters(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const dispatchCellEvent = (colDefs: ColDef[], fieldId: string, clickEvent: (param) => void): ColDef[] => {
    const foundColDef = colDefs.find((col) => col.field === fieldId);
    if (foundColDef === undefined) {
        return colDefs;
    }

    foundColDef.cellRendererParams.clicked = clickEvent;
    return colDefs;
};

export function dateToStr(date) {
    let d = new Date();
    if (date !== null) d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return `${year}${month}${day}`;
}

export function strToDate(dateString: string) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(+year, +month - 1, +day);
}

const pad = (v) => {
    return v < 10 ? `0${v}` : v;
};

export const getDateString = (d) => {
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());
    const sec = pad(d.getSeconds());
    // YYYYMMDDhhmmss
    return year + month + day + hour + min + sec;
    // YYYY-MM-DD hh:mm:ss
    // return year+"-"+month+"-"day+" "+hour+":"+min+":"+sec
};

export const reorder = <T>(list: Array<T>, startIndex, endIndex): Array<T> => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.slice();
};

export const getExtension = (str) => str.slice(str.lastIndexOf('.'));

export const toImageInfo = (file, type, seriesInsUid, sopClassUID, index): Promise<ImageBufferAndData> => {
    const base64Str = readBase64(file);
    return base64Str.then((result) => {
        return new Promise((resolve) => {
            resolve({
                buffer: result,
                type,
                seriesInstanceUID: seriesInsUid,
                sopInstanceUID: `${seriesInsUid}.${index + 1}`,
                sopClassUID,
                imageNumber: `${index + 1}`,
            });
        });
    });
};

export const readBase64 = (file): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
