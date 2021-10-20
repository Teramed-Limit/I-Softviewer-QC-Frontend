import { useState } from 'react';

const fakeAuth = {
    isAuthenticated: false,
    signin(cb: { (): void; (...args: any[]): void }) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb: { (): void; (...args: any[]): void }) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    },
};

export function useProvideAuth() {
    const [user, setUser] = useState<null | string>(null);

    const signin = (cb: () => void) => {
        return fakeAuth.signin(() => {
            setUser('user');
            cb();
        });
    };

    const signout = (cb: () => void) => {
        return fakeAuth.signout(() => {
            setUser(null);
            cb();
        });
    };

    return {
        user,
        signin,
        signout,
    };
}
