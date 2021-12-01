import React, { useEffect, useState } from 'react';

import { Link } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { useHistory } from 'react-router-dom';

interface Props extends ICellRendererParams {
    urlPath: string;
}

const LinkCell = (props: Props) => {
    const history = useHistory();
    const [urlPath, setUrlPath] = useState(props.urlPath);

    useEffect(() => {
        let url = props.urlPath;
        const regexp = /\s*{\w+}\s*/g;
        const dynamicParams = props.urlPath.match(regexp);
        dynamicParams?.forEach((params) => {
            const fieldId = params.substring(1, params.length - 1);
            url = url.replace(params, props.data[fieldId]);
        });
        setUrlPath(url);
    }, [props.data, props.urlPath]);

    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
            component="button"
            variant="body2"
            onClick={(event) => {
                event.stopPropagation();
                history.push(urlPath);
            }}
        >
            {props.value}
        </Link>
    );
};

export default LinkCell;
