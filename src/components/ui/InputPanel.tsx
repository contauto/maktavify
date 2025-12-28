import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Code2, Database } from 'lucide-react';
import type { Theme, ActiveTab } from '@/types';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: Theme;
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
  theme,
  activeTab,
  placeholder,
  initialX = -20
}) => {
  return (
    <motion.div
      initial={{ x: initialX, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-900/50 backdrop-blur border border-gray-800' : 'bg-white border border-gray-200'}`}
    >
      <div className={`h-12 md:h-14 flex items-center justify-between px-4 md:px-5 ${theme === 'dark' ? 'bg-gray-800/50 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'}`}>
        <div className="flex items-center gap-2">
          {activeTab === 'json' ? <Code2 size={16} className="text-indigo-500 md:w-[18px] md:h-[18px]" /> : <Database size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />}
          <span className="text-xs md:text-sm font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <label
            className={`p-1.5 md:p-2 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            aria-label="Upload file"
          >
            <Upload size={16} className="md:w-[18px] md:h-[18px]" />
            <input type="file" accept=".json,.graphql,.txt" onChange={onUpload} className="hidden" aria-label="File upload input" />
          </label>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            className="p-1.5 md:p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
            aria-label="Clear input"
          >
            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
          </motion.button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] p-4 md:p-6 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${theme === 'dark' ? 'bg-transparent text-gray-100 placeholder-gray-600' : 'bg-transparent text-gray-900 placeholder-gray-400'
          }`}
        spellCheck={false}
        aria-label={`${label} input area`}
      />
    </motion.div>
  );
};

export default InputPanel;