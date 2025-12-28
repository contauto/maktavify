import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Table, FileJson, Download, Copy, Sparkles, GitCompare } from 'lucide-react';
import JsonTreeView from '@/components/views/JsonTreeView';
import JsonTableView from '@/components/views/JsonTableView';
import JsonCompare from '@/components/views/JsonCompare';
import type { Theme, Mode, ViewMode, ProcessStatus, FormatOutput, CompareOutput } from '@/types';

interface OutputPanelProps {
  status: ProcessStatus;
  error: string | null;
  output: FormatOutput | CompareOutput | null;
  theme: Theme;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;
  onCopy?: () => void;
  onDownload?: () => void;
  copied?: boolean;
  mode: Mode;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
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
}) => {
  /** Type guard to check if output is FormatOutput */
  const isFormatOutput = (out: FormatOutput | CompareOutput | null): out is FormatOutput => {
    return out !== null && 'type' in out && 'data' in out;
  };

  /** Type guard to check if output is CompareOutput */
  const isCompareOutput = (out: FormatOutput | CompareOutput | null): out is CompareOutput => {
    return out !== null && 'json1' in out && 'json2' in out;
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${status === 'error'
        ? 'border-2 border-red-500'
        : theme === 'dark' ? 'bg-gray-900/50 backdrop-blur border border-gray-800' : 'bg-white border border-gray-200'
        }`}
    >
      <div className={`min-h-[48px] md:h-14 flex flex-wrap items-center justify-between px-4 md:px-5 py-2 gap-2 ${status === 'error'
        ? 'bg-red-500/10 border-b border-red-500/30'
        : theme === 'dark' ? 'bg-gray-800/50 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'
        }`}>
        <div className="flex items-center gap-2">
          {status === 'error' ? (
            <AlertTriangle size={16} className="text-red-500 md:w-[18px] md:h-[18px]" />
          ) : mode === 'format' ? (
            <Check size={16} className={`${status === 'success' ? 'text-green-500' : 'text-gray-500'} md:w-[18px] md:h-[18px]`} />
          ) : (
            <GitCompare size={16} className={`${status === 'success' ? 'text-green-500' : 'text-gray-500'} md:w-[18px] md:h-[18px]`} />
          )}
          <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
            {status === 'error' ? 'Error' : mode === 'format' ? 'Output' : 'Comparison Result'}
          </span>
        </div>
        {output && status !== 'error' && mode === 'format' && isFormatOutput(output) && (
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {output.type === 'json' && setViewMode && (
              <div className={`flex gap-1 p-0.5 md:p-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                {(['tree', 'table', 'raw'] as ViewMode[]).map((v) => (
                  <motion.button
                    key={v}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(v)}
                    className={`px-2 py-1 md:px-3 rounded text-[10px] md:text-xs font-bold uppercase ${viewMode === v
                      ? 'bg-indigo-600 text-white'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    {v === 'table' && <Table size={10} className="inline mr-0.5 md:mr-1 md:w-3 md:h-3" />}
                    {v === 'raw' && <FileJson size={10} className="inline mr-0.5 md:mr-1 md:w-3 md:h-3" />}
                    <span className="hidden sm:inline">{v}</span>
                  </motion.button>
                ))}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className={`p-1.5 md:p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              aria-label="Download formatted output"
            >
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopy}
              className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            >
              {copied ? <Check size={14} className="md:w-4 md:h-4" /> : <Copy size={14} className="md:w-4 md:h-4" />}
              <span className="text-xs md:text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-auto">
        {status === 'error' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 md:p-6"
          >
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <AlertTriangle size={36} className="text-red-500 mb-3 md:mb-4 md:w-12 md:h-12" />
              <pre className="font-mono text-xs md:text-sm text-red-400 whitespace-pre-wrap break-words">{error}</pre>
            </div>
          </motion.div>
        ) : output ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full"
          >
            {mode === 'format' && isFormatOutput(output) ? (
              output.type === 'json' ? (
                viewMode === 'tree' ? (
                  <JsonTreeView data={output.data} />
                ) : viewMode === 'table' ? (
                  <JsonTableView data={output.data} />
                ) : (
                  <pre className={`p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {JSON.stringify(output.data, null, 2)}
                  </pre>
                )
              ) : output.type === 'graphql' ? (
                <pre className={`p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {String(output.data)}
                </pre>
              ) : null
            ) : isCompareOutput(output) ? (
              <JsonCompare json1={output.json1} json2={output.json2} />
            ) : null}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 md:gap-4 px-4">
            <motion.div
              animate={mode === 'format' ? { rotate: 360 } : { scale: [1, 1.2, 1] }}
              transition={mode === 'format' ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
              className={`p-4 md:p-6 rounded-full ${mode === 'format' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'}`}
            >
              {mode === 'format' ? <Sparkles size={24} className="md:w-8 md:h-8" /> : <GitCompare size={24} className="md:w-8 md:h-8" />}
            </motion.div>
            <p className="text-base md:text-lg font-semibold text-center">{mode === 'format' ? 'Ready to format' : 'Ready to compare'}</p>
          </div>
        )}
      </div>
    </motion.div >
  );
};

export default OutputPanel;