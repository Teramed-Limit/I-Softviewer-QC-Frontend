import * as React from 'react';
import { useEffect, useState } from 'react';

import { DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { RangeInput } from '@mui/lab/DateRangePicker/RangeTypes';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Field } from '../../../../interface/form-define';
import { dateToStr, isEmptyOrNil, strToDate } from '../../../../utils/general';

interface Props {
    field: Field;
    value: string;
    autoFocus: boolean;
    readOnly?: boolean;
    onValueChanged: (value: string, fieldId: string) => void;
}

const DateRangeSelector = ({ field, value, onValueChanged }: Props) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<RangeInput<Date>>([null, null]);
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    useEffect(() => {
        if (isEmptyOrNil(value)) return;
        const dateStrRange = value.split('-');
        const dateRange = value.split('-').map((dateStr) => strToDate(dateStr));
        setDate([dateRange[0], dateRange[1]]);
        setStartDate(dateStrRange[0]);
        setEndDate(dateStrRange[1]);
    }, [value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={date}
                allowSameDateSelection
                reduceAnimations
                calendars={1}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                disableCloseOnSelect={false}
                disableOpenPicker
                onChange={(newValue) => {
                    const dateBetween = newValue.map((dateVal) => dateToStr(dateVal)).join('-');
                    onValueChanged(dateBetween, field.field);
                }}
                renderInput={(startProps, endProps) => {
                    return (
                        <>
                            <TextField value={startDate} onClick={() => setOpen(true)} fullWidth {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField value={endDate} onClick={() => setOpen(true)} fullWidth {...endProps} />
                        </>
                    );
                }}
            />
        </LocalizationProvider>
    );
};

export default React.memo(DateRangeSelector);
