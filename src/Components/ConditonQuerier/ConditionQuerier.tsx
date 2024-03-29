import React, { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import SettingsIcon from '../../asserts/svg/setting.svg';
import BaseModal from '../../Container/BaseModal/BaseModal';
import { SVG } from '../../icon';
import { Field } from '../../interface/form-define';
import { TransferItem } from '../../interface/transfer-item';
import { EditorDefaultValue, EditorMapper } from '../../Layout/FormEditor/Editor/editorMapper';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import TransferList from '../TransferList/TransferList';
import classes from './ConditionQuerier.module.scss';

interface Props {
    fields: Field[];
    defaultQueryFields: string[];
    queryPairData: any;
    onQuery: () => void;
    onQueryPairDataChanged: (value: any, fieldId: string) => void;
    onQueryConditionChanged?: (value: string[]) => void;
}

const ConditionQuerier = ({
    fields,
    queryPairData,
    defaultQueryFields,
    onQuery,
    onQueryPairDataChanged,
    onQueryConditionChanged,
}: Props) => {
    const [open, setOpen] = useState(false);

    const [transferItems] = useState(fields.map((item) => ({ id: item.field, label: item.label, disabled: false })));

    const [selectedTransferItems, setSelectedTransferItems] = useState<TransferItem[]>(
        transferItems.filter((item) => defaultQueryFields.includes(item.id)),
    );

    const [queryFields, setQueryFields] = useState(fields.filter((item) => defaultQueryFields.includes(item.field)));

    const onValueChanged = (value: any, fieldId: string) => {
        onQueryPairDataChanged(value, fieldId);
    };

    const onTransferListChanged = (selectedList: TransferItem[], unselectedList: TransferItem[]) => {
        // reset query pair data
        unselectedList.forEach((item) => onQueryPairDataChanged('', item.id));
        // update query field
        const fieldIdList = selectedList.map((item) => item.id);
        setSelectedTransferItems(selectedList);
        setQueryFields(fields.filter((field) => fieldIdList.includes(field.field)));
        onQueryConditionChanged?.(fieldIdList);
        setOpen(false);
    };

    return (
        <>
            <div className={classes.queryCondition}>
                <IconButton size="small" onClick={() => setOpen(true)}>
                    <img className={classes.icon} src={SettingsIcon} alt="settings" />
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
                <PrimaryButton size="small" startIcon={<SVG.Query2 />} onClick={onQuery}>
                    <Typography variant="button" component="span">
                        Query
                    </Typography>
                </PrimaryButton>
            </div>
            <BaseModal width="auto" maxHeight="auto" open={open} setOpen={setOpen}>
                <TransferList
                    itemList={transferItems}
                    selectItemList={selectedTransferItems}
                    onTransferListChanged={onTransferListChanged}
                />
            </BaseModal>
        </>
    );
};

export default ConditionQuerier;
