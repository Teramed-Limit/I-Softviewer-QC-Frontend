import React from 'react';

import Typography from '@mui/material/Typography';
import { ImFolderOpen } from 'react-icons/im';

import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface Props {
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    accept?: string;
    disabled?: boolean;
    directory?: boolean;
    onChange: (e) => void;
}

const FileSelect = ({
    label = 'select',
    size = 'small',
    accept = '*',
    variant = 'contained',
    disabled = false,
    directory = false,
    onChange,
}: Props) => {
    let fileInput = React.useRef<HTMLInputElement>(null).current;

    const addDirectory = (node: HTMLInputElement | null) => {
        if (node) {
            fileInput = node;
            if (directory) node.webkitdirectory = true;
        }
    };

    return (
        <>
            <PrimaryButton
                disabled={disabled}
                variant={variant}
                size={size}
                startIcon={<ImFolderOpen style={{ fontSize: '24px' }} />}
                onClick={() => fileInput?.click()}
            >
                <Typography variant="button" component="span">
                    {label}
                </Typography>
            </PrimaryButton>
            <input
                ref={(node) => addDirectory(node)}
                multiple
                type="file"
                style={{ display: 'none' }}
                accept={accept}
                // allow select same file to trigger event
                onClick={(event) => ((event.target as HTMLInputElement).value = '')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;
                    onChange(e);
                }}
            />
        </>
    );
};

export default FileSelect;
