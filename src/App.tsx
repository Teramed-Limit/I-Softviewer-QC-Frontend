import React, { useEffect } from 'react';

import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.scss';
import InjectAxiosInterceptors from './api/InjectAxiosInterceptors ';
import { useAuth } from './hooks/useAuth';
import { appRoutes } from './Route/app-routes';
import RouteWithSubRoutes from './Route/RouteWithSubRoutes/RouteWithSubRoutes';

function App() {
    const { initialAuth } = useAuth();

    useEffect(() => {
        initialAuth();
    }, [initialAuth]);

    return (
        <>
            <InjectAxiosInterceptors />
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
