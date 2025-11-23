import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Moon, Code2, GitCompare } from 'lucide-react';

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
  mode: string;
  setMode: (mode: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header = ({ theme, setTheme, mode, setMode, activeTab, setActiveTab }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30"
        >
          <Sparkles className="text-white" size={20} />
        </motion.div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Maktavify
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Ultimate JSON & GraphQL Tool</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <Moon size={18} className="md:w-5 md:h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Sun size={18} className="md:w-5 md:h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl flex gap-1 md:gap-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {['format', 'compare'].map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 md:px-6 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              {m === 'format' ? <Code2 size={14} className="inline mr-1 md:mr-2 md:w-4 md:h-4" /> : <GitCompare size={14} className="inline mr-1 md:mr-2 md:w-4 md:h-4" />}
              <span className="hidden sm:inline">{m}</span>
            </motion.button>
          ))}
        </div>

        {mode === 'format' && (
          <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl flex gap-1 md:gap-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {['json', 'graphql'].map((t) => (
              <motion.button
                key={t}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === t
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;