import { RefObject } from 'react';

import * as R from 'ramda';

export const generateUUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

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
    return /^[\x00-\x7F]*$/.test(str);
}

export function escapeSpecialCharacters(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
