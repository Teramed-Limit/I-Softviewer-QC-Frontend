import React from 'react';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';

import { loading, progressStatus } from '../../atoms/loading';
import classes from './Spinner.module.scss';

interface Props {
    size?: number;
}

const Spinner = ({ size = 20 }: Props) => {
    const isLoading = useRecoilValue(loading);
    const progress = useRecoilValue(progressStatus);

    const style = {
        width: `${size}px`,
        height: `${size}px`,
    };

    return (
        <>
            {isLoading && (
                <>
                    <div className={classes.scrollBlocker} />
                    <div className={classes.container}>
                        {progress.showProgress && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress size={'16rem'} />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            sx={{ fontSize: '48px' }}
                                            variant="caption"
                                            component="div"
                                            color="text.secondary"
                                        >{`${Math.round(progress.value)}%`}</Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    sx={{ fontSize: '48px' }}
                                    variant="caption"
                                    component="div"
                                    color="text.secondary"
                                >
                                    {progress.message}
                                </Typography>
                            </Box>
                        )}
                        {!progress.showProgress && (
                            <div className={classes.spinner}>
                                <div style={style} className="bounce1" />
                                <div style={style} className="bounce2" />
                                <div style={style} className="bounce3" />
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Spinner;
