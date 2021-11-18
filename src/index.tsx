import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import initCornerstone from './initCornerstone';
import reportWebVitals from './reportWebVitals';
import { rootTheme } from './theme/rootTheme';

initCornerstone();
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <RecoilRoot>
                <ThemeProvider theme={rootTheme}>
                    <App />
                </ThemeProvider>
            </RecoilRoot>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
