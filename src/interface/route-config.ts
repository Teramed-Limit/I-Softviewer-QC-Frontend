export interface RouteConfig {
    path: string;
    component: (props) => JSX.Element;
    protected: boolean;
    routes?: RouteConfig[];
    exact?: boolean;
}
