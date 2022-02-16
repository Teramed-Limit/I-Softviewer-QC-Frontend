import * as React from 'react';
import { forwardRef, useEffect } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Stack from '@mui/material/Stack';

import { useDicomStudyQC } from '../../../hooks/useDicomQC';
import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import { StudyQueryData } from '../../../interface/study-query-data';
import BaseModal from '../../BaseModal/BaseModal';

type MergeModalProps = { selectedRow: StudyQueryData[] };

const MergeModal = forwardRef<BaseModalHandle, MergeModalProps>((props, ref) => {
    const { modalOpen, setModalOpen } = useModal(ref);
    const { mergeStudy } = useDicomStudyQC(() => {
        setFromStudyInsUid('');
        setToStudyInsUid('');
        setModalOpen(false);
    });
    // merge params
    const [fromStudyInsUid, setFromStudyInsUid] = React.useState('');
    const [toStudyInsUid, setToStudyInsUid] = React.useState('');

    const onSelectChange = (event, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromStudyInsUid(event.target.value);
            setToStudyInsUid(oneOrAnother(event.target.value));
        } else {
            setToStudyInsUid(event.target.value);
            setFromStudyInsUid(oneOrAnother(event.target.value));
        }
    };

    const oneOrAnother = (studyInstanceUID: string) => {
        return props.selectedRow.findIndex((row) => row.studyInstanceUID === studyInstanceUID) === 1
            ? props.selectedRow[0].studyInstanceUID
            : props.selectedRow[1].studyInstanceUID;
    };

    const onMerge = () => {
        mergeStudy({
            fromStudyUID: fromStudyInsUid,
            toStudyUID: toStudyInsUid,
        });
    };

    const renderOptions = () => {
        return props.selectedRow.map((row) => (
            <MenuItem
                key={row.studyInstanceUID}
                value={row.studyInstanceUID}
            >{`${row.accessionNumber} (${row.patientsName}-${row.patientId})`}</MenuItem>
        ));
    };

    useEffect(() => {
        setFromStudyInsUid(props.selectedRow?.[0]?.studyInstanceUID || '');
        setToStudyInsUid(props.selectedRow?.[1]?.studyInstanceUID || '');
    }, [props.selectedRow]);

    return (
        <BaseModal
            width="40%"
            maxHeight="80%"
            open={modalOpen}
            setOpen={setModalOpen}
            footer={{
                actionLabel: 'Merge',
                actionHandler: onMerge,
            }}
        >
            <Stack direction="column" spacing={1}>
                <FormControl fullWidth size="small" margin="dense" variant="outlined">
                    <InputLabel>From:</InputLabel>
                    <Select value={fromStudyInsUid} label="From:" onChange={(e) => onSelectChange(e, 'from')}>
                        {renderOptions()}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" margin="dense" variant="outlined">
                    <InputLabel>To:</InputLabel>
                    <Select value={toStudyInsUid} label="To:" onChange={(e) => onSelectChange(e, 'to')}>
                        {renderOptions()}
                    </Select>
                </FormControl>
            </Stack>
        </BaseModal>
    );
});

export default MergeModal;
