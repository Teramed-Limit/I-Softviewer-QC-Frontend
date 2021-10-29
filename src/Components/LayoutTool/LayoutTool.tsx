import React, { useEffect, useRef } from 'react';

const styleTable = {
    borderCollapse: 'collapse',
    width: '100px',
    height: '100px',
};

const styleTableTd = {
    width: '25px',
    height: '25px',
    border: 'solid 1px black',
};

interface Props {
    row: number;
    col: number;
    onChange: (row: number, col: number) => void;
}

const LayoutTool = ({ row, col, onChange }: Props) => {
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (tableRef.current === null) return;

        const { rows } = tableRef.current;

        for (let i = 0; i <= row; i++) {
            for (let j = 0; j <= col; j++) {
                rows[i].cells[j].style.backgroundColor = '#AAAAAA';
            }
        }
    }, [row, col]);

    const cellClick = (e) => {
        if (tableRef.current === null) return;

        const { rows } = tableRef.current;

        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 3; j++) {
                rows[i].cells[j].style.backgroundColor = 'white';
            }
        }

        // selected
        for (let i = 0; i <= e.target.parentNode.rowIndex; i++) {
            for (let j = 0; j <= e.target.cellIndex; j++) {
                rows[i].cells[j].style.backgroundColor = '#AAAAAA';
            }
        }

        onChange(e.target.parentNode.rowIndex + 1, e.target.cellIndex + 1);
    };

    const renderTable = () => {
        const rows = ['', '', '', ''];
        return rows.map((_, i) => {
            return (
                <tr key={`${i.toString()}`}>
                    <td style={{ ...styleTableTd }} onClick={cellClick} />
                    <td style={{ ...styleTableTd }} onClick={cellClick} />
                    <td style={{ ...styleTableTd }} onClick={cellClick} />
                    <td style={{ ...styleTableTd }} onClick={cellClick} />
                </tr>
            );
        });
    };

    return (
        <div>
            <table style={styleTable as React.CSSProperties} ref={tableRef}>
                <tbody>{renderTable()}</tbody>
            </table>
        </div>
    );
};

export default LayoutTool;
