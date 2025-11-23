import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Table, FileJson, Download, Copy, Sparkles, GitCompare } from 'lucide-react';
import JsonTreeView from '@/components/views/JsonTreeView';
import JsonTableView from '@/components/views/JsonTableView';
import JsonCompare from '@/components/views/JsonCompare';

interface OutputPanelProps {
  status: string;
  error: string | null;
  output: any;
  theme: string;
  viewMode?: string;
  setViewMode?: (mode: string) => void;
  onCopy?: () => void;
  onDownload?: () => void;
  copied?: boolean;
  mode: string;
}

const OutputPanel = ({ 
  status, 
  error, 
  output, 
  theme, 
  viewMode = 'tree', 
  setViewMode, 
  onCopy, 
  onDownload, 
  copied,
  mode
}: OutputPanelProps) => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-3xl overflow-hidden shadow-2xl ${
        status === 'error' 
          ? 'border-2 border-red-500' 
          : theme === 'dark' ? 'bg-gray-900/50 backdrop-blur border border-gray-800' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`h-14 flex items-center justify-between px-5 ${
        status === 'error' 
          ? 'bg-red-500/10 border-b border-red-500/30' 
          : theme === 'dark' ? 'bg-gray-800/50 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          {status === 'error' ? (
            <AlertTriangle size={18} className="text-red-500" />
          ) : mode === 'format' ? (
            <Check size={18} className={status === 'success' ? 'text-green-500' : 'text-gray-500'} />
          ) : (
            <GitCompare size={18} className={status === 'success' ? 'text-green-500' : 'text-gray-500'} />
          )}
          <span className="text-sm font-bold uppercase tracking-wider">
            {status === 'error' ? 'Error' : mode === 'format' ? 'Output' : 'Comparison Result'}
          </span>
        </div>
        {output && status !== 'error' && mode === 'format' && (
          <div className="flex gap-2">
            {output.type === 'json' && setViewMode && (
              <div className={`flex gap-1 p-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                {['tree', 'table', 'raw'].map((v) => (
                  <motion.button
                    key={v}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                      viewMode === v
                        ? 'bg-indigo-600 text-white'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {v === 'table' && <Table size={12} className="inline mr-1" />}
                    {v === 'raw' && <FileJson size={12} className="inline mr-1" />}
                    {v}
                  </motion.button>
                ))}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <Download size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                copied ? 'bg-green-500 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="h-[600px] overflow-auto">
        {status === 'error' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6"
          >
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
              <AlertTriangle size={48} className="text-red-500 mb-4" />
              <pre className="font-mono text-sm text-red-400 whitespace-pre-wrap">{error}</pre>
            </div>
          </motion.div>
        ) : output ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full"
          >
            {mode === 'format' ? (
              output.type === 'json' ? (
                viewMode === 'tree' ? (
                  <JsonTreeView data={output.data} />
                ) : viewMode === 'table' ? (
                  <JsonTableView data={output.data} />
                ) : (
                  <pre className={`p-6 font-mono text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {JSON.stringify(output.data, null, 2)}
                  </pre>
                )
              ) : output.type === 'graphql' ? (
                <pre className={`p-6 font-mono text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {output.data}
                </pre>
              ) : null
            ) : (
              <JsonCompare json1={output.json1} json2={output.json2} />
            )}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
            <motion.div
              animate={mode === 'format' ? { rotate: 360 } : { scale: [1, 1.2, 1] }}
              transition={mode === 'format' ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
              className={`p-6 rounded-full ${mode === 'format' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'}`}
            >
              {mode === 'format' ? <Sparkles size={32} /> : <GitCompare size={32} />}
            </motion.div>
            <p className="text-lg font-semibold">{mode === 'format' ? 'Ready to format' : 'Ready to compare'}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OutputPanel;