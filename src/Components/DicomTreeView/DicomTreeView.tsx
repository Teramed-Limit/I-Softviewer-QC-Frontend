import React, { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from '@mui/material';
import cx from 'classnames';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { DicomIOD } from '../../interface/dicom-data';
import {
    DicomImageTree,
    DicomIODTreeView,
    DicomSeriesTree,
    DicomStudyTree,
    TreeAttribute,
} from '../../interface/dicom-tree-view';
import { deepCopy } from '../../utils/general';
import classes from './DicomTreeView.module.scss';

interface Props {
    dicomIOD: DicomIOD;
    onImageSelected: (sopInstanceUID) => void;
}

const DicomTreeView = ({ dicomIOD, onImageSelected }: Props) => {
    // const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [dicomIODTree, setDicomIODTree] = useState<DicomIODTreeView>({
        dicomStudy: [],
        dicomSeries: [],
        dicomImage: [],
    });

    useEffect(() => {
        setDicomIODTree({
            dicomStudy: dicomIOD.dicomStudy.map((data) => ({ ...data, isOpen: true })),
            dicomSeries: dicomIOD.dicomSeries.map((data) => ({ ...data, isOpen: true })),
            dicomImage: dicomIOD.dicomImage.map((data) => ({ ...data, isOpen: true })),
        });
    }, [dicomIOD]);

    const onNodeClick = (
        event: React.MouseEvent<HTMLDivElement>,
        nodeKey: string,
        nodeIdKey: string,
        instanceUID: string,
    ) => {
        event.stopPropagation();

        const targetNodeIdx = dicomIODTree[nodeKey].findIndex((data) => data[nodeIdKey] === instanceUID);
        setDicomIODTree((tree) => {
            const newNodes = deepCopy(dicomIODTree[nodeKey]);
            newNodes[targetNodeIdx].isOpen = !newNodes[targetNodeIdx].isOpen;
            return deepCopy({ ...tree, [nodeKey]: newNodes });
        });
    };

    const onImageNodeClick = (
        event: React.MouseEvent<HTMLDivElement>,
        nodeKey: string,
        nodeIdKey: string,
        instanceUID: string,
    ) => {
        setSelectedImages([instanceUID]);
        onImageSelected(instanceUID);
    };

    const onDragEnd = (result) => {};

    const patientLabel = () => `${dicomIOD?.dicomPatient.patientsName} (${dicomIOD?.dicomPatient.patientId})`;
    const studyLabel = (study: DicomStudyTree) => `${study.accessionNumber} (${study.modality})`;
    const seriesLabel = (series: DicomSeriesTree, index: number) => `Series #${index}`;
    const imageLabel = (image: DicomImageTree) => `${image.sopInstanceUID}`;

    return (
        <Box sx={{ height: '100%', overflow: 'auto' }}>
            <div className={classes.node}>
                <div className={classes.nodeContent}>
                    <AccountCircleIcon />
                    <span className={classes.text}>{patientLabel()}</span>
                </div>
            </div>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <Node<DicomStudyTree>
                    isRoot
                    nodeKey="dicomStudy"
                    nodes={dicomIODTree.dicomStudy}
                    nodeIdKey="studyInstanceUID"
                    labelKey={studyLabel}
                    level={0}
                    onNodeClick={onNodeClick}
                >
                    <Node<DicomSeriesTree>
                        nodeKey="dicomSeries"
                        nodes={dicomIODTree.dicomSeries}
                        nodeIdKey="seriesInstanceUID"
                        labelKey={seriesLabel}
                        parentNodeId="studyInstanceUID"
                        droppable
                        level={1}
                        onNodeClick={onNodeClick}
                    >
                        <Node<DicomImageTree>
                            nodeKey="dicomImage"
                            nodes={dicomIODTree.dicomImage}
                            nodeIdKey="sopInstanceUID"
                            labelKey={imageLabel}
                            parentNodeId="seriesInstanceUID"
                            draggable
                            scrollable
                            level={2}
                            selectedNodes={selectedImages}
                            onNodeClick={onImageNodeClick}
                        />
                    </Node>
                </Node>
            </DragDropContext>
        </Box>
    );
};

interface NodeProps<T extends TreeAttribute> {
    isRoot?: boolean;
    nodeKey: string;
    nodes: T[];
    nodeIdKey: string;
    labelKey: (node: any, index: number) => string;
    parentNodeId?: string;
    parentNodeIdValue?: string;
    level: number;
    children?: React.ReactNode;
    droppable?: boolean;
    draggable?: boolean;
    scrollable?: boolean;
    selectedNodes?: string[];
    onNodeClick?: (
        event: React.MouseEvent<HTMLDivElement>,
        nodeKey: string,
        nodeIdKey: string,
        instanceUID: string,
    ) => void;
}

const Node = <T extends TreeAttribute>({
    isRoot = false,
    nodeKey,
    nodes,
    nodeIdKey,
    labelKey,
    parentNodeId = '',
    parentNodeIdValue,
    level,
    children,
    droppable = false,
    draggable = false,
    scrollable = false,
    selectedNodes = [],
    onNodeClick = () => {},
}: NodeProps<T>) => {
    const childrenWithProps = (newProps) =>
        React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { ...child.props, ...newProps });
            }
            return child;
        });

    const nodeItem = (nodeData, idx) => {
        return (
            <div
                className={cx(classes.nodeContent, {
                    [classes.selected]: selectedNodes.indexOf(nodeData[nodeIdKey]) > -1,
                })}
                onClick={(e) => onNodeClick(e, nodeKey, nodeIdKey, nodeData[nodeIdKey])}
            >
                {children ? <>{nodeData.isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</> : null}
                <span className={classes.text}>{labelKey(nodeData, idx)} </span>
            </div>
        );
    };

    const draggableNodeItem = (nodeData, idx) => {
        return (
            <Draggable draggableId={nodeData[nodeIdKey]} index={idx} isDragDisabled={false}>
                {(itemProvided) => (
                    <div
                        ref={itemProvided.innerRef}
                        {...itemProvided.draggableProps}
                        {...itemProvided.dragHandleProps}
                        className={cx(classes.nodeContent, {
                            [classes.selected]: selectedNodes.indexOf(nodeData[nodeIdKey]) > -1,
                        })}
                        onClick={(e) => onNodeClick(e, nodeKey, nodeIdKey, nodeData[nodeIdKey])}
                    >
                        {children ? (
                            <>{nodeData.isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</>
                        ) : null}
                        <span className={classes.text}>{labelKey(nodeData, idx)}</span>
                    </div>
                )}
            </Draggable>
        );
    };

    const nodeListComponent = (nodeData, idx) => {
        return (
            <Box key={nodeData[nodeIdKey]} className={classes.node}>
                {draggable ? draggableNodeItem(nodeData, idx) : nodeItem(nodeData, idx)}
                {nodeData.isOpen ? childrenWithProps({ parentNodeIdValue: nodeData[nodeIdKey] }) : null}
            </Box>
        );
    };

    const droppableNodeListComponent = (nodeData, idx) => {
        return (
            <Droppable key={nodeData[nodeIdKey]} droppableId={nodeData[nodeIdKey]}>
                {(provided) => (
                    <Box
                        key={nodeData[nodeIdKey]}
                        className={classes.node}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {draggable ? draggableNodeItem(nodeData, idx) : nodeItem(nodeData, idx)}
                        {nodeData.isOpen ? childrenWithProps({ parentNodeIdValue: nodeData[nodeIdKey] }) : null}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        );
    };

    return (
        <>
            <Box sx={{ paddingLeft: level * 4 }} className={cx({ [classes.scrollContainer]: scrollable })}>
                {nodes
                    .filter((data) => isRoot || parentNodeIdValue === data[parentNodeId])
                    .map((data, idx) =>
                        droppable ? droppableNodeListComponent(data, idx) : nodeListComponent(data, idx),
                    )}
            </Box>
        </>
    );
};

export default DicomTreeView;
