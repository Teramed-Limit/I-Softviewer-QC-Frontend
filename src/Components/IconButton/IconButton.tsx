import React from 'react';

import { Typography } from '@mui/material';
import cx from 'classnames';

import classes from './IconButton.module.scss';

interface Props {
    label: string;
    isActive: boolean;
    IconComp: React.ReactElement;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const IconButton = ({ IconComp, isActive, label, children, onClick }: Props) => {
    return (
        <>
            <div
                className={cx(classes.toolbarButton, {
                    [classes.active]: isActive,
                })}
                onClick={onClick}
            >
                {IconComp}
                <Typography variant="button2" component="div">
                    {label}
                </Typography>
                {children}
            </div>
        </>
    );
};

export default IconButton;
