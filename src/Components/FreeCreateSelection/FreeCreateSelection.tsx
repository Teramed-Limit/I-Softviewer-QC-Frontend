import * as React from 'react';
import { useRef } from 'react';

import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import { useSelectOptions } from '../../hooks/useSelectOptions';
import { AutoCompleteOption } from '../../interface/options';
import CreateOptionModal from './CreateOptionModal/CreateOptionModal';
import classes from './FreeCreateSelection.module.scss';

interface Props {
    label?: string;
    value: string;
    type: string;
    onChange: (value: string) => void;
    labelFormatter?: (option: AutoCompleteOption) => string;
    valueFormatter?: (option: AutoCompleteOption) => string;
}

const filter = createFilterOptions<AutoCompleteOption>();

type ModalHandle = React.ElementRef<typeof CreateOptionModal>;

export default function FreeCreateSelection({ label, type, onChange, labelFormatter, valueFormatter }: Props) {
    const modalRef = useRef<ModalHandle>(null);
    const { options: fetchedOptions, deleteOption, setOptions } = useSelectOptions('dbStatic', type);
    const [value, setValue] = React.useState<AutoCompleteOption | null>(null);
    const [inputText, setInputText] = React.useState<string>('');

    const handleValueChanged = (option: AutoCompleteOption | null) => {
        if (!option) {
            setValue(null);
            onChange('');
            return;
        }

        setValue(option);
        // custom value format
        if (valueFormatter) onChange(valueFormatter(option));
        else onChange(option.value);
    };

    return (
        <>
            <Autocomplete<AutoCompleteOption>
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={fetchedOptions}
                value={value}
                isOptionEqualToValue={(a, b) => a.value === b.value}
                onChange={(event, selectedOption) => {
                    // Open custom option modal
                    if (selectedOption && selectedOption.inputValue) {
                        if (!modalRef?.current) return;
                        setInputText(selectedOption.inputValue);
                        modalRef.current.openModal();
                    }
                    // Set option directly
                    else if (selectedOption) {
                        handleValueChanged(selectedOption);
                    }
                    // Null option
                    else {
                        onChange('');
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.value);
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
                    // Custom label display
                    if (labelFormatter) {
                        return labelFormatter(option);
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
                                        deleteOption(option.id.toString()).subscribe(() => {
                                            handleValueChanged(null);
                                        });
                                    }}
                                >
                                    <DeleteOutlineTwoToneIcon />
                                </IconButton>
                            )}
                        </div>
                    </li>
                )}
                renderInput={(params) => <TextField {...params} fullWidth label={label} variant="standard" />}
            />
            {/* Modal */}
            <CreateOptionModal
                ref={modalRef}
                type={type}
                defaultLabel={inputText}
                defaultValue={inputText}
                onConfirmCallback={(newOptions, addedOption) => {
                    setOptions(newOptions);
                    handleValueChanged(addedOption);
                }}
            />
        </>
    );
}
