import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiffItem {
  path: string;
  value?: any;
  old?: any;
  new?: any;
}

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
    <div className="p-3 md:p-4 space-y-3 md:space-y-4 font-mono text-xs sm:text-sm">
      <div className="flex flex-wrap gap-1.5 md:gap-2 pb-2 md:pb-3 border-b border-gray-700/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpandAll}
          className="px-2.5 py-1 md:px-3 md:py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <ChevronDown size={12} className="md:w-[14px] md:h-[14px]" />
          <span>Expand All</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCollapseAll}
          className="px-2.5 py-1 md:px-3 md:py-1.5 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <ChevronRight size={12} className="md:w-[14px] md:h-[14px]" />
          <span>Collapse All</span>
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
        className="text-center py-6 md:py-8 text-gray-500"
      >
        <Check size={36} className="mx-auto mb-2 text-green-500 md:w-12 md:h-12" />
        <p className="text-base md:text-lg font-semibold">Identical JSON objects</p>
      </motion.div>
    );
  }

  return (
    <>
      {diff.added.length > 0 && (
        <div className="space-y-1.5 md:space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setAddedExpanded(!addedExpanded)}
            className="w-full text-green-400 font-bold flex items-center gap-1.5 md:gap-2 p-2 md:p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
          >
            {addedExpanded ? <ChevronDown size={16} className="md:w-5 md:h-5" /> : <ChevronRight size={16} className="md:w-5 md:h-5" />}
            <span className="text-base md:text-xl">+</span>
            <span className="text-xs md:text-sm">Added ({diff.added.length})</span>
          </motion.button>

          <AnimatePresence>
            {addedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-1.5 md:space-y-2"
              >
                {diff.added.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-green-500/15 transition-colors"
                  >
                    <div className="break-all">
                      <span className="text-green-300 font-semibold">{item.path}</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-green-400">{JSON.stringify(item.value)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {diff.removed.length > 0 && (
        <div className="space-y-1.5 md:space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setRemovedExpanded(!removedExpanded)}
            className="w-full text-red-400 font-bold flex items-center gap-1.5 md:gap-2 p-2 md:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            {removedExpanded ? <ChevronDown size={16} className="md:w-5 md:h-5" /> : <ChevronRight size={16} className="md:w-5 md:h-5" />}
            <span className="text-base md:text-xl">-</span>
            <span className="text-xs md:text-sm">Removed ({diff.removed.length})</span>
          </motion.button>

          <AnimatePresence>
            {removedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-1.5 md:space-y-2"
              >
                {diff.removed.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-red-500/15 transition-colors"
                  >
                    <div className="break-all">
                      <span className="text-red-300 font-semibold">{item.path}</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-red-400">{JSON.stringify(item.value)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {diff.modified.length > 0 && (
        <div className="space-y-1.5 md:space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setModifiedExpanded(!modifiedExpanded)}
            className="w-full text-yellow-400 font-bold flex items-center gap-1.5 md:gap-2 p-2 md:p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
          >
            {modifiedExpanded ? <ChevronDown size={16} className="md:w-5 md:h-5" /> : <ChevronRight size={16} className="md:w-5 md:h-5" />}
            <span className="text-base md:text-xl">~</span>
            <span className="text-xs md:text-sm">Modified ({diff.modified.length})</span>
          </motion.button>

          <AnimatePresence>
            {modifiedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-1.5 md:space-y-2"
              >
                {diff.modified.map((item: DiffItem, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg md:rounded-xl p-2 md:p-3 space-y-1.5 md:space-y-2 hover:bg-yellow-500/15 transition-colors"
                  >
                    <div className="text-yellow-300 font-semibold break-all">{item.path}</div>
                    <div className="ml-2 md:ml-4 space-y-1">
                      <div className="text-red-400 flex items-start gap-1.5 md:gap-2 break-all">
                        <span className="text-red-500 font-bold flex-shrink-0">-</span>
                        <span>{JSON.stringify(item.old)}</span>
                      </div>
                      <div className="text-green-400 flex items-start gap-1.5 md:gap-2 break-all">
                        <span className="text-green-500 font-bold flex-shrink-0">+</span>
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