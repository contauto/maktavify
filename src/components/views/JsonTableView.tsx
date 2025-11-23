import React from 'react';

const JsonTableView = ({ data }: { data: any }) => {
  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else {
        acc[pre + key] = obj[key];
      }
      return acc;
    }, {});
  };

  const tableData = Array.isArray(data) 
    ? data.map(item => flattenObject(item))
    : [flattenObject(data)];

  const columns = [...new Set(tableData.flatMap(row => Object.keys(row)))];

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-indigo-500/10 border-b-2 border-indigo-500/30">
            {columns.map(col => (
              <th key={String(col)} className="px-4 py-3 text-left font-semibold text-indigo-400 whitespace-nowrap">
                {String(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors">
              {columns.map(col => (
                <td key={String(col)} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {row[col] !== undefined ? (
                    typeof row[col] === 'object' ? 
                      JSON.stringify(row[col]) : 
                      String(row[col])
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JsonTableView;