import React from 'react';

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
        <div
            className={cx(classes.toolbarButton, {
                [classes.active]: isActive,
            })}
            onClick={onClick}
        >
            {IconComp}
            <div className={classes.label}>{label}</div>
            {children}
        </div>
    );
};

export default IconButton;
