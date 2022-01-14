import React, { PureComponent } from 'react';

import './LoadingIndicator.scss';

interface Props {
    percentComplete: number;
    error: any;
}

class LoadingIndicator extends PureComponent<Props> {
    static defaultProps = {
        percentComplete: 0,
        error: null,
    };

    render() {
        const pc = this.props.percentComplete;
        // const percComplete = `${pc}%`;

        return (
            <>
                {this.props.error ? (
                    <div className="imageViewerErrorLoadingIndicator loadingIndicator">
                        <div className="indicatorContents">
                            <h4>Error Loading Image</h4>
                            <p className="description">An error has occurred.</p>
                            <p className="details">{this.props.error.message}</p>
                        </div>
                    </div>
                ) : (
                    <div className="imageViewerLoadingIndicator loadingIndicator">
                        <div className="indicatorContents">
                            <h2>
                                {pc < 100 ? 'Loading...' : 'Loaded -'}
                                <i className="fa fa-spin fa-circle-o-notch fa-fw" />{' '}
                            </h2>
                            {pc === 100 && <p>Processing...</p>}
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default LoadingIndicator;
