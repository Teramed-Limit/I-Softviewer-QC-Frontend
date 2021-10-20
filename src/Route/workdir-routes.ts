import { RouteConfig } from '../interface/route-config';
import AdvancedQualityControl from '../Page/AdvancedQualityControl/AdvancedQualityControl';
import Home from '../Page/Home/Home';
import Log from '../Page/Log/Log';
import NewStudy from '../Page/NewStudy/NewStudy';
import QualityControl from '../Page/QualityControl/QualityControl';
import Setting from '../Page/Setting/Setting';
import User from '../Page/User/User';
import ViewerQualityControl from '../Page/ViewerQualityControl/ViewerQualityControl';

export const workdirRoutes: RouteConfig[] = [
    {
        path: '/newStudy',
        component: NewStudy,
        protected: true,
    },
    {
        path: '/qualityControl/viewer/studies/:studyInsUID',
        component: ViewerQualityControl,
        protected: true,
    },
    {
        path: '/qualityControl/advanced/studies/:studyInsUID',
        component: AdvancedQualityControl,
        protected: true,
    },
    {
        path: '/qualityControl',
        component: QualityControl,
        protected: true,
        exact: true,
    },

    {
        path: '/log',
        component: Log,
        protected: true,
        exact: true,
    },
    {
        path: '/setting',
        component: Setting,
        protected: true,
        exact: true,
    },
    {
        path: '/user',
        component: User,
        protected: true,
        exact: true,
    },
    {
        path: '/home',
        component: Home,
        protected: true,
        exact: true,
    },
];
