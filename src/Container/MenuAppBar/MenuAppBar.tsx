import * as React from 'react';
import { useState } from 'react';

import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useHistory } from 'react-router-dom';

import MenuAppButton from '../../Components/MenuAppButton/MenuAppButton';
import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useAuth } from '../../hooks/useAuth';
import { SVG } from '../../icon';
import classes from './MenuAppBar.module.scss';

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomDecorate = () => {
    const list: React.ReactNode[] = [];
    for (let i = 0; i < 20; i++) {
        list.push(
            <SVG.MedicalDecorate
                key={i}
                style={{ top: `${getRandom(0, 92)}px`, left: `${getRandom(350, 1200)}px` }}
                className={classes.decorate}
            />,
        );
    }
    return list;
};

function MenuAppBar() {
    const history = useHistory();
    const [decorates] = useState<React.ReactNode[]>(randomDecorate());

    const { logout } = useAuth();

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
    };

    return (
        <>
            <AppBar className={classes.header} position="static">
                <div className={classes.headerCover}>{decorates}</div>
                <Toolbar>
                    <div className={classes.logoContainer}>
                        <Typography className={classes.logo} variant="h2" component="div">
                            <SVG.Medical style={{ marginRight: '8px' }} /> I-Software QC WebImporter
                        </Typography>
                    </div>

                    <div className={classes.menuContainer}>
                        <div className={classes.gutter}>
                            <MenuAppButton onClick={() => history.push('/qualityControl')}>
                                <SVG.Home />
                                Home
                            </MenuAppButton>
                        </div>

                        <WithElementVisibility
                            wrappedComp={
                                <div id="menuAppbar__tooltip-log" className={classes.gutter}>
                                    <MenuAppButton onClick={() => history.push('/log')}>
                                        <SVG.Log />
                                        Log
                                    </MenuAppButton>
                                </div>
                            }
                        />
                        <WithElementVisibility
                            wrappedComp={
                                <div id="menuAppbar__tooltip-settings" className={classes.gutter}>
                                    <MenuAppButton onClick={() => history.push('/setting')}>
                                        <SVG.Setting />
                                        Setting
                                    </MenuAppButton>
                                </div>
                            }
                        />
                        <WithElementVisibility
                            wrappedComp={
                                <div id="menuAppbar__tooltip-user" className={classes.gutter}>
                                    <MenuAppButton onClick={() => history.push('/user')}>
                                        <SVG.Profile />
                                        Profile
                                    </MenuAppButton>
                                </div>
                            }
                        />
                        <div className={classes.gutter}>
                            <MenuAppButton onClick={(e) => handleLogout(e)}>
                                <SVG.Logout />
                                Logout
                            </MenuAppButton>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default MenuAppBar;
