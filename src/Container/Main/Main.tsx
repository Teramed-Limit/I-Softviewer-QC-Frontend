import React from 'react';

import { Outlet } from 'react-router-dom';

import Spinner from '../../Components/Spinner/Spinner';
import MenuAppBar from '../MenuAppBar/MenuAppBar';
import classes from './Main.module.scss';

function Main() {
    return (
        <>
            <MenuAppBar />
            <div className={classes.main}>
                <Spinner />
                <Outlet />
            </div>
        </>
    );
}

export default Main;
