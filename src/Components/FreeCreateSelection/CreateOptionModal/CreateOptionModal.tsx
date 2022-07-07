import * as React from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import BaseModal from '../../../Container/BaseModal/BaseModal';
import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import { useSelectOptions } from '../../../hooks/useSelectOptions';
import { AutoCompleteOption, Option } from '../../../interface/options';
import { isEmptyOrNil } from '../../../utils/general';
import { concatMap, filter } from 'rxjs';

type CreateOptionProps = {
    type: string;
    defaultLabel: string;
    defaultValue: string;
    onConfirmCallback: (newOptions: AutoCompleteOption[], addedOption: Option) => void;
};

const CreateOptionModal = forwardRef<BaseModalHandle, CreateOptionProps>((props, ref) => {
    const { modalOpen, setModalOpen } = useModal(ref);
    const { addOption, checkDuplicateOption } = useSelectOptions('dbStatic', props.type);

    const [message, setMessage] = useState<string>('');
    const [label, setLabel] = useState<string>(props.defaultLabel);
    const [value, setValue] = useState<string>(props.defaultValue);
    const [labelInvalid, setLabelInvalid] = useState<boolean>(true);
    const [valueInvalid, setValueInvalid] = useState<boolean>(true);

    const requiredValidate = (val: string) => {
        return isEmptyOrNil(val);
    };

    useEffect(() => {
        setLabel(props.defaultLabel);
        setValue(props.defaultValue);
        setLabelInvalid(requiredValidate(props.defaultLabel));
        setValueInvalid(requiredValidate(props.defaultValue));
        setMessage('');
    }, [props.defaultLabel, props.defaultValue]);

    const onConfirm = () => {
        // Call api to add option
        checkDuplicateOption(value)
            .pipe(
                filter((isNotDuplicate) => {
                    setMessage('Option value is duplicated.');
                    return !isNotDuplicate;
                }),
                concatMap(() =>
                    addOption({
                        label: label,
                        value,
                        type: props.type,
                    }),
                ),
            )
            .subscribe((newOptions) => {
                const addedOption = newOptions?.find((option) => option.value === value && option.type === props.type);
                if (addedOption === undefined) return;
                props.onConfirmCallback(newOptions, addedOption);
                setModalOpen(false);
            });
    };

    return (
        <BaseModal
            width="40%"
            maxHeight="80%"
            open={modalOpen}
            setOpen={setModalOpen}
            footer={{
                actionLabel: 'Save',
                actionDisabled: labelInvalid || valueInvalid,
                actionHandler: onConfirm,
            }}
        >
            <Stack direction="column" spacing={1}>
                <TextField
                    error={labelInvalid}
                    helperText="Field is required"
                    required
                    label="Label"
                    value={label}
                    onChange={(e) => {
                        setLabel(e.target.value);
                        setLabelInvalid(requiredValidate(e.target.value));
                    }}
                />
                <TextField
                    error={valueInvalid}
                    helperText="Field is required"
                    required
                    label="Value"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setValueInvalid(requiredValidate(e.target.value));
                    }}
                />
                <Typography variant="h3" gutterBottom component="div">
                    {message}
                </Typography>
            </Stack>
        </BaseModal>
    );
});

export default CreateOptionModal;
