import * as React from 'react';

import { AccountCircle } from '@mui/icons-material';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useHistory } from 'react-router-dom';

import logo from '../../asserts/logo.png';
import classes from './MenuAppBar.module.scss';

function MenuAppBar() {
    const history = useHistory();

    return (
        <AppBar position="static">
            <Toolbar>
                <div className={classes.logoContainer}>
                    <img src={logo} alt="" />
                    <Typography variant="h6" component="div">
                        I-Software QC
                    </Typography>
                </div>

                <div>
                    <Tooltip title="Home">
                        <IconButton size="large" color="inherit" onClick={() => history.push('/home')}>
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Log">
                        <IconButton size="large" color="inherit" onClick={() => history.push('/log')}>
                            <BugReportIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton size="large" color="inherit" onClick={() => history.push('/setting')}>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="User">
                        <IconButton size="large" color="inherit" onClick={() => history.push('/user')}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Logout">
                        <IconButton size="large" color="inherit">
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MenuAppBar;