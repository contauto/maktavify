'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Palette, Globe, Sparkles, Layout, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings, ColorScheme } from '@/context/SettingsContext';

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

    // Lock body scroll when modal is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
        <div className="relative">
            {/* Settings Button */}
            <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all relative z-50 ${themeMode === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                aria-label="Settings"
            >
                <Settings size={18} className="md:w-5 md:h-5" />
            </motion.button>

            {/* Modal Overlay & Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop - visible on all devices */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
                            style={{ touchAction: 'none' }}
                        >
                            {/* Menu Container */}
                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`
                                w-[calc(100%-2rem)] max-w-sm
                                max-h-[85vh]
                                overflow-y-auto
                                rounded-2xl shadow-2xl border
                                ${themeMode === 'dark'
                                        ? 'bg-gray-900 border-gray-700 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }
                            `}
                            >
                                {/* Header */}
                                <div className={`sticky top-0 flex items-center justify-between px-4 py-3 border-b ${themeMode === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                                    <span className="font-bold text-lg">{t('settings.title')}</span>
                                    <motion.button
                                        whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
                                        whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                                        onClick={() => setIsOpen(false)}
                                        className={`p-2 rounded-lg ${themeMode === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-5">
                                    {/* Theme */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {themeMode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                            <span>{t('settings.theme')}</span>
                                        </div>
                                        <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <button
                                                onClick={() => setThemeMode('light')}
                                                style={themeMode === 'light' ? getGradientStyle() : undefined}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${themeMode === 'light'
                                                    ? 'text-white'
                                                    : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Sun size={16} />
                                                {t('settings.light')}
                                            </button>
                                            <button
                                                onClick={() => setThemeMode('dark')}
                                                style={themeMode === 'dark' ? getGradientStyle() : undefined}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${themeMode === 'dark'
                                                    ? 'text-white'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Moon size={16} />
                                                {t('settings.dark')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Color Scheme */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <Palette size={14} />
                                            <span>{t('settings.color_scheme')}</span>
                                        </div>
                                        <div className="grid grid-cols-6 gap-2">
                                            {colorOptions.map(({ key, color }) => (
                                                <motion.button
                                                    key={key}
                                                    whileHover={animationsEnabled ? { scale: 1.1 } : undefined}
                                                    whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
                                                    onClick={() => setColorScheme(key)}
                                                    className="relative aspect-square w-full rounded-xl transition-all"
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

                                    {/* Language */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <Globe size={14} />
                                            <span>{t('settings.language')}</span>
                                        </div>
                                        <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <button
                                                onClick={() => setLanguage('en')}
                                                style={language === 'en' ? getGradientStyle() : undefined}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'en'
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
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${language === 'tr'
                                                    ? 'text-white'
                                                    : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span className="text-lg">🇹🇷</span>
                                                Türkçe
                                            </button>
                                        </div>
                                    </div>

                                    {/* Layout */}
                                    <div className="space-y-2">
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${themeMode === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <Layout size={14} />
                                            <span>{t('settings.layout')}</span>
                                        </div>
                                        <div className={`flex gap-1 p-1 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <button
                                                onClick={() => setLayoutMode('samePage')}
                                                style={layoutMode === 'samePage' ? getGradientStyle() : undefined}
                                                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${layoutMode === 'samePage'
                                                    ? 'text-white'
                                                    : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                {t('settings.same_page')}
                                            </button>
                                            <button
                                                onClick={() => setLayoutMode('differentPage')}
                                                style={layoutMode === 'differentPage' ? getGradientStyle() : undefined}
                                                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${layoutMode === 'differentPage'
                                                    ? 'text-white'
                                                    : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                {t('settings.different_page')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Animations Toggle */}
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
                                                className={`w-14 h-8 rounded-full transition-all relative ${!animationsEnabled
                                                    ? themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                                    : ''
                                                    }`}
                                            >
                                                <motion.div
                                                    animate={{ x: animationsEnabled ? 28 : 4 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                                                />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsMenu;

