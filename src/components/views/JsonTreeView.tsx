import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleNodeProps {
  nodeKey?: string;
  value: any;
  depth?: number;
  isLast?: boolean;
  expandAll?: boolean;
}

const CollapsibleNodeExpanded = ({ value, depth = 0, expandAll, nodeKey, isLast }: CollapsibleNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(expandAll);

  React.useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  const indent = depth * 16;

  if (value === null) {
    return (
      <span style={{ marginLeft: nodeKey ? 0 : `${indent}px` }}>
        {nodeKey && <><span className="text-cyan-400">"{nodeKey}"</span><span className="text-gray-500">: </span></>}
        <span className="text-orange-500">null</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </span>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <span style={{ marginLeft: nodeKey ? 0 : `${indent}px` }}>
        {nodeKey && <><span className="text-cyan-400">"{nodeKey}"</span><span className="text-gray-500">: </span></>}
        <span className="text-purple-500">{value.toString()}</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </span>
    );
  }

  if (typeof value === 'number') {
    return (
      <span style={{ marginLeft: nodeKey ? 0 : `${indent}px` }}>
        {nodeKey && <><span className="text-cyan-400">"{nodeKey}"</span><span className="text-gray-500">: </span></>}
        <span className="text-blue-500">{value}</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </span>
    );
  }

  if (typeof value === 'string') {
    return (
      <span style={{ marginLeft: nodeKey ? 0 : `${indent}px` }} className="whitespace-nowrap">
        {nodeKey && <><span className="text-cyan-400">"{nodeKey}"</span><span className="text-gray-500">: </span></>}
        <span className="text-green-500">"{value}"</span>
        {!isLast && <span className="text-gray-500">,</span>}
      </span>
    );
  }

  if (Array.isArray(value)) {
    const isEmpty = value.length === 0;

    return (
      <div style={{ marginLeft: nodeKey ? 0 : `${indent}px` }}>
        <div className="flex items-start">
          {!isEmpty && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </motion.button>
          )}
          <div className="flex-1 whitespace-nowrap">
            {nodeKey && (
              <>
                <span className="text-cyan-400">"{nodeKey}"</span>
                <span className="text-gray-500">: </span>
              </>
            )}
            <span className="text-gray-500">[</span>
            {isEmpty && <span className="text-gray-500">]</span>}
            {!isEmpty && !isExpanded && (
              <span className="text-gray-600 italic ml-2">
                {value.length} {value.length === 1 ? 'item' : 'items'}
                <span className="text-gray-500 ml-1">]</span>
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && !isEmpty && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-3 md:ml-4 border-l-2 border-gray-700/30 pl-1.5 md:pl-2">
                {value.map((item, i) => (
                  <div key={i}>
                    <CollapsibleNodeExpanded value={item} depth={depth + 1} expandAll={expandAll} isLast={i === value.length - 1} />
                  </div>
                ))}
              </div>
              <span className="text-gray-500">]</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    const isEmpty = entries.length === 0;

    return (
      <div style={{ marginLeft: nodeKey ? 0 : `${indent}px` }}>
        <div className="flex items-start">
          {!isEmpty && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </motion.button>
          )}
          <div className="flex-1 whitespace-nowrap">
            {nodeKey && (
              <>
                <span className="text-cyan-400">"{nodeKey}"</span>
                <span className="text-gray-500">: </span>
              </>
            )}
            <span className="text-gray-500">{'{'}</span>
            {isEmpty && <span className="text-gray-500">{'}'}</span>}
            {!isEmpty && !isExpanded && (
              <span className="text-gray-600 italic ml-2">
                {entries.length} {entries.length === 1 ? 'property' : 'properties'}
                <span className="text-gray-500 ml-1">{'}'}</span>
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && !isEmpty && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-3 md:ml-4 border-l-2 border-gray-700/30 pl-1.5 md:pl-2">
                {entries.map(([key, val], i) => (
                  <div key={key}>
                    <CollapsibleNodeExpanded nodeKey={key} value={val} depth={depth + 1} expandAll={expandAll} isLast={i === entries.length - 1} />
                  </div>
                ))}
              </div>
              <span className="text-gray-500">{'}'}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }

  return <span className="break-all">{String(value)}</span>;
};

const JsonTreeView = ({ data }: { data: any }) => {
  const [expandAll, setExpandAll] = useState(true);
  const [key, setKey] = useState(0);

  const handleExpandAll = () => {
    setExpandAll(true);
    setKey(prev => prev + 1);
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="font-mono text-xs sm:text-sm p-3 md:p-4">
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4 pb-2 md:pb-3 border-b border-gray-700/30">
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
      <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        <div className="min-w-fit">
          <CollapsibleNodeExpanded key={key} value={data} expandAll={expandAll} isLast={true} />
        </div>
      </div>
    </div>
  );
};

export default JsonTreeView;