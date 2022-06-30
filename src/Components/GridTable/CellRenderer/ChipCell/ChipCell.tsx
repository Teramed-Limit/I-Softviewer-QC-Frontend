import React from 'react';

import { Box, Chip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
}

const ChipCell = (props: Props) => {
    return (
        <>
            {props.value.map((label) => {
                return (
                    <Box key={label} sx={{ mr: '2px', display: 'flex', alignItems: 'center ' }}>
                        <Chip label={label} />
                    </Box>
                );
            })}
        </>
    );
};

export default ChipCell;
