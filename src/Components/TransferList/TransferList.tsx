import * as React from 'react';
import { useEffect } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import * as R from 'ramda';

import { TransferItem } from '../../interface/transfer-item';
import classes from './TransferList.module.scss';

function not(a: readonly TransferItem[], b: readonly TransferItem[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly TransferItem[], b: readonly TransferItem[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

interface Props {
    itemList: TransferItem[];
    selectItemList: TransferItem[];
    onTransferListChanged: (itemList: TransferItem[]) => void;
}

function TransferList({ itemList, selectItemList, onTransferListChanged }: Props) {
    const [checked, setChecked] = React.useState<TransferItem[]>([]);
    const [left, setLeft] = React.useState<TransferItem[]>([]);
    const [right, setRight] = React.useState<TransferItem[]>(selectItemList);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        setLeft(R.without(selectItemList, itemList));
    }, [itemList, selectItemList]);

    const handleToggle = (value: TransferItem) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllRight = () => {
        setRight(right.concat(left.filter((item) => !item.disabled)));
        setLeft([...left.filter((item) => item.disabled)]);
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right.filter((item) => !item.disabled)));
        setRight([...right.filter((item) => item.disabled)]);
    };

    const customList = (items: readonly TransferItem[]) => (
        <Paper sx={{ width: 250, height: 350, overflow: 'auto' }} elevation={3}>
            <List dense component="div" role="list">
                {items.map((item: TransferItem) => {
                    const labelId = `transfer-list-item-${item.id}-label`;

                    return (
                        <ListItem
                            key={item.id}
                            role="listitem"
                            button
                            onClick={handleToggle(item)}
                            disabled={item.disabled}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(item) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={item.label} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <div className={classes.footer}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        onTransferListChanged(right);
                    }}
                >
                    Save
                </Button>
            </div>
        </>
    );
}

export default TransferList;
