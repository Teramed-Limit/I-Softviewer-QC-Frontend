import React from 'react';

import { MenuItem, MenuProps, TextField } from '@mui/material';

import { useSelectOptions } from '../../../../hooks/useSelectOptions';
import { SelectField } from '../../../../interface/form-define';

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

interface Props {
    field: SelectField;
    value: string;
    readOnly?: boolean;
    autoFocus: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const SingleSelect = ({ field, value, autoFocus, onValueChanged, readOnly = false }: Props) => {
    const { options } = useSelectOptions(
        field.optionSource.type,
        field.optionSource.source,
        field.optionSource.labelKey,
    );

    const handleChange = (event) => {
        onValueChanged(event.target.value, field.field);
    };

    return (
        <TextField
            disabled={readOnly}
            autoFocus={autoFocus}
            fullWidth
            size="small"
            label={field.label}
            select
            value={value}
            onChange={handleChange}
            SelectProps={{ MenuProps: menuProps }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {options.map((item) => {
                const optionLabel = field.optionSource.labelKey ? item[field.optionSource.labelKey] : item;
                const optionKey = field.optionSource.key ? item[field.optionSource.key] : item;
                return (
                    <MenuItem key={optionKey} value={item}>
                        {optionLabel}
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

export default SingleSelect;
