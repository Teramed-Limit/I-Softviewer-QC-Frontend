import * as React from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { isAuthorize } from '../../atoms/auth';

export type LocationState = {
    from: Location;
};

interface Props {
    children: React.ReactElement;
}

function PrivateRoute(props: Props) {
    const auth = useRecoilValue(isAuthorize);
    const location = useLocation();

    if (!auth) {
        const from = (location.state as LocationState)?.from?.pathname || '/';
        return <Navigate to="/login" state={{ from }} replace />;
    }

    return props.children;
}

export default PrivateRoute;
