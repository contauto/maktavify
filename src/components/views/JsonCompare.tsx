import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiffItem {
  path: string;
  value?: any;
  old?: any;
  new?: any;
}

interface CollapsibleSectionProps {
  title: string;
  count: number;
  color: 'green' | 'red' | 'yellow';
  icon: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, count, color, icon, children }: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const colorClasses = {
    green: {
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    red: {
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30'
    },
    yellow: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="space-y-2">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full ${colors.text} font-bold flex items-center gap-2 p-2 rounded-lg ${colors.bg} hover:${colors.bg} transition-colors`}
      >
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        <span className="text-xl">{icon}</span>
        {title} ({count})
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JsonCompare = ({ json1, json2 }: { json1: any; json2: any }) => {
  const [diff, setDiff] = useState<{ added: DiffItem[]; removed: DiffItem[]; modified: DiffItem[] }>({ 
    added: [], 
    removed: [], 
    modified: [] 
  });
  const [expandAll, setExpandAll] = useState(true);

  useEffect(() => {
    if (!json1 || !json2) return;

    const findDifferences = (obj1: any, obj2: any, path = '') => {
      const result: any = { added: [], removed: [], modified: [] };

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      keys2.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        if (!keys1.includes(key)) {
          result.added.push({ path: currentPath, value: obj2[key] });
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
            const nested = findDifferences(obj1[key], obj2[key], currentPath);
            result.added.push(...nested.added);
            result.removed.push(...nested.removed);
            result.modified.push(...nested.modified);
          } else {
            result.modified.push({ path: currentPath, old: obj1[key], new: obj2[key] });
          }
        }
      });

      keys1.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        if (!keys2.includes(key)) {
          result.removed.push({ path: currentPath, value: obj1[key] });
        }
      });

      return result;
    };

    setDiff(findDifferences(json1, json2));
  }, [json1, json2]);

  useEffect(() => {
    setExpandAll(true);
  }, [diff]);

  const handleExpandAll = () => setExpandAll(true);
  const handleCollapseAll = () => setExpandAll(false);

  return (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="flex gap-2 pb-3 border-b border-gray-700/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpandAll}
          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <ChevronDown size={14} />
          Expand All
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCollapseAll}
          className="px-3 py-1.5 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <ChevronRight size={14} />
          Collapse All
        </motion.button>
      </div>

      <CollapsibleSectionWrapper 
        key={expandAll ? 'expanded' : 'collapsed'}
        expandAll={expandAll}
        diff={diff}
      />
    </div>
  );
};

const CollapsibleSectionWrapper = ({ expandAll, diff }: { expandAll: boolean; diff: any }) => {
  const [addedExpanded, setAddedExpanded] = useState(expandAll);
  const [removedExpanded, setRemovedExpanded] = useState(expandAll);
  const [modifiedExpanded, setModifiedExpanded] = useState(expandAll);

  useEffect(() => {
    setAddedExpanded(expandAll);
    setRemovedExpanded(expandAll);
    setModifiedExpanded(expandAll);
  }, [expandAll]);

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8 text-gray-500"
      >
        <Check size={48} className="mx-auto mb-2 text-green-500" />
        <p className="text-lg font-semibold">Identical JSON objects</p>
      </motion.div>
    );
  }

  return (
    <>
      {diff.added.length > 0 && (
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAddedExpanded(!addedExpanded)}
            className="w-full text-green-400 font-bold flex items-center gap-2 p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
          >
            {addedExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span className="text-xl">+</span>
            Added ({diff.added.length})
          </motion.button>

          <AnimatePresence>
            {addedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2"
              >
                {diff.added.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-green-500/10 border border-green-500/30 rounded p-3 hover:bg-green-500/15 transition-colors"
                  >
                    <span className="text-green-300 font-semibold">{item.path}</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-green-400">{JSON.stringify(item.value)}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {diff.removed.length > 0 && (
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setRemovedExpanded(!removedExpanded)}
            className="w-full text-red-400 font-bold flex items-center gap-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            {removedExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span className="text-xl">-</span>
            Removed ({diff.removed.length})
          </motion.button>

          <AnimatePresence>
            {removedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2"
              >
                {diff.removed.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-red-500/10 border border-red-500/30 rounded p-3 hover:bg-red-500/15 transition-colors"
                  >
                    <span className="text-red-300 font-semibold">{item.path}</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-red-400">{JSON.stringify(item.value)}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {diff.modified.length > 0 && (
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setModifiedExpanded(!modifiedExpanded)}
            className="w-full text-yellow-400 font-bold flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
          >
            {modifiedExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span className="text-xl">~</span>
            Modified ({diff.modified.length})
          </motion.button>

          <AnimatePresence>
            {modifiedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2"
              >
                {diff.modified.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 space-y-2 hover:bg-yellow-500/15 transition-colors"
                  >
                    <div className="text-yellow-300 font-semibold">{item.path}</div>
                    <div className="ml-4 space-y-1">
                      <div className="text-red-400 flex items-start gap-2">
                        <span className="text-red-500 font-bold">-</span>
                        <span>{JSON.stringify(item.old)}</span>
                      </div>
                      <div className="text-green-400 flex items-start gap-2">
                        <span className="text-green-500 font-bold">+</span>
                        <span>{JSON.stringify(item.new)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default JsonCompare;