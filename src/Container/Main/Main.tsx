import React from 'react';

import { Redirect, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { loading } from '../../atoms/loading';
import Spinner from '../../Components/Spinner/Spinner';
import RouteWithSubRoutes from '../../Route/RouteWithSubRoutes/RouteWithSubRoutes';
import { workdirRoutes } from '../../Route/workdir-routes';
import MenuAppBar from '../MenuAppBar/MenuAppBar';
import SessionHub from '../SessionHub/SessionHub';
import classes from './Main.module.scss';

function Main() {
    const isLoading = useRecoilValue(loading);

    return (
        <>
            <SessionHub />
            <MenuAppBar />
            <div className={classes.main}>
                {isLoading && <Spinner />}
                <Switch>
                    <Redirect exact from="/" to="/qualityControl" />
                    {workdirRoutes.map((route, i) => (
                        <RouteWithSubRoutes key={i.toString()} {...route} />
                    ))}
                </Switch>
            </div>
        </>
    );
}

export default Main;
