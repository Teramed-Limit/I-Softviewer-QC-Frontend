import React from 'react';

import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.scss';
import { ProvideAuth } from './hooks/useAuth';
import { appRoutes } from './Route/app-routes';
import RouteWithSubRoutes from './Route/RouteWithSubRoutes/RouteWithSubRoutes';

function App() {
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    {appRoutes.map((route, i) => (
                        <RouteWithSubRoutes key={i.toString()} {...route} />
                    ))}
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

export default App;
