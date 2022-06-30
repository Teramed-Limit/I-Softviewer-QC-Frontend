import React, { useImperativeHandle, useState } from 'react';

import { Button } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react';
import XMLViewer from 'react-xml-viewer';

import BaseModal from '../../../../Container/BaseModal/BaseModal';

interface Props extends ICellRendererParams {
    type: string;
    color: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}
const customTheme = {
    attributeKeyColor: '#0074D9',
    attributeValueColor: '#2ECC40',
};

const XmlViewerCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    const [open, setOpen] = useState(false);

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
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                XML Viewer
            </Button>
            <BaseModal width="70%" maxHeight="80%" open={open} setOpen={setOpen}>
                <div>
                    <XMLViewer xml={props.value} theme={customTheme} />
                </div>
            </BaseModal>
        </>
    );
});

export default XmlViewerCell;
