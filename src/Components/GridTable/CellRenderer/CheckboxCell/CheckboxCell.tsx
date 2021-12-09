import React from 'react';

import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

const CheckboxCell = (prop: ICellRendererParams) => {
    // const [check, setCheck] = useState(false);
    // useEffect(() => {
    //     setCheck(prop.value);
    // }, [prop.value]);
    return <input readOnly type="checkbox" checked={prop.value} />;
};

export default CheckboxCell;
