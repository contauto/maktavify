'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Table, FileJson, Download, Copy, Sparkles, GitCompare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/context/SettingsContext';
import JsonTreeView from '@/components/views/JsonTreeView';
import JsonTableView from '@/components/views/JsonTableView';
import JsonCompare from '@/components/views/JsonCompare';
import GraphqlCompare from '@/components/views/GraphqlCompare';
import XmlCompare from '@/components/views/XmlCompare';
import type { Mode, ViewMode, ProcessStatus, FormatOutput, CompareOutput } from '@/types';

interface OutputPanelProps {
  status: ProcessStatus;
  error: string | null;
  output: FormatOutput | CompareOutput | null;
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
  viewMode = 'tree',
  setViewMode,
  onCopy,
  onDownload,
  copied,
  mode
}) => {
  const { t } = useTranslation();
  const { themeMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();

  const isFormatOutput = (out: FormatOutput | CompareOutput | null): out is FormatOutput => {
    return out !== null && 'type' in out && 'data' in out;
  };

  const isCompareOutput = (out: FormatOutput | CompareOutput | null): out is CompareOutput => {
    return out !== null && 'compareType' in out && 'data1' in out && 'data2' in out;
  };

  return (
    <motion.div
      initial={animationsEnabled ? { x: 20, opacity: 0 } : undefined}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${status === 'error'
        ? 'border-2 border-red-500'
        : themeMode === 'dark'
          ? 'bg-gray-900 border border-gray-700'
          : 'bg-white border-2 border-gray-300'
        }`}
    >
      <div className={`min-h-[48px] md:h-14 flex flex-wrap items-center justify-between px-4 md:px-5 py-2 gap-2 ${status === 'error'
        ? 'bg-red-500/10 border-b border-red-500/30'
        : themeMode === 'dark'
          ? 'bg-gray-800 border-b border-gray-700'
          : 'bg-gray-100 border-b-2 border-gray-300'
        }`}>
        <div className="flex items-center gap-2">
          {status === 'error' ? (
            <AlertTriangle size={16} className="text-red-500 md:w-[18px] md:h-[18px]" />
          ) : mode === 'format' ? (
            <Check size={16} style={{ color: status === 'success' ? '#22c55e' : themeMode === 'dark' ? '#9ca3af' : '#6b7280' }} className="md:w-[18px] md:h-[18px]" />
          ) : (
            <GitCompare size={16} style={{ color: status === 'success' ? '#22c55e' : themeMode === 'dark' ? '#9ca3af' : '#6b7280' }} className="md:w-[18px] md:h-[18px]" />
          )}
          <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${status === 'error' ? 'text-red-500' : themeMode === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
            {status === 'error' ? t('output.error') : mode === 'format' ? t('output.title') : t('output.comparison_result')}
          </span>
        </div>
        {output && status !== 'error' && mode === 'format' && isFormatOutput(output) && (
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {output.type === 'json' && setViewMode && (
              <div className={`flex gap-1 p-0.5 md:p-1 rounded-lg ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                {(['tree', 'table', 'raw'] as ViewMode[]).map((v) => (
                  <motion.button
                    key={v}
                    whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                    onClick={() => setViewMode(v)}
                    style={viewMode === v ? getGradientStyle() : undefined}
                    className={`px-2 py-1 md:px-3 rounded text-[10px] md:text-xs font-bold uppercase ${viewMode === v
                      ? 'text-white'
                      : themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}
                  >
                    {v === 'table' && <Table size={10} className="inline mr-0.5 md:mr-1 md:w-3 md:h-3" />}
                    {v === 'raw' && <FileJson size={10} className="inline mr-0.5 md:mr-1 md:w-3 md:h-3" />}
                    <span className="hidden sm:inline">{t(`output.${v}`)}</span>
                  </motion.button>
                ))}
              </div>
            )}
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={onDownload}
              className={`p-1.5 md:p-2 rounded-lg transition-colors ${themeMode === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-200 text-gray-700'
                }`}
              aria-label={t('output.download')}
            >
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
            </motion.button>
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={onCopy}
              className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors ${copied
                ? 'bg-green-500 text-white'
                : themeMode === 'dark'
                  ? 'hover:bg-gray-700 text-gray-200'
                  : 'hover:bg-gray-200 text-gray-700'
                }`}
              aria-label={copied ? t('output.copied') : t('output.copy')}
            >
              {copied ? <Check size={14} className="md:w-4 md:h-4" /> : <Copy size={14} className="md:w-4 md:h-4" />}
              <span className="text-xs md:text-sm font-medium">{copied ? t('output.copied') : t('output.copy')}</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className={`h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-auto ${themeMode === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
        }`}>
        {status === 'error' ? (
          <motion.div
            initial={animationsEnabled ? { scale: 0.9, opacity: 0 } : undefined}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 md:p-6"
          >
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-6">
              <AlertTriangle size={36} className="text-red-500 mb-3 md:mb-4 md:w-12 md:h-12" />
              <pre className="font-mono text-xs md:text-sm text-red-500 whitespace-pre-wrap break-words">{error}</pre>
            </div>
          </motion.div>
        ) : output ? (
          <motion.div
            initial={animationsEnabled ? { scale: 0.95, opacity: 0 } : undefined}
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
                  <pre className={`p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto`} style={{ color: currentTheme.accent }}>
                    {JSON.stringify(output.data, null, 2)}
                  </pre>
                )
              ) : output.type === 'graphql' ? (
                <pre className={`p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto`} style={{ color: currentTheme.accent }}>
                  {String(output.data)}
                </pre>
              ) : output.type === 'xml' ? (
                <pre className={`p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto`} style={{ color: currentTheme.accent }}>
                  {String(output.data)}
                </pre>
              ) : null
            ) : isCompareOutput(output) ? (
              output.compareType === 'json' ? (
                <JsonCompare json1={output.data1} json2={output.data2} />
              ) : output.compareType === 'graphql' ? (
                <GraphqlCompare graphql1={String(output.data1)} graphql2={String(output.data2)} />
              ) : (
                <XmlCompare xml1={String(output.data1)} xml2={String(output.data2)} />
              )
            ) : null}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 md:gap-4 px-4">
            <motion.div
              animate={animationsEnabled ? (mode === 'format' ? { rotate: 360 } : { scale: [1, 1.2, 1] }) : undefined}
              transition={mode === 'format' ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity }}
              className="p-4 md:p-6 rounded-full"
              style={{ background: `linear-gradient(to bottom right, ${currentTheme.primaryFrom}33, ${currentTheme.primaryTo}33)` }}
            >
              {mode === 'format' ? (
                <Sparkles size={24} style={{ color: currentTheme.accent }} className="md:w-8 md:h-8" />
              ) : (
                <GitCompare size={24} style={{ color: currentTheme.accent }} className="md:w-8 md:h-8" />
              )}
            </motion.div>
            <p className={`text-base md:text-lg font-semibold text-center ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {mode === 'format' ? t('output.ready_format') : t('output.ready_compare')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OutputPanel;