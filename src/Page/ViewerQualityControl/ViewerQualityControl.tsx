import React from 'react';

import { useLocation } from 'react-router-dom';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import { ViewerStudyParams } from '../../interface/study-params';

const ViewerQualityControl = () => {
    // const { studyInsUID } = useParams<{ studyInsUID: string }>();
    const location = useLocation<ViewerStudyParams>();
    return <DicomViewer imageIds={location?.state?.dcmList || []} />;
};

export default ViewerQualityControl;
