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

import classes from './TransferList.module.scss';

function not(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

interface Props {
    itemList: string[];
    selectItemList: string[];
    onTransferListChanged: (itemList: string[]) => void;
}

function TransferList({ itemList, selectItemList, onTransferListChanged }: Props) {
    const [checked, setChecked] = React.useState<string[]>([]);
    const [left, setLeft] = React.useState<string[]>([]);
    const [right, setRight] = React.useState<string[]>(selectItemList);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        setLeft(R.without(selectItemList, itemList));
    }, [itemList, selectItemList]);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
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

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items: readonly string[]) => (
        <Paper sx={{ width: 250, height: 350, overflow: 'auto' }} elevation={3}>
            <List dense component="div" role="list">
                {items.map((item: string) => {
                    const labelId = `transfer-list-item-${item}-label`;

                    return (
                        <ListItem key={item} role="listitem" button onClick={handleToggle(item)}>
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
                            <ListItemText id={labelId} primary={item} />
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
                        onTransferListChanged(left);
                    }}
                >
                    Save
                </Button>
            </div>
        </>
    );
}

export default TransferList;
