import * as React from 'react';
import { useState } from 'react';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import { LocationState } from '../../Components/PrivateRoute/PrivateRoute';
import { useAuth } from '../../hooks/useAuth';
import { SVG } from '../../icon';
import classes from './Login.module.scss';

export default function Login() {
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const { login, message } = useAuth();

    const navigatePath = (location?.state as LocationState)?.from?.pathname || '/qualityControl';

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        login(data.get('username'), data.get('password'), navigatePath);
    };

    return (
        <div className={classes.main}>
            <Typography className={classes.logo} variant="h2" component="div">
                <SVG.Medical style={{ marginRight: '8px' }} /> I-Software QC WebImporter
            </Typography>
            <Typography variant="h1" component="div">
                Sign In
            </Typography>
            <Box className={classes.content} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Typography className={classes.label} variant="body1Bold" component="div">
                    User
                </Typography>
                <input
                    className={classes.field}
                    required
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    autoComplete="off"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Typography className={classes.label} variant="body1Bold" component="div">
                    Password
                </Typography>
                <input
                    className={classes.field}
                    required
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <PrimaryButton size="medium" type="submit" fullWidth variant="contained">
                    <Typography variant="button" component="div">
                        Sign In
                    </Typography>
                </PrimaryButton>
                <Typography className={classes.message} variant="body1" component="div">
                    {message}
                </Typography>
            </Box>
        </div>
    );
}
