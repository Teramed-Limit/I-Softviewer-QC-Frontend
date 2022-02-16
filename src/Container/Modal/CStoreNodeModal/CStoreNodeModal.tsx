import * as React from 'react';
import { forwardRef, useEffect } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';
import { forkJoin } from 'rxjs';

import { http } from '../../../api/axios';
import { loading } from '../../../atoms/loading';
import { atomNotification } from '../../../atoms/notification';
import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import { DicomOperationNode } from '../../../interface/dicom-node';
import { MessageType } from '../../../interface/notification';
import { StudyQueryData } from '../../../interface/study-query-data';
import BaseModal from '../../BaseModal/BaseModal';

type CStoreNodeModalProps = { selectedRow: StudyQueryData[] };

const CStoreNodeModal = forwardRef<BaseModalHandle, CStoreNodeModalProps>((props, ref) => {
    const setNotification = useSetRecoilState(atomNotification);
    const setLoading = useSetRecoilState(loading);
    const { modalOpen, setModalOpen } = useModal(ref);
    const [nodeName, setNodeName] = React.useState('');
    const [nodeOptions, setNodeOptions] = React.useState<DicomOperationNode[]>([]);

    const onCStore = () => {
        setLoading(true);
        const observableList = props.selectedRow.map((selectedRow) => {
            return http.post(`storeDcmService/studyInstanceUID/${selectedRow.studyInstanceUID}/sendTo/${nodeName}`);
        });

        forkJoin(observableList).subscribe({
            next: () => {
                setLoading(false);
                setModalOpen(false);
                setNotification({
                    messageType: MessageType.Success,
                    message: `Store study success`,
                });
            },
            error: (err: AxiosError) => {
                setLoading(false);
                setNotification({
                    messageType: MessageType.Error,
                    message: err.response?.data || 'Http request failed!',
                });
            },
        });
    };

    useEffect(() => {
        const subscription = http
            .get<DicomOperationNode[]>('configuration/dicomOperationNode/operationType/C-Store')
            .subscribe((res) => {
                setNodeOptions(res.data);
                if (res.data.length > 0) setNodeName(res.data[0].name);
            });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <BaseModal
            width="40%"
            maxHeight="80%"
            open={modalOpen}
            setOpen={setModalOpen}
            footer={{
                actionLabel: 'Send',
                actionHandler: onCStore,
            }}
        >
            <FormControl fullWidth size="small" margin="dense" variant="outlined">
                <InputLabel>Send To PACS</InputLabel>
                <Select value={nodeName} label="Send To PACS" onChange={(e) => setNodeName(e.target.value)}>
                    {nodeOptions.map((row) => (
                        <MenuItem key={row.name} value={row.name}>
                            {row.name}
                            {row.description && ` (${row.description})`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </BaseModal>
    );
});

export default CStoreNodeModal;
