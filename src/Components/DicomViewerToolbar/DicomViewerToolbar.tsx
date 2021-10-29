import React from 'react';

import InvertColorsIcon from '@mui/icons-material/InvertColors';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import Box from '@mui/material/Box';
import {
    AiFillFileText,
    BiRectangle,
    BiShapeTriangle,
    BsEyedropper,
    BsFillEraserFill,
    GiArrowCursor,
    GiMagnifyingGlass,
    GiMove,
    IoEllipseOutline,
    RiCheckboxMultipleBlankFill,
    RiRulerFill,
} from 'react-icons/all';

import IconButton from '../IconButton/IconButton';
import IconMenuButton from '../IconMenuButton/IconMenuButton';
import LayoutTool from '../LayoutTool/LayoutTool';
import PopoverButton from '../PopoverButton/PopoverButton';
import classes from './DicomViewerToolbar.module.scss';

interface Props {
    row: number;
    col: number;
    activeTool: string;
    changeLayout: (selRow: number, selCol: number) => void;
    resetViewport: () => void;
    openModal: (open: boolean) => void;
    setActiveTool: (tool: string) => void;
}

const DicomViewerToolbar = ({ row, col, activeTool, changeLayout, resetViewport, openModal, setActiveTool }: Props) => {
    return (
        <Box className={classes.toolBar}>
            <PopoverButton
                renderCustomButton={(props) => <IconButton IconComp={<ViewComfyIcon />} label="Layout" {...props} />}
            >
                <LayoutTool row={+row - 1} col={+col - 1} onChange={changeLayout} />
            </PopoverButton>
            <IconButton
                isActive={activeTool === 'notool'}
                onClick={() => setActiveTool('notool')}
                IconComp={<GiArrowCursor />}
                label="General"
            />
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
            <IconButton
                isActive={false}
                onClick={() => openModal(true)}
                IconComp={<AiFillFileText />}
                label="DICOM Tag"
            />
        </Box>
    );
};

export default DicomViewerToolbar;
