import React from 'react';

import { Button, ButtonGroup } from '@mui/material';
import { GridApi } from 'ag-grid-community';

import GridTable from '../../Components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './UserAccount.module.scss';

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

const UserAccount = () => {
    const [open, setOpen] = React.useState(false);

    const onSelectionChanged = (gridApi: GridApi) => {
        // gridApi.getModel().forEachNode((node, index) => {
        //     rowData[index].IsSelected = node.isSelected() ? '1' : '';
        // });
        //
    };

    const onFirstDataRendered = (gridApi: GridApi) => {
        // rowData.forEach((row, index) => {
        //     const rowNode = gridApi.getRowNode(String(index));
        //     return row.IsSelected === '1' ? rowNode?.selectThisNode(true) : rowNode?.selectThisNode(false);
        // });
    };

    return (
        <div className={classes.container}>
            {/* User Account */}
            <GridTableEditor
                gridHeader="User Account"
                colDef={define.userAccount.colDef}
                formDef={define.userAccount.formDef}
                rowData={rowData}
                buttonBar={
                    <ButtonGroup className={classes.buttonGroup} variant="contained">
                        <Button>Add</Button>
                        <Button color="secondary">Edit</Button>
                        <Button color="error">Del</Button>
                    </ButtonGroup>
                }
            />
            {/* User Role Group */}
            <h2>User Role Group</h2>
            <div className={`ag-theme-alpine ${classes.gridContainer}`}>
                <GridTable
                    columnDefs={define.userRoleGroup.colDef}
                    rowData={rowData}
                    onSelectionChanged={onSelectionChanged}
                    onFirstDataRendered={onFirstDataRendered}
                />
            </div>
            {/* Modal */}
            {/* <BaseModal open={open} setOpen={setOpen}> */}
            {/*    <TextField label="Password" variant="outlined" /> */}
            {/*    <TextField label="Password" variant="outlined" /> */}
            {/*    <TextField label="Password" variant="outlined" /> */}
            {/*    <TextField label="Password" variant="outlined" /> */}
            {/* </BaseModal> */}
        </div>
    );
};

export default UserAccount;
