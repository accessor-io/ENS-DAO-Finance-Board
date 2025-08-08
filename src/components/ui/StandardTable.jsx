import React from 'react';
import { componentClasses } from '../../styles/designSystem';

const StandardTable = ({ 
  headers, 
  data, 
  className = '',
  onRowClick,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  ...props 
}) => {
  const handleSort = (column) => {
    if (sortable && onSort) {
      const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column, newDirection);
    }
  };

  const getSortIcon = (column) => {
    if (!sortable || sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`${componentClasses.table.container} ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={componentClasses.table.header}>
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className={`${componentClasses.table.headerCell} ${
                    sortable ? 'cursor-pointer hover:text-gray-200' : ''
                  }`}
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.label}</span>
                    {getSortIcon(header.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={componentClasses.table.body}>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${componentClasses.table.row} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className={componentClasses.table.cell}>
                    {header.render ? header.render(row[header.key], row) : row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandardTable; 