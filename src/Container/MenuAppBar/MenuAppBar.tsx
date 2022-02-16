import * as React from 'react';

import { AccountCircle } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useHistory } from 'react-router-dom';

import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useAuth } from '../../hooks/useAuth';
import classes from './MenuAppBar.module.scss';

function MenuAppBar() {
    const history = useHistory();
    const { logout } = useAuth();

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <div className={classes.logoContainer}>
                    {/* <img src={logo} alt="" /> */}
                    <Typography variant="h6" component="div">
                        I-Software QC WebImporter
                    </Typography>
                </div>

                <div>
                    <Tooltip title="Home">
                        <IconButton size="large" color="inherit" onClick={() => history.push('/qualityControl')}>
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                    <WithElementVisibility
                        wrappedComp={
                            <Tooltip id="menuAppbar__tooltip-log" title="Log">
                                <IconButton size="large" color="inherit" onClick={() => history.push('/log')}>
                                    <LibraryBooksIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Tooltip id="menuAppbar__tooltip-settings" title="Settings">
                                <IconButton size="large" color="inherit" onClick={() => history.push('/setting')}>
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Tooltip id="menuAppbar__tooltip-user" title="User">
                                <IconButton size="large" color="inherit" onClick={() => history.push('/user')}>
                                    <AccountCircle />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <Tooltip title="Logout">
                        <IconButton size="large" color="inherit" onClick={(e) => handleLogout(e)}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MenuAppBar;
