import React from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import PrimaryButton from '../../../PrimaryButton/PrimaryButton';

interface Props extends ICellRendererParams {
    clicked: (...params) => void;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant: 'text' | 'outlined' | 'contained';
    label: string;
}

const ButtonCell = (props: Props) => {
    return (
        <PrimaryButton size="medium" sx={{ height: '36px' }} onClick={() => props.clicked(props)}>
            {props.label}
        </PrimaryButton>
    );
};

export default ButtonCell;
