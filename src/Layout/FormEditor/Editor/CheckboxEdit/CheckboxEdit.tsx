import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Field } from '../../../../interface/form-define';

interface Props {
    field: Field;
    value: boolean;
    readOnly?: boolean;
    onValueChanged: (value: boolean, fieldId: string) => void;
}

const CheckboxEdit = ({ field, value, onValueChanged, readOnly = false }: Props) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    size="small"
                    disabled={readOnly}
                    checked={value}
                    onChange={(e) => {
                        onValueChanged(e.target.checked, field.field);
                    }}
                />
            }
            label={field.label}
        />
    );
};

export default CheckboxEdit;
