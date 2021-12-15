import React from 'react';

import Box from '@mui/material/Box';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import { DicomTagData } from '../../../../interface/tag-dict';

interface Props extends ICellRendererParams {
    data: DicomTagData;
}

const TagCell = (prop: Props) => {
    return <Box sx={{ paddingLeft: `${prop.data.level * 24}px` }}>{prop.value}</Box>;
};

export default TagCell;
