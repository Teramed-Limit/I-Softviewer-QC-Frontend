import React from 'react';

import { Redirect, Switch } from 'react-router-dom';

import RouteWithSubRoutes from '../../Route/RouteWithSubRoutes/RouteWithSubRoutes';
import { workdirRoutes } from '../../Route/workdir-routes';
import MenuAppBar from '../MenuAppBar/MenuAppBar';
import classes from './Main.module.scss';

function Main() {
    return (
        <>
            <MenuAppBar />
            <div className={classes.main}>
                <Switch>
                    <Redirect exact from="/" to="/home" />
                    {workdirRoutes.map((route, i) => (
                        <RouteWithSubRoutes key={i.toString()} {...route} />
                    ))}
                </Switch>
            </div>
        </>
    );
}

export default Main;
