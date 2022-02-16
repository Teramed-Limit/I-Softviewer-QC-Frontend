import * as React from 'react';

import { Redirect, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { isAuthorize } from '../../atoms/auth';

interface Props {
    path: string;
    children: React.ReactNode;
}

function PrivateRoute({ children, ...rest }: Props) {
    const auth = useRecoilValue(isAuthorize);
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth ? (
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
