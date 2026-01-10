'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, GitCompare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/context/SettingsContext';
import SettingsMenu from '@/components/ui/SettingsMenu';
import type { Mode, ActiveTab } from '@/types';

interface HeaderProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode, activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const { themeMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();

  return (
    <motion.header
      initial={animationsEnabled ? { y: -20, opacity: 0 } : undefined}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <motion.div
          whileHover={animationsEnabled ? { rotate: 360, scale: 1.1 } : undefined}
          transition={{ duration: 0.6 }}
          style={getGradientStyle()}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <Sparkles className="text-white" size={20} />
        </motion.div>
        <div>
          <h1
            className="text-2xl md:text-3xl font-black"
            style={{ color: themeMode === 'dark' ? currentTheme.accentLight : currentTheme.accentDark }}
          >
            {t('app.title')}
          </h1>
          <p className={`text-xs md:text-sm font-medium ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('app.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
        <SettingsMenu />

        <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl flex gap-1 md:gap-2 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {(['format', 'compare'] as Mode[]).map((m) => (
            <motion.button
              key={m}
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={() => setMode(m)}
              style={mode === m ? getGradientStyle() : undefined}
              className={`px-3 py-1.5 md:px-6 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${mode === m
                ? 'text-white shadow-lg'
                : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              {m === 'format' ? <Code2 size={14} className="inline mr-1 md:mr-2 md:w-4 md:h-4" /> : <GitCompare size={14} className="inline mr-1 md:mr-2 md:w-4 md:h-4" />}
              <span className="hidden sm:inline">{t(`header.${m}`)}</span>
            </motion.button>
          ))}
        </div>

        {mode === 'format' && (
          <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl flex gap-1 md:gap-2 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {(['json', 'graphql'] as ActiveTab[]).map((tab) => (
              <motion.button
                key={tab}
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? getGradientStyle() : undefined}
                className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab
                  ? 'text-white shadow-lg'
                  : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                {t(`header.${tab}`)}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;