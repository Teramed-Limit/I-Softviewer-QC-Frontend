import React from 'react';

import { Link } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import classes from './LinkCell.module.scss';

interface Props extends ICellRendererParams {
    clicked: (...params) => void;
    isStaticLabel: boolean;
    label: string;
}

const LinkCell = (props: Props) => {
    return (
        <Link
            classes={{ root: classes.link }}
            component="button"
            onClick={(event) => {
                event.stopPropagation();
                props?.clicked(props);
            }}
        >
            {props.isStaticLabel ? props.label : props.value}
        </Link>
    );
};

export default LinkCell;
