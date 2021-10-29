import React from 'react';

import { Button } from '@mui/material';

interface Props {
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    accept?: string;
    onChange: (e) => void;
}

const FileSelect = ({ label = 'select', size = 'small', accept = '*', variant = 'contained', onChange }: Props) => {
    const fileInput = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <Button variant={variant} size={size} onClick={() => fileInput?.current?.click()}>
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
