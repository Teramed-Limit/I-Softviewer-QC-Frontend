import * as React from 'react';

import { MobileDateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateRange } from '@mui/lab/DateRangePicker/RangeTypes';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Field } from '../../../../interface/form-define';

interface Props {
    field: Field;
    value: DateRange<Date>;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: DateRange<Date>, fieldId: string) => void;
}

const DateRangeSelector = ({ field, value, onValueChanged }: Props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateRangePicker
                calendars={1}
                value={value}
                onChange={(newValue: DateRange<Date>) => {
                    onValueChanged(newValue, field.field);
                }}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField fullWidth size="small" {...startProps} />
                        <Box sx={{ mx: 2 }}> ~ </Box>
                        <TextField fullWidth size="small" {...endProps} />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};

export default React.memo(DateRangeSelector);
