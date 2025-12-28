import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Check, Minus, Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiffItem {
  path: string;
  value?: unknown;
  old?: unknown;
  new?: unknown;
}

interface DiffResult {
  added: DiffItem[];
  removed: DiffItem[];
  modified: DiffItem[];
}

interface JsonCompareProps {
  json1: unknown;
  json2: unknown;
}

/**
 * Side-by-side JSON comparison with colorized differences and synchronized scrolling
 */
const JsonCompare: React.FC<JsonCompareProps> = ({ json1, json2 }) => {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingSyncRef = useRef(false);

  const [diff, setDiff] = useState<DiffResult>({
    added: [],
    removed: [],
    modified: []
  });

  // Compute diff
  useEffect(() => {
    if (!json1 || !json2) return;

    const isPlainObject = (val: unknown): val is Record<string, unknown> => {
      return val !== null && typeof val === 'object' && !Array.isArray(val);
    };

    const buildPath = (basePath: string, key: string | number): string => {
      if (basePath === '') {
        return typeof key === 'number' ? `[${key}]` : String(key);
      }
      return typeof key === 'number' ? `${basePath}[${key}]` : `${basePath}.${key}`;
    };

    const findDifferences = (obj1: unknown, obj2: unknown, path = ''): DiffResult => {
      const result: DiffResult = { added: [], removed: [], modified: [] };

      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        const maxLen = Math.max(obj1.length, obj2.length);
        for (let i = 0; i < maxLen; i++) {
          const currentPath = buildPath(path, i);
          if (i >= obj1.length) {
            result.added.push({ path: currentPath, value: obj2[i] });
          } else if (i >= obj2.length) {
            result.removed.push({ path: currentPath, value: obj1[i] });
          } else if (JSON.stringify(obj1[i]) !== JSON.stringify(obj2[i])) {
            const val1 = obj1[i];
            const val2 = obj2[i];
            if ((isPlainObject(val1) && isPlainObject(val2)) || (Array.isArray(val1) && Array.isArray(val2))) {
              const nested = findDifferences(val1, val2, currentPath);
              result.added.push(...nested.added);
              result.removed.push(...nested.removed);
              result.modified.push(...nested.modified);
            } else {
              result.modified.push({ path: currentPath, old: val1, new: val2 });
            }
          }
        }
        return result;
      }

      if (isPlainObject(obj1) && isPlainObject(obj2)) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        const allKeys = new Set([...keys1, ...keys2]);

        allKeys.forEach(key => {
          const currentPath = buildPath(path, key);
          const inObj1 = keys1.includes(key);
          const inObj2 = keys2.includes(key);

          if (!inObj1 && inObj2) {
            result.added.push({ path: currentPath, value: obj2[key] });
          } else if (inObj1 && !inObj2) {
            result.removed.push({ path: currentPath, value: obj1[key] });
          } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            if ((isPlainObject(val1) && isPlainObject(val2)) || (Array.isArray(val1) && Array.isArray(val2))) {
              const nested = findDifferences(val1, val2, currentPath);
              result.added.push(...nested.added);
              result.removed.push(...nested.removed);
              result.modified.push(...nested.modified);
            } else {
              result.modified.push({ path: currentPath, old: val1, new: val2 });
            }
          }
        });
        return result;
      }

      if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
        result.modified.push({ path: path || 'root', old: obj1, new: obj2 });
      }

      return result;
    };

    setDiff(findDifferences(json1, json2));
  }, [json1, json2]);

  // Create path sets for quick lookup
  const addedPaths = useMemo(() => new Set(diff.added.map(d => d.path)), [diff.added]);
  const removedPaths = useMemo(() => new Set(diff.removed.map(d => d.path)), [diff.removed]);
  const modifiedPaths = useMemo(() => new Set(diff.modified.map(d => d.path)), [diff.modified]);

  // Synchronized scroll handler - uses percentage-based scrolling for different-sized content
  const handleScroll = useCallback((source: 'left' | 'right') => {
    if (isScrollingSyncRef.current) return;

    isScrollingSyncRef.current = true;

    const sourceEl = source === 'left' ? leftScrollRef.current : rightScrollRef.current;
    const targetEl = source === 'left' ? rightScrollRef.current : leftScrollRef.current;

    if (sourceEl && targetEl) {
      // Calculate scroll percentage for vertical scrolling
      const maxScrollTop = sourceEl.scrollHeight - sourceEl.clientHeight;
      const scrollPercentage = maxScrollTop > 0 ? sourceEl.scrollTop / maxScrollTop : 0;

      // Apply percentage to target
      const targetMaxScrollTop = targetEl.scrollHeight - targetEl.clientHeight;
      targetEl.scrollTop = scrollPercentage * targetMaxScrollTop;

      // Sync horizontal scroll directly (usually same width)
      targetEl.scrollLeft = sourceEl.scrollLeft;
    }

    // Reset flag after a short delay to allow next scroll
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false;
    });
  }, []);

  // Convert JSON to lines with paths
  const jsonToLines = (obj: unknown, prefix = '', indent = 0): { line: string; path: string; indent: number }[] => {
    const lines: { line: string; path: string; indent: number }[] = [];
    const spaces = '  '.repeat(indent);

    if (obj === null) {
      lines.push({ line: `${spaces}null`, path: prefix, indent });
    } else if (typeof obj !== 'object') {
      const value = typeof obj === 'string' ? `"${obj}"` : String(obj);
      lines.push({ line: `${spaces}${value}`, path: prefix, indent });
    } else if (Array.isArray(obj)) {
      lines.push({ line: `${spaces}[`, path: prefix, indent });
      obj.forEach((item, i) => {
        const itemPath = prefix ? `${prefix}[${i}]` : `[${i}]`;
        const itemLines = jsonToLines(item, itemPath, indent + 1);
        const lastIdx = itemLines.length - 1;
        itemLines.forEach((l, idx) => {
          if (idx === lastIdx && i < obj.length - 1) {
            lines.push({ ...l, line: l.line + ',' });
          } else {
            lines.push(l);
          }
        });
      });
      lines.push({ line: `${spaces}]`, path: prefix, indent });
    } else {
      const entries = Object.entries(obj);
      lines.push({ line: `${spaces}{`, path: prefix, indent });
      entries.forEach(([key, value], i) => {
        const keyPath = prefix ? `${prefix}.${key}` : key;
        const valueLines = jsonToLines(value, keyPath, indent + 1);
        const valueSpaces = '  '.repeat(indent + 1);

        if (valueLines.length === 1) {
          const comma = i < entries.length - 1 ? ',' : '';
          lines.push({
            line: `${valueSpaces}"${key}": ${valueLines[0].line.trim()}${comma}`,
            path: keyPath,
            indent: indent + 1
          });
        } else {
          lines.push({ line: `${valueSpaces}"${key}":`, path: keyPath, indent: indent + 1 });
          valueLines.forEach((l, idx) => {
            if (idx === valueLines.length - 1 && i < entries.length - 1) {
              lines.push({ ...l, line: l.line + ',' });
            } else {
              lines.push(l);
            }
          });
        }
      });
      lines.push({ line: `${spaces}}`, path: prefix, indent });
    }

    return lines;
  };

  const leftLines = useMemo(() => jsonToLines(json1), [json1]);
  const rightLines = useMemo(() => jsonToLines(json2), [json2]);

  // Get line style based on diff
  const getLineStyle = (path: string, side: 'left' | 'right'): string => {
    if (side === 'left') {
      if (removedPaths.has(path)) return 'bg-red-500/20 text-red-300';
      if (modifiedPaths.has(path)) return 'bg-yellow-500/20 text-yellow-300';
    } else {
      if (addedPaths.has(path)) return 'bg-green-500/20 text-green-300';
      if (modifiedPaths.has(path)) return 'bg-yellow-500/20 text-yellow-300';
    }
    return '';
  };

  const totalDiffs = diff.added.length + diff.removed.length + diff.modified.length;
  const isIdentical = totalDiffs === 0;

  return (
    <div className="p-3 md:p-4 space-y-4 font-mono text-xs sm:text-sm">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-300">
            <span className="text-green-400 font-bold">{diff.added.length}</span> added
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-300">
            <span className="text-red-400 font-bold">{diff.removed.length}</span> removed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-300">
            <span className="text-yellow-400 font-bold">{diff.modified.length}</span> modified
          </span>
        </div>
        {isIdentical && (
          <div className="flex items-center gap-2 ml-auto">
            <Check size={16} className="text-green-500" />
            <span className="text-green-400 font-semibold">Identical</span>
          </div>
        )}
      </motion.div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400 px-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300">Red</span>
          <span>= Only in JSON 1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300">Green</span>
          <span>= Only in JSON 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">Yellow</span>
          <span>= Different values</span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left JSON (JSON 1) */}
        <div className="rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center gap-2">
            <Minus size={14} className="text-red-400" />
            <span className="text-sm font-semibold text-gray-300">JSON 1</span>
          </div>
          <div
            ref={leftScrollRef}
            onScroll={() => handleScroll('left')}
            className="max-h-[500px] overflow-auto p-2"
          >
            {leftLines.map((item, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 rounded ${getLineStyle(item.path, 'left')}`}
              >
                <pre className="whitespace-pre-wrap break-all">{item.line}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* Right JSON (JSON 2) */}
        <div className="rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 flex items-center gap-2">
            <Plus size={14} className="text-green-400" />
            <span className="text-sm font-semibold text-gray-300">JSON 2</span>
          </div>
          <div
            ref={rightScrollRef}
            onScroll={() => handleScroll('right')}
            className="max-h-[500px] overflow-auto p-2"
          >
            {rightLines.map((item, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 rounded ${getLineStyle(item.path, 'right')}`}
              >
                <pre className="whitespace-pre-wrap break-all">{item.line}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Changes */}
      {totalDiffs > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <RefreshCw size={14} />
            <span>Detailed Changes</span>
          </div>

          {diff.modified.length > 0 && (
            <div className="space-y-2">
              {diff.modified.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 overflow-hidden">
                  <div className="text-yellow-300 font-semibold mb-2 break-all">{item.path}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 overflow-hidden">
                      <div className="text-red-400 font-semibold mb-1">Old:</div>
                      <div className="text-red-300 break-all whitespace-pre-wrap">{JSON.stringify(item.old)}</div>
                    </div>
                    <div className="p-2 rounded bg-green-500/10 border border-green-500/20 overflow-hidden">
                      <div className="text-green-400 font-semibold mb-1">New:</div>
                      <div className="text-green-300 break-all whitespace-pre-wrap">{JSON.stringify(item.new)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {diff.removed.length > 0 && (
            <div className="space-y-2">
              {diff.removed.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 overflow-hidden">
                  <div className="text-red-300 font-semibold break-all">{item.path}</div>
                  <div className="text-red-400 break-all whitespace-pre-wrap mt-1">{JSON.stringify(item.value)}</div>
                </div>
              ))}
            </div>
          )}

          {diff.added.length > 0 && (
            <div className="space-y-2">
              {diff.added.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 overflow-hidden">
                  <div className="text-green-300 font-semibold break-all">{item.path}</div>
                  <div className="text-green-400 break-all whitespace-pre-wrap mt-1">{JSON.stringify(item.value)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonCompare;