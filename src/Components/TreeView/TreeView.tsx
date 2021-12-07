import React, { useState } from 'react';

import AssignmentIcon from '@mui/icons-material/Assignment';
import ImageIcon from '@mui/icons-material/Image';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import cx from 'classnames';
import * as R from 'ramda';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { BsMenuButtonFill } from 'react-icons/all';

import { deepCopy } from '../../utils/general';
import classes from './TreeView.module.scss';

const getItemStyle = (active, isDragging, draggableStyle) => {
    return {
        userSelect: 'none',
        background: isDragging ? '#babfc7' : '',
        width: isDragging ? 'fit-content' : '',
        ...draggableStyle,
    };
};

const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
};

const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
};

const data = {
    patient: {
        isOpen: true,
        patientId: 'P0001',
        patientName: 'Chen Da Ming',
        study: [
            {
                isOpen: true,
                accessionNumber: 'A00001',
                studyInsUid: '1.3.6.4.1245397.1',
                modality: 'ES',
                studyDescription: 'Colonoscopy',
                series: [
                    {
                        isOpen: true,
                        seriesInsUid: '1.3.6.4.1245397.1.1',
                        seriesDescription: 'Colonoscopy',
                        images: [
                            {
                                isOpen: false,
                                sopInsUid: '1.3.6.4.1245397.1.1.1',
                                fileName: '1.3.6.4.1245397.1.1.1.dcm',
                            },
                            {
                                isOpen: false,
                                sopInsUid: '1.3.6.4.1245397.1.1.2',
                                fileName: '1.3.6.4.1245397.1.1.2.dcm',
                            },
                        ],
                    },
                    {
                        isOpen: true,
                        seriesInsUid: '1.3.6.4.1245397.1.2',
                        seriesDescription: 'Colonoscopy',
                        images: [
                            {
                                isOpen: false,
                                sopInsUid: '1.3.6.4.1245397.1.2.1',
                                fileName: '1.3.6.4.1245397.1.2.1.dcm',
                            },
                            {
                                isOpen: false,
                                sopInsUid: '1.3.6.4.1245397.1.2.2',
                                fileName: '1.3.6.4.1245397.1.2.2.dcm',
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

const TreeView = () => {
    const [nodes, setNodes] = useState(data);
    const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const onToggle = (event: React.MouseEvent<HTMLDivElement>, nodePath: any[]) => {
        event.stopPropagation();
        const targetNode = R.path<any>(nodePath, nodes);
        if (!targetNode) return;

        const imageType = nodePath.find((value) => value === 'images');
        if (event.shiftKey) {
            if (imageType) {
                setSelectedSeries([]);
                setSelectedImages((list) => {
                    const sameId = (x) => x === targetNode.sopInsUid;
                    return R.pipe(R.dropWhile(sameId), R.append(targetNode.sopInsUid))(list);
                });
            } else {
                setSelectedSeries((list) => {
                    const sameId = (x) => x === targetNode.seriesInsUid;
                    return R.pipe(R.dropWhile(sameId), R.append(targetNode.seriesInsUid))(list);
                });
                setSelectedImages([]);
            }
            return;
        }

        targetNode.isOpen = !targetNode.isOpen;
        const newNodes = R.assocPath(nodePath, targetNode, nodes);
        setNodes(newNodes);

        if (imageType) {
            setSelectedSeries([]);
            setSelectedImages([targetNode.sopInsUid]);
        } else {
            setSelectedSeries([targetNode.seriesInsUid]);
            setSelectedImages([]);
        }
    };

    const onDragEnd = (result, nodePath: any[]) => {
        if (!result.destination) {
            return;
        }

        const sourceSeriesIdx = +result.source.droppableId.replace('series#', '');
        const destinationSeriesIdx = +result.destination.droppableId.replace('series#', '');

        const nodesCopy = deepCopy(R.path<any>(nodePath, nodes));

        const sourceList = nodesCopy[sourceSeriesIdx].images;
        const [removedElement, newSourceList] = removeFromList(sourceList, result.source.index);
        nodesCopy[sourceSeriesIdx].images = newSourceList;
        const destinationList = nodesCopy[destinationSeriesIdx].images;
        nodesCopy[destinationSeriesIdx].images = addToList(destinationList, result.destination.index, removedElement);

        const newNodes = R.assocPath(nodePath, nodesCopy, nodes);
        setNodes(newNodes);
    };

    return (
        <div className={classes.tree}>
            <Box
                sx={{ marginLeft: `${0}px` }}
                className={classes.node}
                onClick={(e) => {
                    onToggle(e, ['patient']);
                }}
            >
                {nodes.patient.isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                <PersonIcon />
                {nodes.patient.patientName} ({nodes.patient.patientId})
            </Box>
            {/* Study */}
            {nodes.patient.study.map((study, studyIdx) => {
                return nodes.patient.isOpen ? (
                    <div key={study.studyInsUid}>
                        <Box
                            sx={{ marginLeft: `${24}px` }}
                            className={classes.node}
                            onClick={(e) => onToggle(e, ['patient', 'study', studyIdx])}
                        >
                            {study.isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                            <AssignmentIcon />
                            {study.modality} ({`${study.series.length} series`})
                        </Box>
                        {/* Series */}
                        <DragDropContext
                            onDragEnd={(result) => onDragEnd(result, ['patient', 'study', studyIdx, 'series'])}
                        >
                            {study.series.map((series, seriesIdx) => {
                                return study.isOpen ? (
                                    <div key={series.seriesInsUid}>
                                        <Box
                                            sx={{ marginLeft: `${48}px` }}
                                            className={cx(classes.node, {
                                                [classes.selected]: selectedSeries.indexOf(series.seriesInsUid) > -1,
                                            })}
                                            onClick={(e) =>
                                                onToggle(e, ['patient', 'study', studyIdx, 'series', seriesIdx])
                                            }
                                        >
                                            {series.isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                            <BsMenuButtonFill className={classes.icon} />
                                            {series.seriesDescription} (Series #{seriesIdx + 1})
                                        </Box>
                                        {/* Image */}
                                        <Droppable droppableId={`series#${seriesIdx}`}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                                    {series.images.map((image, imageIdx) => {
                                                        return series.isOpen ? (
                                                            <Draggable
                                                                key={image.sopInsUid}
                                                                draggableId={image.sopInsUid.toString()}
                                                                index={imageIdx}
                                                            >
                                                                {(itemProvided, snapshot) => (
                                                                    <Box
                                                                        ref={itemProvided.innerRef}
                                                                        {...itemProvided.draggableProps}
                                                                        {...itemProvided.dragHandleProps}
                                                                        sx={{ marginLeft: `${96}px` }}
                                                                        style={getItemStyle(
                                                                            true,
                                                                            snapshot.isDragging,
                                                                            itemProvided.draggableProps.style,
                                                                        )}
                                                                        className={cx(classes.node, {
                                                                            [classes.selected]:
                                                                                selectedImages.indexOf(
                                                                                    image.sopInsUid,
                                                                                ) > -1,
                                                                        })}
                                                                        onClick={(e) => {
                                                                            onToggle(e, [
                                                                                'patient',
                                                                                'study',
                                                                                studyIdx,
                                                                                'series',
                                                                                seriesIdx,
                                                                                'images',
                                                                                imageIdx,
                                                                            ]);
                                                                        }}
                                                                    >
                                                                        <ImageIcon />
                                                                        {image.fileName}
                                                                    </Box>
                                                                )}
                                                            </Draggable>
                                                        ) : null;
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                ) : null;
                            })}
                        </DragDropContext>
                    </div>
                ) : null;
            })}
        </div>
    );
};

export default TreeView;
