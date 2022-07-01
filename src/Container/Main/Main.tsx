import React from 'react';

import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { loading } from '../../atoms/loading';
import Spinner from '../../Components/Spinner/Spinner';
import MenuAppBar from '../MenuAppBar/MenuAppBar';
import classes from './Main.module.scss';

function Main() {
    const isLoading = useRecoilValue(loading);
    return (
        <>
            <MenuAppBar />
            <div className={classes.main}>
                {isLoading && <Spinner />}
                <Outlet />
            </div>
        </>
    );
}

export default Main;
