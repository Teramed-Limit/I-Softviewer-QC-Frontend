import React from 'react';

import { Route } from 'react-router-dom';

import PrivateRoute from '../../Components/PrivateRoute/PrivateRoute';
import { RouteConfig } from '../../interface/route-config';

function RouteWithSubRoutes(route: RouteConfig) {
    return !route.protected ? (
        <Route
            exact={route.exact}
            path={route.path}
            render={(props) => <route.component {...props} routes={route.routes} />}
        />
    ) : (
        <PrivateRoute path={route.path}>
            <route.component routes={route.routes} />
        </PrivateRoute>
    );
}

export default RouteWithSubRoutes;
