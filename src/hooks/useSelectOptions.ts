import React, { useEffect } from 'react';

import { MenuProps } from '@mui/material';
import { concatMap, Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../api/axios';
import { Option } from '../interface/options';
import { StaticOptionMapper } from '../services/StaticOptionService';

export interface OptionRetriever {
    retrieve: (source) => Observable<any[]>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps: Partial<MenuProps> = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    transitionDuration: 0,
};

const OptionRetrieverMapper: { [props: string]: OptionRetriever } = {
    http: {
        retrieve: (source) => http.get(source).pipe(map((res) => res.data)),
    },
    // static should integrate into database
    static: {
        retrieve: (source) => of(StaticOptionMapper[source]),
    },
    dbStatic: {
        retrieve: (source) => http.get(`options/type/${source}`).pipe(map((res) => res.data)),
    },
};

export const useSelectOptions = (type: string, source: string) => {
    const [options, setOptions] = React.useState<any[]>([]);

    useEffect(() => {
        const optionRetriever = OptionRetrieverMapper[type];
        const subscription = optionRetriever.retrieve(source).subscribe({
            next: setOptions,
        });
        return () => subscription.unsubscribe();
    }, [source, type]);

    // update for table "StaticOptions"
    const addOption = (addedOption: Option): Observable<Option[]> => {
        return http.post(`options`, addedOption).pipe(
            concatMap(() => http.get(`options/type/${source}`)),
            map((res) => res.data),
            tap((data) => setOptions(data)),
        );
    };

    // delete for table "StaticOptions"
    const deleteOption = (id: string): Observable<Option[]> => {
        return http.delete(`options/id/${id}`).pipe(
            concatMap(() => http.get(`options/type/${source}`)),
            map((res) => res.data),
            tap((data) => setOptions(data)),
        );
    };

    return { options, addOption, deleteOption, menuProps };
};
