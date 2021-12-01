import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import classes from './Login.module.scss';

const theme = createTheme();

export default function Login() {
    const location = useLocation<{ from: { pathname: string; search: string } }>();
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const { login, message } = useAuth();

    const { from } = location.state || { from: { pathname: '/qualityControl' } };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        login(data.get('username'), data.get('password'), from);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User"
                            name="username"
                            autoFocus
                            autoComplete="off"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className={classes.message}>{message}</div>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
