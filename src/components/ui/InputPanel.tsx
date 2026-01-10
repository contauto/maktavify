'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Code2, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/context/SettingsContext';
import type { ActiveTab } from '@/types';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeTab?: ActiveTab;
  placeholder?: string;
  initialX?: number;
}

const InputPanel: React.FC<InputPanelProps> = ({
  label,
  value,
  onChange,
  onClear,
  onUpload,
  activeTab,
  placeholder,
  initialX = -20
}) => {
  const { t } = useTranslation();
  const { themeMode, animationsEnabled, currentTheme } = useSettings();

  return (
    <motion.div
      initial={animationsEnabled ? { x: initialX, opacity: 0 } : undefined}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${themeMode === 'dark'
        ? 'bg-gray-900 border border-gray-700'
        : 'bg-white border-2 border-gray-300'
        }`}
    >
      <div className={`h-12 md:h-14 flex items-center justify-between px-4 md:px-5 ${themeMode === 'dark'
        ? 'bg-gray-800 border-b border-gray-700'
        : 'bg-gray-100 border-b-2 border-gray-300'
        }`}>
        <div className="flex items-center gap-2">
          {activeTab === 'json' ? (
            <Code2 size={16} className="md:w-[18px] md:h-[18px]" style={{ color: currentTheme.accent }} />
          ) : (
            <Database size={16} className="md:w-[18px] md:h-[18px]" style={{ color: currentTheme.accent }} />
          )}
          <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>{label}</span>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <label
            className={`p-1.5 md:p-2 rounded-lg cursor-pointer transition-colors ${themeMode === 'dark'
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-200 text-gray-700'
              }`}
            aria-label={t('input.upload')}
          >
            <Upload size={16} className="md:w-[18px] md:h-[18px]" />
            <input type="file" accept=".json,.graphql,.txt" onChange={onUpload} className="hidden" aria-label="File upload input" />
          </label>
          <motion.button
            whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
            onClick={onClear}
            className={`p-1.5 md:p-2 rounded-lg transition-colors ${themeMode === 'dark'
              ? 'hover:bg-red-500/20 text-red-400'
              : 'hover:bg-red-100 text-red-600'
              }`}
            aria-label={t('input.clear')}
          >
            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
          </motion.button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] p-4 md:p-6 font-mono text-xs sm:text-sm resize-none focus:outline-none ${themeMode === 'dark'
          ? 'bg-gray-950 text-gray-100 placeholder-gray-500'
          : 'bg-gray-50 text-gray-900 placeholder-gray-500'
          }`}
        style={{ caretColor: currentTheme.accent }}
        spellCheck={false}
        aria-label={`${label} input area`}
      />
    </motion.div>
  );
};

export default InputPanel;