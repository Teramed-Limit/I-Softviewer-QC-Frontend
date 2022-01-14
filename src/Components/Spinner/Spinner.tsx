import React from 'react';

import classes from './Spinner.module.scss';

interface Props {
    size?: number;
}

const Spinner = ({ size = 20 }: Props) => {
    const style = {
        width: `${size}px`,
        height: `${size}px`,
    };

    return (
        <>
            <div className={classes.scrollBlocker} />
            <div className={classes.container}>
                <div className={classes.spinner}>
                    <div style={style} className="bounce1" />
                    <div style={style} className="bounce2" />
                    <div style={style} className="bounce3" />
                </div>
            </div>
        </>
    );
};

export default Spinner;
