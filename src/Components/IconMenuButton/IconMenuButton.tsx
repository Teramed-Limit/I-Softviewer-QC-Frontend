import React from 'react';

import { Menu } from '@mui/material';

import IconButton from '../IconButton/IconButton';

interface Props {
    label: string;
    IconComp: React.ReactElement;
    classes?: string;
    children: React.ReactElement<{ onClick?: (event: React.MouseEvent<HTMLElement>) => void }>[];
}

const IconMenuButton = ({ label, IconComp, children, classes }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} isActive={false} IconComp={IconComp} label={label} />
            <Menu
                MenuListProps={{
                    className: classes,
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        ...child.props,
                        onClick: (event) => {
                            if (child?.props?.onClick) {
                                child?.props?.onClick(event);
                            }
                            handleClose();
                        },
                    });
                })}
            </Menu>
        </div>
    );
};

export default IconMenuButton;
