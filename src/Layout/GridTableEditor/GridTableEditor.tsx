import React from 'react';

import { ColDef } from 'ag-grid-community';
import cx from 'classnames';

import GridTable from '../../Components/GridTable/GridTable';
import { FormDef } from '../../interface/form-define';
import FormEditor from '../FormEditor/FormEditor';
import classes from './GridTableEditor.module.scss';

interface Props {
    gridHeader?: string;
    formHeader?: string;
    colDef: ColDef[];
    formDef: FormDef;
    rowData: any[];
    orientation?: 'vertical' | 'horizontal';
    buttonBar?: React.ReactNode;
}

const GridTableEditor = ({
    gridHeader = '',
    formHeader = '',
    colDef,
    formDef,
    rowData,
    orientation = 'vertical',
    buttonBar,
}: Props) => {
    return (
        <>
            <div
                className={cx(classes.container, {
                    [classes.vertical]: orientation === 'vertical',
                })}
            >
                {gridHeader === '' ? null : <h2>{gridHeader}</h2>}
                <div className={`ag-theme-alpine ${classes.gridContainer}`}>
                    <GridTable columnDefs={colDef} rowData={rowData} />
                </div>
            </div>

            {buttonBar}

            <FormEditor header={formHeader} formDef={formDef} />
        </>
    );
};

export default GridTableEditor;
