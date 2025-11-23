import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Code2, Database } from 'lucide-react';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: string;
  activeTab?: string;
  placeholder?: string;
  initialX?: number;
}

const InputPanel = ({ 
  label, 
  value, 
  onChange, 
  onClear, 
  onUpload, 
  theme, 
  activeTab, 
  placeholder,
  initialX = -20
}: InputPanelProps) => {
  return (
    <motion.div
      initial={{ x: initialX, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-900/50 backdrop-blur border border-gray-800' : 'bg-white border border-gray-200'}`}
    >
      <div className={`h-14 flex items-center justify-between px-5 ${theme === 'dark' ? 'bg-gray-800/50 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'}`}>
        <div className="flex items-center gap-2">
          {activeTab === 'json' ? <Code2 size={18} className="text-indigo-500" /> : <Database size={18} className="text-blue-500" />}
          <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex gap-2">
          <label className={`p-2 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <Upload size={18} />
            <input type="file" accept=".json,.graphql,.txt" onChange={onUpload} className="hidden" />
          </label>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[600px] p-6 font-mono text-sm resize-none focus:outline-none ${
          theme === 'dark' ? 'bg-transparent text-gray-100 placeholder-gray-600' : 'bg-transparent text-gray-900 placeholder-gray-400'
        }`}
        spellCheck={false}
      />
    </motion.div>
  );
};

export default InputPanel;