import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.scss';
import { ProvideAuth } from './hooks/useAuth';
import { appRoutes } from './Route/app-routes';
import RouteWithSubRoutes from './Route/RouteWithSubRoutes/RouteWithSubRoutes';
import { rootTheme } from './theme/rootTheme';

function App() {
    return (
        <ThemeProvider theme={rootTheme}>
            <ProvideAuth>
                <Router>
                    <Switch>
                        {appRoutes.map((route, i) => (
                            <RouteWithSubRoutes key={i.toString()} {...route} />
                        ))}
                    </Switch>
                </Router>
            </ProvideAuth>
        </ThemeProvider>
    );
}

export default App;
