import React, { useImperativeHandle } from 'react';

import { Box, Chip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
}

const ChipCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <>
            {props.value.map((label) => {
                return (
                    <Box key={label} sx={{ mr: '2px', display: 'flex', alignItems: 'center ' }}>
                        <Chip size="small" label={label} />
                    </Box>
                );
            })}
        </>
    );
});

export default ChipCell;
