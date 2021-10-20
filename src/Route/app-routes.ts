import NotFound from '../Components/NotFound/NotFound';
import Main from '../Container/Main/Main';
import { RouteConfig } from '../interface/route-config';
import Login from '../Page/Login/Login';

export const appRoutes: RouteConfig[] = [
    {
        path: '/login',
        component: Login,
        protected: false,
    },
    {
        path: '/',
        component: Main,
        protected: true,
    },
    {
        path: '*',
        component: NotFound,
        protected: false,
    },
];
