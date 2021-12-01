import { RefObject } from 'react';

import { ColDef } from 'ag-grid-community';
import * as R from 'ramda';

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

export const getRefElement = <T>(element?: RefObject<Element> | T): Element | T | undefined | null => {
    if (element && 'current' in element) {
        return element.current;
    }

    return element;
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

export const dispatchCellEvent = (colDefs: ColDef[], fieldId: string, event: (param) => void): ColDef[] => {
    const foundColDef = colDefs.find((col) => col.field === fieldId);
    if (foundColDef === undefined) {
        return colDefs;
    }

    foundColDef.cellRendererParams.clicked = event;
    return colDefs;
};

export function dateToStr(date) {
    const d = new Date(date);
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
