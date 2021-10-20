import * as React from 'react';

import { Redirect, Route } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

interface Props {
    path: string;
    children: React.ReactNode;
}

function PrivateRoute({ children, ...rest }: Props) {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
