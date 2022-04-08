import * as React from 'react';

import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import { useSelectOptions } from '../../hooks/useSelectOptions';
import { AutoCompleteOption } from '../../interface/options';
import classes from './FreeCreateSelection.module.scss';

interface Props {
    label: string;
    value: string;
    type: string;
    onChange: (value: string) => void;
}

const filter = createFilterOptions<AutoCompleteOption>();

export default function FreeCreateSelection({ label, type, onChange }: Props) {
    const { options: fetchedOptions, addOption, deleteOption } = useSelectOptions('dbStatic', type);
    const [value, setValue] = React.useState<AutoCompleteOption | null>(null);

    return (
        <Autocomplete<AutoCompleteOption>
            sx={{ width: 210 }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={fetchedOptions}
            value={value}
            onChange={(event, newValue) => {
                if (newValue && newValue.inputValue) {
                    // Call api to add option
                    addOption({
                        label: newValue.inputValue,
                        value: newValue.inputValue,
                        type,
                    }).subscribe((newOptions) => {
                        const addedOption = newOptions?.find(
                            (option) => option.value === newValue.value && option.type === newValue.type,
                        );
                        if (addedOption === undefined) return;
                        setValue(addedOption);
                    });
                } else {
                    setValue(newValue);
                    onChange(newValue?.value || '');
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.label);
                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        label: `Add "${inputValue}"`,
                        value: inputValue,
                        type,
                    });
                }

                return filtered;
            }}
            getOptionLabel={(option) => {
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.label;
            }}
            renderOption={(props, option) => (
                <li {...props}>
                    <div className={classes.option}>
                        {option.label}
                        {!option.inputValue && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (option?.id === undefined) return;
                                    deleteOption(option.id.toString()).subscribe();
                                }}
                            >
                                <DeleteOutlineTwoToneIcon />
                            </IconButton>
                        )}
                    </div>
                </li>
            )}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
}
