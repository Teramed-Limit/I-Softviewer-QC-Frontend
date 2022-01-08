import React, { useEffect } from 'react';

import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.scss';
import InjectAxiosInterceptors from './api/InjectAxiosInterceptors ';
import NotificationMessageAlert from './Components/NotificationMessageAlert/NotificationMessageAlert';
import { useAuth } from './hooks/useAuth';
import { appRoutes } from './Route/app-routes';
import RouteWithSubRoutes from './Route/RouteWithSubRoutes/RouteWithSubRoutes';

import { CssBaseline } from '@mui/material';

function App() {
    const { initialAuth } = useAuth();

    useEffect(() => {
        initialAuth();
    }, [initialAuth]);

    return (
        <>
            <CssBaseline />
            <InjectAxiosInterceptors />
            <NotificationMessageAlert />
            <Router>
                <Switch>
                    {appRoutes.map((route, i) => (
                        <RouteWithSubRoutes key={i.toString()} {...route} />
                    ))}
                </Switch>
            </Router>
        </>
    );
}

export default App;
