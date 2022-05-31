import React, { useImperativeHandle } from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

import PrimaryButton from '../../../PrimaryButton/PrimaryButton';

interface Props extends ICellRendererParams {
    clicked: (...params) => void;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant: 'text' | 'outlined' | 'contained';
    label: string;
}

const ButtonCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
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
        <PrimaryButton size="medium" sx={{ height: '36px' }} onClick={() => props.clicked(props)}>
            {props.label}
        </PrimaryButton>
    );
});

export default ButtonCell;
