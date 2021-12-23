import React from 'react';

import { Link } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

interface Props extends ICellRendererParams {
    clicked: (...params) => void;
}

const LinkCell = (props: Props) => {
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
            component="button"
            variant="body2"
            onClick={(event) => {
                event.stopPropagation();
                props?.clicked(props);
            }}
        >
            {props.value}
        </Link>
    );
};

export default LinkCell;
