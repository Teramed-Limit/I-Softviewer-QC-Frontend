import React from 'react';

import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { GridApi } from 'ag-grid-community';

import { define } from '../../constant/setting-define';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import BaseModal from '../BaseModal/BaseModal';
import classes from './UserRoles.module.scss';

const rowData = [
    {
        UserName: 'UserName1',
        Password: 'Password1',
    },
    {
        UserName: 'UserName2',
        Password: 'Password2',
    },
];

const UserRoles = () => {
    const [open, setOpen] = React.useState(false);

    const onSelectionChanged = (gridApi: GridApi) => {};

    const onFirstDataRendered = (gridApi: GridApi) => {};

    return (
        <div className={classes.container}>
            {/* User Role Group */}
            <GridTableEditor
                gridHeader="User Role Group"
                colDef={define.userRoleGroup.colDef}
                formDef={define.userRoleGroup.formDef}
                rowData={rowData}
                buttonBar={
                    <ButtonGroup className={classes.buttonGroup} variant="contained">
                        <Button>Add</Button>
                        <Button color="secondary">Edit</Button>
                        <Button color="error">Del</Button>
                    </ButtonGroup>
                }
            />
            {/* Function List */}
            <h2>Function List</h2>
            <div className={classes.functionContent}>
                <div className={classes.functionList}>
                    <FormControlLabel control={<Checkbox checked={false} name="first" />} label="Gilad Gray" />
                    <FormControlLabel control={<Checkbox checked={false} name="sec" />} label="Gilad Gray" />
                </div>
                <div className={classes.functionList}>
                    <FormControlLabel control={<Checkbox checked={false} name="first" />} label="Gilad Gray" />
                    <FormControlLabel control={<Checkbox checked={false} name="sec" />} label="Gilad Gray" />
                </div>
            </div>
            {/* Modal */}
            <BaseModal open={open} setOpen={setOpen}>
                <TextField label="Password" variant="outlined" />
                <TextField label="Password" variant="outlined" />
            </BaseModal>
        </div>
    );
};

export default UserRoles;
