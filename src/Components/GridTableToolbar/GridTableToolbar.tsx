import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface Props {
    selectedRow: any[];
}

const GridTableToolbar = ({ selectedRow }: Props) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(selectedRow.length > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {selectedRow.length > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {selectedRow.length} selected
                </Typography>
            ) : // <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            //     Studies
            // </Typography>
            null}
            {selectedRow.length > 0 ? (
                <>
                    <Stack direction="row" spacing={1}>
                        <Chip
                            sx={{ minWidth: 80 }}
                            disabled={selectedRow.length !== 2}
                            label="Merge"
                            color="warning"
                            onClick={() => {}}
                        />
                        <Chip sx={{ minWidth: 80 }} label="Match" color="info" onClick={() => {}} />
                        <Chip
                            sx={{ minWidth: 80 }}
                            disabled={selectedRow.length !== 2}
                            label="Restore"
                            color="success"
                            onClick={() => {}}
                        />
                        <Chip sx={{ minWidth: 80 }} label="Delete" color="error" onClick={() => {}} />
                    </Stack>
                </>
            ) : // <Tooltip title="Filter list">
            //     <IconButton>
            //         <FilterListIcon />
            //     </IconButton>
            // </Tooltip>
            null}
        </Toolbar>
    );
};

export default GridTableToolbar;
