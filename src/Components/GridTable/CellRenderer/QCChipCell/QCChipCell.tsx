import React, { useImperativeHandle } from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
}

const QCChipCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    useImperativeHandle(ref, () => ({
        getReactContainerStyle() {
            return {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            };
        },
    }));

    return (
        <Stack direction="row" spacing={1}>
            <Chip
                label="Merged"
                sx={{
                    bgcolor: 'rgba(84, 214, 44, 0.16)',
                    color: 'rgb(34, 154, 22)',
                    '&:hover': {
                        cursor: 'pointer',
                        bgcolor: 'rgba(84, 214, 44, 0.4)',
                    },
                }}
                onClick={() => {}}
                onDelete={() => {}}
                deleteIcon={<AutorenewIcon />}
            />
            <Chip
                label="Matched"
                sx={{
                    bgcolor: 'rgba(255, 72, 66, 0.16)',
                    color: 'rgb(183, 33, 54)',
                    '&:hover': {
                        cursor: 'pointer',
                        bgcolor: 'rgba(255, 72, 66, 0.4)',
                    },
                }}
                onClick={() => {}}
                onDelete={() => {}}
                deleteIcon={<AutorenewIcon />}
            />
        </Stack>
    );
});

export default QCChipCell;
