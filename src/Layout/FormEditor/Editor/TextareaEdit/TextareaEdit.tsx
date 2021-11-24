import React, { useEffect, useRef, useState } from 'react';

import { TextField } from '@mui/material';

import { Field } from '../../../../interface/form-define';

interface Props {
    field: Field;
    value: string;
    isValid: boolean;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const TextareaEdit = ({ field, value, isValid, autoFocus, readOnly = false, onValueChanged }: Props) => {
    const [isDirty, setDirty] = useState(false);
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        ref.current?.setAttribute('spellCheck', 'false');
    }, []);

    return (
        <>
            <TextField
                fullWidth
                multiline
                spellCheck={false}
                label={field.label}
                disabled={readOnly}
                placeholder="Empty"
                value={value}
                autoFocus={autoFocus}
                id={field.field}
                onChange={(e) => {
                    onValueChanged(e.target.value, field.field);
                    setDirty(true);
                }}
            />
        </>
    );
};

export default React.memo(TextareaEdit);
