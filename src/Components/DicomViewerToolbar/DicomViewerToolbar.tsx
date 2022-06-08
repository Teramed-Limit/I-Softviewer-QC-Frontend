import React from 'react';

import InvertColorsIcon from '@mui/icons-material/InvertColors';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import Box from '@mui/material/Box';
import cornerstone from 'cornerstone-core';
import {
    AiFillFileText,
    BiRectangle,
    BiShapeTriangle,
    BsEyedropper,
    BsFillEraserFill,
    GiMagnifyingGlass,
    GiMove,
    IoEllipseOutline,
    RiCheckboxMultipleBlankFill,
    RiRulerFill,
} from 'react-icons/all';

import { RenderImage } from '../../interface/cornerstone-viewport-event';
import IconButton from '../IconButton/IconButton';
import IconMenuButton from '../IconMenuButton/IconMenuButton';
import LayoutTool from '../LayoutTool/LayoutTool';
import PopoverButton from '../PopoverButton/PopoverButton';
import classes from './DicomViewerToolbar.module.scss';

interface Props {
    row: number;
    col: number;
    activeImage?: RenderImage;
    activeTool: string;
    setActiveTool: (tool: string) => void;
    changeLayout: (selRow: number, selCol: number) => void;
}

const DicomViewerToolbar = ({ row, col, activeImage = undefined, activeTool, setActiveTool, changeLayout }: Props) => {
    // const [openModal, setModalOpen] = React.useState(false);

    const resetViewport = () => {
        if (activeImage === undefined) return;
        cornerstone.reset(activeImage.element);
    };

    return (
        <Box className={classes.toolBar}>
            <PopoverButton
                renderCustomButton={(props) => <IconButton IconComp={<ViewComfyIcon />} label="Layout" {...props} />}
            >
                <LayoutTool row={+row - 1} col={+col - 1} onChange={changeLayout} />
            </PopoverButton>
            <IconButton
                isActive={activeTool === 'Wwwc'}
                onClick={() => setActiveTool('Wwwc')}
                IconComp={<InvertColorsIcon />}
                label="W/C"
            />
            <IconButton
                isActive={activeTool === 'Pan'}
                onClick={() => setActiveTool('Pan')}
                IconComp={<GiMove />}
                label="Pan"
            />
            <IconButton
                isActive={activeTool === 'Zoom'}
                onClick={() => setActiveTool('Zoom')}
                IconComp={<GiMagnifyingGlass />}
                label="Zoom"
            />
            <IconButton
                isActive={activeTool === 'Magnify'}
                onClick={() => setActiveTool('Magnify')}
                IconComp={<RiCheckboxMultipleBlankFill />}
                label="Magnify"
            />
            <IconMenuButton classes={classes.menuList} IconComp={<AiFillFileText />} label="Meas.">
                <IconButton
                    isActive={activeTool === 'Length'}
                    onClick={() => setActiveTool('Length')}
                    IconComp={<RiRulerFill />}
                    label="Length"
                />
                <IconButton
                    isActive={activeTool === 'Probe'}
                    onClick={() => setActiveTool('Probe')}
                    IconComp={<BsEyedropper />}
                    label="Probe"
                />
                <IconButton
                    isActive={activeTool === 'Angle'}
                    onClick={() => setActiveTool('Angle')}
                    IconComp={<BiShapeTriangle />}
                    label="Angle"
                />
                <IconButton
                    isActive={activeTool === 'EllipticalRoi'}
                    onClick={() => setActiveTool('EllipticalRoi')}
                    IconComp={<IoEllipseOutline />}
                    label="Elliptical"
                />
                <IconButton
                    isActive={activeTool === 'RectangleRoi'}
                    onClick={() => setActiveTool('RectangleRoi')}
                    IconComp={<BiRectangle />}
                    label="Rectangle"
                />
                <IconButton
                    isActive={activeTool === 'Eraser'}
                    onClick={() => setActiveTool('Eraser')}
                    IconComp={<BsFillEraserFill />}
                    label="Eraser"
                />
            </IconMenuButton>
            <IconButton isActive={false} onClick={() => resetViewport()} IconComp={<RotateLeftIcon />} label="Reset" />
            {/* <> */}
            {/*    <IconButton */}
            {/*        isActive={false} */}
            {/*        onClick={() => setModalOpen(true)} */}
            {/*        IconComp={<AiFillFileText />} */}
            {/*        label="DICOM Tag" */}
            {/*    /> */}
            {/*    {activeImage && ( */}
            {/*        <BaseModal open={openModal} setOpen={setModalOpen}> */}
            {/*            <DicomTag image={activeImage.image} /> */}
            {/*        </BaseModal> */}
            {/*    )} */}
            {/* </> */}
        </Box>
    );
};

export default DicomViewerToolbar;
