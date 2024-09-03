import React from 'react';

function Table({ columns, data, handleRowClick }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => handleRowClick(row)}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
