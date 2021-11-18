import React, { useEffect, useState } from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

const CheckboxCell = (prop: ICellRendererParams) => {
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (prop.value === '1') {
            setCheck(true);
            return;
        }
        setCheck(false);
    }, [prop.value]);
    return <input readOnly type="checkbox" checked={check} />;
};

export default CheckboxCell;
