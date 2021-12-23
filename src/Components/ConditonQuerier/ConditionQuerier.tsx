import React, { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import BaseModal from '../../Container/BaseModal/BaseModal';
import { Field } from '../../interface/form-define';
import { TransferItem } from '../../interface/transfer-item';
import { EditorDefaultValue, EditorMapper } from '../../Layout/FormEditor/Editor/editorMapper';
import TransferList from '../TransferList/TransferList';
import classes from './ConditionQuerier.module.scss';

interface Props {
    fields: Field[];
    defaultQueryFields: string[];
    queryPairData: any;
    onQuery: () => void;
    onQueryPairDataChanged: (value: any, fieldId: string) => void;
}

const ConditionQuerier = ({ fields, queryPairData, defaultQueryFields, onQuery, onQueryPairDataChanged }: Props) => {
    const [open, setOpen] = useState(false);

    const [transferItems] = useState(fields.map((item) => ({ id: item.field, label: item.label, disabled: false })));

    const [selectedTransferItems, setSelectedTransferItems] = useState<TransferItem[]>(
        transferItems.filter((item) => defaultQueryFields.includes(item.id)),
    );

    const [queryFields, setQueryFields] = useState(fields.filter((item) => defaultQueryFields.includes(item.field)));

    const onValueChanged = (value: any, fieldId: string) => {
        onQueryPairDataChanged(value, fieldId);
    };

    const onQueryConditionChanged = (itemList: TransferItem[]) => {
        const fieldIdList = itemList.map((item) => item.id);
        setSelectedTransferItems(itemList);
        setQueryFields(fields.filter((field) => fieldIdList.includes(field.field)));
        setOpen(false);
    };

    return (
        <>
            <div className={classes.queryCondition}>
                <IconButton size="small" onClick={() => setOpen(true)}>
                    <SettingsIcon />
                </IconButton>
                {queryFields.map((field) => {
                    const RenderComponent = EditorMapper[field.type];
                    const value = queryPairData[field.field] || EditorDefaultValue[field.type];

                    return (
                        <Box key={field.field} sx={{ flex: field.type === 'DataRange' ? 2 : 1 }}>
                            <RenderComponent field={field} value={value} isValid onValueChanged={onValueChanged} />
                        </Box>
                    );
                })}
                <Button variant="contained" color="primary" onClick={onQuery}>
                    Query
                </Button>
            </div>
            <BaseModal width="auto" maxHeight="auto" open={open} setOpen={setOpen}>
                <TransferList
                    itemList={transferItems}
                    selectItemList={selectedTransferItems}
                    onTransferListChanged={onQueryConditionChanged}
                />
            </BaseModal>
        </>
    );
};

export default ConditionQuerier;
