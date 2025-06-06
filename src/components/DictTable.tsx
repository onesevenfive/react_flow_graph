import React from "react";

type Props = {
    data: Record<string, number>;
};

const thStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left"
};

const tdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px"
};

const tableStyle: React.CSSProperties = {
    borderCollapse: "collapse", 
    width: "100%"
};

const DictionaryTable: React.FC<Props> = React.memo(({ data }) => {
    const entries = React.useMemo(() => Object.entries(data), [data]);
    
    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={thStyle}>Key</th>
                    <th style={thStyle}>Value</th>
                </tr>
            </thead>
            <tbody>
                {entries.map(([key, value]) => (
                    <tr key={key}>
                        <td style={tdStyle}>{key}</td>
                        <td style={tdStyle}>{value.toFixed(4)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
});

DictionaryTable.displayName = 'DictionaryTable';

export default DictionaryTable;