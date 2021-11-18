import React, { useState } from 'react';

import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import FileSelect from '../../Components/FileSelect/FileSelect';
import cornerstoneFileImageLoader from '../../ImageLoader/cornerstoneFileImageLoader';

const ImageSelect = () => {
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [imageIds, setImageIds] = useState<string[]>([]);

    const onAddImageFile = (e) => {
        setImageIds(cornerstoneFileImageLoader.fileManager.setSelectedFiles(e.target.files));

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i);
            setSelectedFiles((value) => {
                return [
                    ...value,
                    {
                        isDicom: false,
                        files: file,
                    },
                ];
            });
        }
    };

    const onAddDicomFile = (e) => {
        const initImageIds: any[] = [];
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i);
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            initImageIds.push(imageId);
        }
        setImageIds(initImageIds);
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i);
            setSelectedFiles((value) => {
                return [
                    ...value,
                    {
                        isDicom: true,
                        files: file,
                    },
                ];
            });
        }
    };

    const onSendFile = (e) => {
        const formData = new FormData();
        const arr = ['this', 'is', 'an', 'array'];
        for (let i = 0; i < arr.length; i++) {
            formData.append('arr', arr[i]);
        }
        selectedFiles.forEach((data) => {
            formData.append('name', 'test');
            formData.append('file', data.files);
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stack direction="row" spacing={2}>
                <FileSelect label="Open Image Files" accept="image/png, image/jpeg" onChange={onAddImageFile} />
                <FileSelect label="Open DICOM Files" accept=".dcm" onChange={onAddDicomFile} />
                <Button variant="outlined" onClick={onSendFile}>
                    Save Order
                </Button>
                <Button variant="outlined" onClick={onSendFile}>
                    Send DICOM
                </Button>
            </Stack>
            <DicomViewer imageIds={imageIds} />
        </Box>
    );
};

export default ImageSelect;
