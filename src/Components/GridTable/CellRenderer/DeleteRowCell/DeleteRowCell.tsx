import React from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import { DeleteRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: DeleteRowClick;
}

const DeleteRowCell = (props: Props) => {
    return (
        <IconButton color="error" component="span" onClick={() => props.onClick(props)}>
            <ClearIcon />
        </IconButton>
    );
};

export default DeleteRowCell;
