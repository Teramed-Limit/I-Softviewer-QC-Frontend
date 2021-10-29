import React, { useState } from 'react';

import { TextField } from '@mui/material';

import { FormDef } from '../../interface/form-define';
import classes from './FormEditor.module.scss';

interface Props {
    formDef: FormDef;
    header?: string;
}

const FormEditor = ({ formDef, header = '' }: Props) => {
    const [sectionCount] = useState(formDef.sections.length);

    return (
        <div>
            {header === '' ? null : <h2>{header}</h2>}
            <div className={classes.container}>
                {formDef.sections.map((section, index) => {
                    return (
                        <div
                            key={index.toString()}
                            style={{ flex: `${100 / sectionCount}%` }}
                            className={classes.section}
                        >
                            {section.fields.map((field) => {
                                return (
                                    <TextField
                                        key={field.field}
                                        className={classes.field}
                                        label={field.label}
                                        id={field.field}
                                        defaultValue="Small"
                                        size="small"
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormEditor;
