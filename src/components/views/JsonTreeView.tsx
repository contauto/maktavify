import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleNodeProps {
  nodeKey?: string;
  value: any;
  depth?: number;
  isLast?: boolean;
}

const CollapsibleNode = ({ nodeKey, value, depth = 0, isLast = false }: CollapsibleNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const indent = depth * 20;

  if (value === null) {
    return <span className="text-orange-500">null</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-purple-500">{value.toString()}</span>;
  }

  if (typeof value === 'number') {
    return <span className="text-blue-500">{value}</span>;
  }

  if (typeof value === 'string') {
    return <span className="text-green-500">"{value}"</span>;
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
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </motion.button>
          )}
          <div className="flex-1">
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
              <div className="ml-4 border-l-2 border-gray-700/30 pl-2">
                {value.map((item, i) => (
                  <div key={i}>
                    <CollapsibleNode value={item} depth={depth + 1} isLast={i === value.length - 1} />
                    {i < value.length - 1 && <span className="text-gray-500">,</span>}
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
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </motion.button>
          )}
          <div className="flex-1">
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
              <div className="ml-4 border-l-2 border-gray-700/30 pl-2">
                {entries.map(([key, val], i) => (
                  <div key={key}>
                    <CollapsibleNode nodeKey={key} value={val} depth={depth + 1} isLast={i === entries.length - 1} />
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

  return <span>{String(value)}</span>;
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
    <div className="font-mono text-sm p-4">
      <div className="flex gap-2 mb-4 pb-3 border-b border-gray-700/30">
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
      <CollapsibleNodeWithReset key={key} data={data} expandAll={expandAll} />
    </div>
  );
};

const CollapsibleNodeWithReset = ({ data, expandAll }: { data: any; expandAll: boolean }) => {
  return <CollapsibleNodeExpanded value={data} depth={0} expandAll={expandAll} />;
};

const CollapsibleNodeExpanded = ({ value, depth = 0, expandAll }: { value: any; depth?: number; expandAll: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(expandAll);

  React.useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  const indent = depth * 20;

  if (value === null) {
    return <span className="text-orange-500">null</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-purple-500">{value.toString()}</span>;
  }

  if (typeof value === 'number') {
    return <span className="text-blue-500">{value}</span>;
  }

  if (typeof value === 'string') {
    return <span className="text-green-500">"{value}"</span>;
  }

  if (Array.isArray(value)) {
    const isEmpty = value.length === 0;
    
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div className="flex items-start">
          {!isEmpty && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </motion.button>
          )}
          <div className="flex-1">
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
              <div className="ml-4 border-l-2 border-gray-700/30 pl-2">
                {value.map((item, i) => (
                  <div key={i}>
                    <CollapsibleNodeExpanded value={item} depth={depth + 1} expandAll={expandAll} />
                    {i < value.length - 1 && <span className="text-gray-500">,</span>}
                  </div>
                ))}
              </div>
              <span className="text-gray-500">]</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    const isEmpty = entries.length === 0;

    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div className="flex items-start">
          {!isEmpty && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-1 mt-0.5 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </motion.button>
          )}
          <div className="flex-1">
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
              <div className="ml-4 border-l-2 border-gray-700/30 pl-2">
                {entries.map(([key, val], i) => (
                  <div key={key}>
                    <span className="text-cyan-400">"{key}"</span>
                    <span className="text-gray-500">: </span>
                    <CollapsibleNodeExpanded value={val} depth={depth + 1} expandAll={expandAll} />
                    {i < entries.length - 1 && <span className="text-gray-500">,</span>}
                  </div>
                ))}
              </div>
              <span className="text-gray-500">{'}'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

export default JsonTreeView;