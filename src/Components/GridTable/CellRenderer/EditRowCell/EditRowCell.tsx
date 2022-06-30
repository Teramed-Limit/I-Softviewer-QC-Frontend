import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import { EditRowClick } from '../../../../hooks/useGridTable';

interface Props extends ICellRendererParams {
    onClick: EditRowClick;
}

const EditRowCell = (props: Props) => {
    return (
        <IconButton
            color="primary"
            component="span"
            onClick={() => props.onClick(props.data, 'update')}
            disabled={props.data.editable === undefined ? false : !props.data.editable}
        >
            <EditIcon />
        </IconButton>
    );
};

export default EditRowCell;
