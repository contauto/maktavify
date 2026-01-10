'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Palette, Globe, Sparkles, Layout, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings, ColorScheme, colorSchemes } from '@/context/SettingsContext';

const SettingsMenu: React.FC = () => {
    const { t } = useTranslation();
    const {
        themeMode,
        setThemeMode,
        colorScheme,
        setColorScheme,
        layoutMode,
        setLayoutMode,
        language,
        setLanguage,
        animationsEnabled,
        setAnimationsEnabled,
        getGradientStyle
    } = useSettings();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const colorOptions: { key: ColorScheme; color: string }[] = [
        { key: 'indigo', color: '#6366f1' },
        { key: 'emerald', color: '#10b981' },
        { key: 'rose', color: '#f43f5e' },
        { key: 'amber', color: '#f59e0b' },
        { key: 'cyan', color: '#06b6d4' },
        { key: 'violet', color: '#8b5cf6' }
    ];

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${themeMode === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                aria-label="Settings"
            >
                <Settings size={18} className="md:w-5 md:h-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${themeMode === 'dark'
                            ? 'bg-gray-900 border-gray-700 text-gray-100'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                    >
                        <div className={`flex items-center justify-between px-4 py-3 border-b ${themeMode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <span className="font-bold text-lg">{t('settings.title')}</span>
                            <motion.button
                                whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
                                whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                                onClick={() => setIsOpen(false)}
                                className={`p-1.5 rounded-lg ${themeMode === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                            >
                                <X size={18} />
                            </motion.button>
                        </div>

                        <div className="p-4 space-y-5">
                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {themeMode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                    <span>{t('settings.theme')}</span>
                                </div>
                                <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <button
                                        onClick={() => setThemeMode('light')}
                                        style={themeMode === 'light' ? getGradientStyle() : undefined}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${themeMode === 'light'
                                            ? 'text-white'
                                            : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Sun size={14} />
                                        {t('settings.light')}
                                    </button>
                                    <button
                                        onClick={() => setThemeMode('dark')}
                                        style={themeMode === 'dark' ? getGradientStyle() : undefined}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${themeMode === 'dark'
                                            ? 'text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Moon size={14} />
                                        {t('settings.dark')}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <Palette size={14} />
                                    <span>{t('settings.color_scheme')}</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {colorOptions.map(({ key, color }) => (
                                        <motion.button
                                            key={key}
                                            whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
                                            whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                                            onClick={() => setColorScheme(key)}
                                            className="relative w-10 h-10 rounded-xl transition-all"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: colorScheme === key ? `0 0 0 3px ${themeMode === 'dark' ? '#fff' : '#000'}` : 'none'
                                            }}
                                            title={t(`themes.${key}`)}
                                        >
                                            {colorScheme === key && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute inset-0 flex items-center justify-center"
                                                >
                                                    <Check size={18} className="text-white drop-shadow-lg" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <Globe size={14} />
                                    <span>{t('settings.language')}</span>
                                </div>
                                <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <button
                                        onClick={() => setLanguage('en')}
                                        style={language === 'en' ? getGradientStyle() : undefined}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${language === 'en'
                                            ? 'text-white'
                                            : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-lg">🇬🇧</span>
                                        English
                                    </button>
                                    <button
                                        onClick={() => setLanguage('tr')}
                                        style={language === 'tr' ? getGradientStyle() : undefined}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${language === 'tr'
                                            ? 'text-white'
                                            : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-lg">🇹🇷</span>
                                        Türkçe
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <Layout size={14} />
                                    <span>{t('settings.layout')}</span>
                                </div>
                                <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <button
                                        onClick={() => setLayoutMode('samePage')}
                                        style={layoutMode === 'samePage' ? getGradientStyle() : undefined}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${layoutMode === 'samePage'
                                            ? 'text-white'
                                            : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {t('settings.same_page')}
                                    </button>
                                    <button
                                        onClick={() => setLayoutMode('differentPage')}
                                        style={layoutMode === 'differentPage' ? getGradientStyle() : undefined}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${layoutMode === 'differentPage'
                                            ? 'text-white'
                                            : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {t('settings.different_page')}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                        <Sparkles size={14} />
                                        <span>{t('settings.enable_fireworks')}</span>
                                    </div>
                                    <motion.button
                                        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                                        onClick={() => setAnimationsEnabled(!animationsEnabled)}
                                        style={animationsEnabled ? getGradientStyle() : undefined}
                                        className={`w-12 h-7 rounded-full transition-all relative ${!animationsEnabled
                                            ? themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                            : ''
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: animationsEnabled ? 22 : 2 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                                        />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsMenu;
