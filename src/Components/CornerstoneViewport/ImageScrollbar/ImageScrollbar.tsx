import React, { PureComponent } from 'react';

import './ImageScrollbar.scss';

interface Props {
    value: number;
    max: number;
    height: string;
    onInputCallback: (value) => void;
}

class ImageScrollbar extends PureComponent<Props> {
    onChange = (event) => {
        const intValue = parseInt(event.target.value, 10);
        this.props.onInputCallback(intValue);
    };

    onKeyDown = (event) => {
        // We don't allow direct keyboard up/down input on the
        // image sliders since the natural direction is reversed (0 is at the top)

        // Store the KeyCodes in an object for readability
        const keys = {
            DOWN: 40,
            UP: 38,
        };

        // TODO: Enable scroll down / scroll up without depending on ohif-core
        if (event.which === keys.DOWN) {
            // OHIF.commands.run('scrollDown');
            event.preventDefault();
        } else if (event.which === keys.UP) {
            // OHIF.commands.run('scrollUp');
            event.preventDefault();
        }
    };

    render() {
        if (this.props.max === 0) {
            return null;
        }

        return (
            <div className="scroll">
                <div className="scroll-holder">
                    <input
                        className="imageSlider"
                        style={{ width: `${this.props.height}` }}
                        type="range"
                        min={0}
                        max={this.props.max}
                        step={1}
                        value={this.props.value}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}

export default ImageScrollbar;
