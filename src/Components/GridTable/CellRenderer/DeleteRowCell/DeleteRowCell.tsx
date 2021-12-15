import React, { useImperativeHandle } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

import { DeleteRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: DeleteRowClick;
}

const DeleteRowCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <IconButton color="error" component="span" onClick={() => props.onClick(props)}>
            <ClearIcon />
        </IconButton>
    );
});

export default DeleteRowCell;
