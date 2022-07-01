import React from 'react';

import { ImFolderOpen } from 'react-icons/im';

import PrimaryButton from '../PrimaryButton/PrimaryButton';

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
    size = 'medium',
    accept = '*',
    variant = 'contained',
    disabled = false,
    onChange,
}: Props) => {
    const fileInput = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <PrimaryButton
                disabled={disabled}
                variant={variant}
                size={size}
                startIcon={<ImFolderOpen style={{ fontSize: '24px' }} />}
                onClick={() => fileInput?.current?.click()}
            >
                {label}
            </PrimaryButton>
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
