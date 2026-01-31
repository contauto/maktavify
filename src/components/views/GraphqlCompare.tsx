import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Check, Minus, Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

interface DiffItem {
    path: string;
    value?: string;
    old?: string;
    new?: string;
}

interface DiffResult {
    added: DiffItem[];
    removed: DiffItem[];
    modified: DiffItem[];
}

interface GraphqlCompareProps {
    graphql1: string;
    graphql2: string;
}

/**
 * Side-by-side GraphQL comparison with colorized differences and synchronized scrolling
 */
const GraphqlCompare: React.FC<GraphqlCompareProps> = ({ graphql1, graphql2 }) => {
    const { themeMode } = useSettings();
    const leftScrollRef = useRef<HTMLDivElement>(null);
    const rightScrollRef = useRef<HTMLDivElement>(null);
    const isScrollingSyncRef = useRef(false);

    const [diff, setDiff] = useState<DiffResult>({
        added: [],
        removed: [],
        modified: []
    });

    // Parse GraphQL to lines
    const graphqlToLines = (graphql: string): string[] => {
        return graphql.split('\n').map(line => line).filter(line => line.trim());
    };

    const leftLines = useMemo(() => graphqlToLines(graphql1), [graphql1]);
    const rightLines = useMemo(() => graphqlToLines(graphql2), [graphql2]);

    // Compute diff using line comparison
    useEffect(() => {
        if (!graphql1 || !graphql2) return;

        const lines1 = leftLines;
        const lines2 = rightLines;

        const result: DiffResult = { added: [], removed: [], modified: [] };

        const matched1 = new Set<number>();
        const matched2 = new Set<number>();

        // First pass: find exact matches
        for (let i = 0; i < lines1.length; i++) {
            for (let j = 0; j < lines2.length; j++) {
                if (!matched2.has(j) && lines1[i].trim() === lines2[j].trim()) {
                    matched1.add(i);
                    matched2.add(j);
                    break;
                }
            }
        }

        // Mark unmatched lines
        for (let i = 0; i < lines1.length; i++) {
            if (!matched1.has(i)) {
                result.removed.push({ path: `line-${i + 1}`, value: lines1[i] });
            }
        }

        for (let j = 0; j < lines2.length; j++) {
            if (!matched2.has(j)) {
                result.added.push({ path: `line-${j + 1}`, value: lines2[j] });
            }
        }

        setDiff(result);
    }, [graphql1, graphql2, leftLines, rightLines]);

    // Synchronized scroll handler
    const handleScroll = useCallback((source: 'left' | 'right') => {
        if (isScrollingSyncRef.current) return;
        isScrollingSyncRef.current = true;

        const sourceEl = source === 'left' ? leftScrollRef.current : rightScrollRef.current;
        const targetEl = source === 'left' ? rightScrollRef.current : leftScrollRef.current;

        if (sourceEl && targetEl) {
            const maxScrollTop = sourceEl.scrollHeight - sourceEl.clientHeight;
            const scrollPercentage = maxScrollTop > 0 ? sourceEl.scrollTop / maxScrollTop : 0;
            const targetMaxScrollTop = targetEl.scrollHeight - targetEl.clientHeight;
            targetEl.scrollTop = scrollPercentage * targetMaxScrollTop;
            targetEl.scrollLeft = sourceEl.scrollLeft;
        }

        requestAnimationFrame(() => {
            isScrollingSyncRef.current = false;
        });
    }, []);

    // Create sets for quick lookup
    const removedLines = useMemo(() => new Set(diff.removed.map(d => d.value?.trim())), [diff.removed]);
    const addedLines = useMemo(() => new Set(diff.added.map(d => d.value?.trim())), [diff.added]);

    // Get line style based on diff
    const getLineStyle = (line: string, side: 'left' | 'right'): string => {
        const isDark = themeMode === 'dark';
        if (side === 'left' && removedLines.has(line.trim())) {
            return isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700';
        }
        if (side === 'right' && addedLines.has(line.trim())) {
            return isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700';
        }
        return isDark ? 'text-gray-300' : 'text-gray-700';
    };

    const totalDiffs = diff.added.length + diff.removed.length + diff.modified.length;
    const isIdentical = totalDiffs === 0;

    const bgClass = themeMode === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100';
    const borderClass = themeMode === 'dark' ? 'border-gray-700/50' : 'border-gray-300';
    const textClass = themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700';

    return (
        <div className="p-3 md:p-4 space-y-4 font-mono text-xs sm:text-sm">
            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-wrap gap-3 p-3 rounded-xl ${bgClass} border ${borderClass}`}
            >
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className={textClass}>
                        <span className="text-green-500 font-bold">{diff.added.length}</span> added
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className={textClass}>
                        <span className="text-red-500 font-bold">{diff.removed.length}</span> removed
                    </span>
                </div>
                {isIdentical && (
                    <div className="flex items-center gap-2 ml-auto">
                        <Check size={16} className="text-green-500" />
                        <span className="text-green-500 font-semibold">Identical</span>
                    </div>
                )}
            </motion.div>

            {/* Color Legend */}
            <div className={`flex flex-wrap gap-4 text-xs ${textClass} px-2`}>
                <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded ${themeMode === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>Red</span>
                    <span>= Only in GraphQL 1</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded ${themeMode === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>Green</span>
                    <span>= Only in GraphQL 2</span>
                </div>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left GraphQL (GraphQL 1) */}
                <div className={`rounded-xl border ${borderClass} overflow-hidden`}>
                    <div className={`px-4 py-2 ${bgClass} border-b ${borderClass} flex items-center gap-2`}>
                        <Minus size={14} className="text-red-500" />
                        <span className={`text-sm font-semibold ${textClass}`}>GraphQL 1</span>
                    </div>
                    <div
                        ref={leftScrollRef}
                        onScroll={() => handleScroll('left')}
                        className="max-h-[500px] overflow-auto p-2"
                    >
                        {leftLines.map((line, i) => (
                            <div
                                key={i}
                                className={`px-2 py-0.5 rounded ${getLineStyle(line, 'left')}`}
                            >
                                <pre className="whitespace-pre-wrap break-all">{line}</pre>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right GraphQL (GraphQL 2) */}
                <div className={`rounded-xl border ${borderClass} overflow-hidden`}>
                    <div className={`px-4 py-2 ${bgClass} border-b ${borderClass} flex items-center gap-2`}>
                        <Plus size={14} className="text-green-500" />
                        <span className={`text-sm font-semibold ${textClass}`}>GraphQL 2</span>
                    </div>
                    <div
                        ref={rightScrollRef}
                        onScroll={() => handleScroll('right')}
                        className="max-h-[500px] overflow-auto p-2"
                    >
                        {rightLines.map((line, i) => (
                            <div
                                key={i}
                                className={`px-2 py-0.5 rounded ${getLineStyle(line, 'right')}`}
                            >
                                <pre className="whitespace-pre-wrap break-all">{line}</pre>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Changes */}
            {totalDiffs > 0 && (
                <div className="space-y-3 mt-4">
                    <div className={`flex items-center gap-2 text-sm font-semibold ${textClass}`}>
                        <RefreshCw size={14} />
                        <span>Detailed Changes</span>
                    </div>

                    {diff.removed.length > 0 && (
                        <div className="space-y-2">
                            {diff.removed.map((item, i) => (
                                <div key={i} className={`p-3 rounded-lg ${themeMode === 'dark' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'} overflow-hidden`}>
                                    <div className={`font-semibold break-all ${themeMode === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{item.path}</div>
                                    <div className={`break-all whitespace-pre-wrap mt-1 ${themeMode === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {diff.added.length > 0 && (
                        <div className="space-y-2">
                            {diff.added.map((item, i) => (
                                <div key={i} className={`p-3 rounded-lg ${themeMode === 'dark' ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'} overflow-hidden`}>
                                    <div className={`font-semibold break-all ${themeMode === 'dark' ? 'text-green-300' : 'text-green-700'}`}>{item.path}</div>
                                    <div className={`break-all whitespace-pre-wrap mt-1 ${themeMode === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GraphqlCompare;
