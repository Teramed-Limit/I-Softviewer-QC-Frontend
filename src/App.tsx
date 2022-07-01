import React, { useEffect } from 'react';

import { CssBaseline } from '@mui/material';
import { RouteObject, useRoutes } from 'react-router-dom';

import './App.scss';
import InjectAxiosInterceptors from './api/InjectAxiosInterceptors ';
import NotFound from './Components/NotFound/NotFound';
import NotificationMessageAlert from './Components/NotificationMessageAlert/NotificationMessageAlert';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Main from './Container/Main/Main';
import { useAuth } from './hooks/useAuth';
import AdvancedQualityControl from './Page/AdvancedQualityControl/AdvancedQualityControl';
import ImageSelect from './Page/ImageSelect/ImageSelect';
import Log from './Page/Log/Log';
import Login from './Page/Login/Login';
import NewStudy from './Page/NewStudy/NewStudy';
import QualityControl from './Page/QualityControl/QualityControl';
import Setting from './Page/Setting/Setting';
import User from './Page/User/User';
import ViewerQualityControl from './Page/ViewerQualityControl/ViewerQualityControl';

function App() {
    const { initialAuth } = useAuth();

    useEffect(() => {
        initialAuth();
    }, [initialAuth]);

    const appRoutes: RouteObject[] = [
        {
            path: '/',
            element: (
                <PrivateRoute>
                    <Main />
                </PrivateRoute>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <PrivateRoute>
                            <QualityControl />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/qualityControl',
                    element: (
                        <PrivateRoute>
                            <QualityControl />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/newStudy',
                    element: (
                        <PrivateRoute>
                            <NewStudy />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/newStudy/viewer',
                    element: (
                        <PrivateRoute>
                            <ImageSelect />
                        </PrivateRoute>
                    ),
                },

                {
                    path: '/qualityControl/viewer/studies/studyInstanceUID/:studyInsUID',
                    element: (
                        <PrivateRoute>
                            <ViewerQualityControl />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/qualityControl/advanced/studies/studyInstanceUID/:studyInsUID',
                    element: (
                        <PrivateRoute>
                            <AdvancedQualityControl />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/log',
                    element: (
                        <PrivateRoute>
                            <Log />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/setting',
                    element: (
                        <PrivateRoute>
                            <Setting />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/user',
                    element: (
                        <PrivateRoute>
                            <User />
                        </PrivateRoute>
                    ),
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ];

    const routeElement = useRoutes(appRoutes);

    return (
        <>
            <CssBaseline />
            <InjectAxiosInterceptors />
            <NotificationMessageAlert />
            {routeElement}
        </>
    );
}

export default App;
