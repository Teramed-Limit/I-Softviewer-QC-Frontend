import React, { useState } from 'react';

import { Button } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import GridTable from '../../Components/GridTable/GridTable';
import BaseModal from '../../Container/BaseModal/BaseModal';
import { useGridTable } from '../../hooks/useGridTable';
import { FormDef } from '../../interface/form-define';
import FormEditor from '../FormEditor/FormEditor';
import classes from './GridTableEditor.module.scss';

interface Props {
    apiPath: string;
    identityId: string;
    colDef: ColDef[];
    formDef: FormDef;
    initFormData: any;
    addCallBack?: () => void;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    onSelectionChanged?: (gridApi: GridApi) => void;
}

const GridTableEditor = ({
    apiPath,
    identityId,
    colDef,
    formDef,
    initFormData,
    deleteCallBack,
    addCallBack,
    updateCallBack,
    onSelectionChanged,
}: Props) => {
    const [formIsValid, setFormIsValid] = useState(false);
    const {
        open,
        rowData,
        colDefs,
        editFormData,
        saveType,
        setOpen,
        setEditFormData,
        getRowNodeId,
        gridReady,
        updateFormData,
        saveRow,
        openEditor,
    } = useGridTable({
        apiPath,
        identityId,
        colDef,
        deleteCallBack,
        addCallBack,
        updateCallBack,
        initFormData,
    });

    const formInvalidChanged = (isValid) => {
        setFormIsValid(isValid);
    };

    return (
        <>
            <div className={`ag-theme-alpine ${classes.gridContainer}`}>
                <div className={classes.buttonGroup}>
                    <Button variant="text" onClick={() => openEditor(editFormData, 'add')}>
                        New
                    </Button>
                </div>
                <GridTable
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={rowData}
                    gridReady={gridReady}
                    getRowNodeId={getRowNodeId}
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
            <BaseModal width="80%" maxHeight="80%" open={open} setOpen={setOpen}>
                <FormEditor
                    saveType={saveType}
                    formDef={formDef}
                    formData={editFormData}
                    formDataChanged={updateFormData}
                    formInvalidChanged={formInvalidChanged}
                />
                <div className={classes.footer}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setEditFormData(initFormData);
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!formIsValid}
                        variant="contained"
                        color="primary"
                        onClick={() => saveRow(saveType, editFormData)}
                    >
                        Save
                    </Button>
                </div>
            </BaseModal>
        </>
    );
};

export default GridTableEditor;
