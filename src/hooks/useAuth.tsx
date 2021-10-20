import * as React from 'react';
import { createContext, useContext } from 'react';

import { useProvideAuth } from './useProvideAuth';

interface AuthContext {
    user: string | null;
    signin: (cb: () => void) => void;
    signout: (cb: () => void) => void;
}

const authContext = createContext<AuthContext>({
    signin(cb: () => void): void {},
    signout(cb: () => void): void {},
    user: null,
});

export function useAuth() {
    return useContext(authContext);
}

interface Props {
    children: React.ReactNode;
}

export function ProvideAuth({ children }: Props) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
