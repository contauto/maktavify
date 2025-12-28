import React, { useMemo } from 'react';

interface JsonTableViewProps {
  data: unknown;
}

/**
 * Vertical table view for JSON data - displays key-value pairs in rows
 * instead of horizontal columns for better readability of large JSONs
 */
const JsonTableView: React.FC<JsonTableViewProps> = ({ data }) => {
  const flattenObject = (obj: unknown, prefix = ''): Record<string, unknown> => {
    if (obj === null || obj === undefined) {
      return { [prefix || 'value']: obj };
    }

    if (typeof obj !== 'object') {
      return { [prefix || 'value']: obj };
    }

    if (Array.isArray(obj)) {
      return obj.reduce((acc: Record<string, unknown>, item, index) => {
        const key = prefix ? `${prefix}[${index}]` : `[${index}]`;
        Object.assign(acc, flattenObject(item, key));
        return acc;
      }, {});
    }

    return Object.keys(obj as Record<string, unknown>).reduce((acc: Record<string, unknown>, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, pre + key));
      } else if (Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, pre + key));
      } else {
        acc[pre + key] = value;
      }
      return acc;
    }, {});
  };

  const entries = useMemo(() => {
    const flattened = flattenObject(data);
    return Object.entries(flattened);
  }, [data]);

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  const getValueColor = (value: unknown): string => {
    if (value === null || value === undefined) return 'text-orange-400';
    if (typeof value === 'boolean') return 'text-purple-400';
    if (typeof value === 'number') return 'text-blue-400';
    if (typeof value === 'string') return 'text-green-400';
    return 'text-gray-300';
  };

  return (
    <div className="p-4 space-y-1 font-mono text-sm">
      <div className="mb-4 px-3 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
        <span className="text-indigo-400 font-semibold">{entries.length}</span>
        <span className="text-gray-400 ml-2">properties</span>
      </div>

      <div className="space-y-1">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-2 rounded-lg hover:bg-gray-800/30 transition-colors border-b border-gray-700/20"
          >
            <div className="flex-shrink-0 sm:w-1/3 lg:w-1/4">
              <span className="text-cyan-400 font-medium break-all">{key}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`break-all ${getValueColor(value)}`}>
                {formatValue(value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JsonTableView;