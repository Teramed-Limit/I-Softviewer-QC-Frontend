import React, { useImperativeHandle } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

interface Props extends ICellRendererParams {
    clicked: (...params) => void;
    type: string;
    color: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const IconMapper = {
    clear: <ClearIcon />,
    edit: <EditIcon />,
};

const IconCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <IconButton color={props.color} component="span" onClick={() => props.clicked(props)}>
            {IconMapper[props.type]}
        </IconButton>
    );
});

export default IconCell;
