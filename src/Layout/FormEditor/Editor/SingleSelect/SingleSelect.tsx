import React, { useEffect, useRef, useState } from 'react';

import { MenuItem, TextField } from '@mui/material';

import { useSelectOptions } from '../../../../hooks/useSelectOptions';
import { SelectField } from '../../../../interface/form-define';
import { ValidationMessage } from '../validationMapper';

interface Props {
    field: SelectField;
    value: string;
    readOnly?: boolean;
    autoFocus: boolean;
    isValid: boolean;
    onValueChanged: (value: any, fieldId: string) => void;
}

const SingleSelect = ({ field, value, autoFocus, isValid, onValueChanged, readOnly = false }: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [validationMsg] = useState(field.validation ? `- ${ValidationMessage[field.validation?.type]}` : '');
    const { menuProps, options } = useSelectOptions(field.optionSource.type, field.optionSource.source);

    const hasSetDefaultOptionsWhenFirstRender = useRef(false);

    // initDefaultOptions
    useEffect(() => {
        if (hasSetDefaultOptionsWhenFirstRender.current) return;
        if (field.defaultSelectFirstItem && options.length > 0) {
            const defaultOption = field.optionSource.key ? options[0][field.optionSource.key] : options[0];
            onValueChanged(defaultOption, field.field);
            hasSetDefaultOptionsWhenFirstRender.current = true;
        }
    }, [field, onValueChanged, options]);

    const handleChange = (event) => {
        setDirty(true);
        onValueChanged(event.target.value, field.field);
    };

    return (
        <>
            {options.length > 0 && (
                <TextField
                    disabled={readOnly}
                    autoFocus={autoFocus}
                    fullWidth
                    size="small"
                    label={`${field.label} ${validationMsg}`}
                    select
                    value={value}
                    error={!isValid && isDirty}
                    onChange={handleChange}
                    SelectProps={{ MenuProps: menuProps }}
                >
                    <MenuItem value="">
                        <em>- None -</em>
                    </MenuItem>
                    {options.map((item) => {
                        const optionLabel = field.optionSource.labelKey ? item[field.optionSource.labelKey] : item;
                        const optionKey = field.optionSource.key ? item[field.optionSource.key] : item;
                        return (
                            <MenuItem key={optionKey} value={optionKey}>
                                {optionLabel}
                            </MenuItem>
                        );
                    })}
                </TextField>
            )}
        </>
    );
};

export default React.memo(SingleSelect);
