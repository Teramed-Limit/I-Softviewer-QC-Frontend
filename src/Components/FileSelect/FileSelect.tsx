import React from 'react';

import { Button } from '@mui/material';
import { ImFolderOpen } from 'react-icons/all';

interface Props {
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    accept?: string;
    disabled?: boolean;
    onChange: (e) => void;
}

const FileSelect = ({
    label = 'select',
    size = 'small',
    accept = '*',
    variant = 'contained',
    disabled = false,
    onChange,
}: Props) => {
    const fileInput = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <Button
                disabled={disabled}
                variant={variant}
                size={size}
                startIcon={<ImFolderOpen />}
                onClick={() => fileInput?.current?.click()}
            >
                {label}
            </Button>
            <input
                multiple
                ref={fileInput}
                type="file"
                style={{ display: 'none' }}
                accept={accept}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;
                    onChange(e);
                }}
            />
        </>
    );
};

export default FileSelect;
