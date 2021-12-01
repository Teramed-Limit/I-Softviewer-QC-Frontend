import React, { useState } from 'react';

import { TextField } from '@mui/material';

import { Field } from '../../../../interface/form-define';
import { ValidationMessage } from '../validationMapper';

interface Props {
    field: Field;
    value: string;
    isValid: boolean;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const TextEdit = ({ field, value, isValid, autoFocus, readOnly = false, onValueChanged }: Props) => {
    const [isDirty, setDirty] = useState(false);
    const [validationMsg] = useState(field.validation ? `- ${ValidationMessage[field.validation?.type]}` : '');

    return (
        <TextField
            fullWidth
            autoFocus={autoFocus}
            disabled={readOnly}
            label={`${field.label} ${validationMsg}`}
            id={field.field}
            value={value}
            onChange={(e) => {
                onValueChanged(e.target.value, field.field);
                setDirty(true);
            }}
            error={!isValid && isDirty}
            size="small"
        />
    );
};

export default React.memo(TextEdit);
