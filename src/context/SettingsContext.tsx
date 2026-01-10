'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n';

export type ThemeMode = 'dark' | 'light';
export type ColorScheme = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet';
export type LayoutMode = 'samePage' | 'differentPage';
export type Language = 'en' | 'tr';

export interface ColorTheme {
    primaryFrom: string;
    primaryTo: string;
    accent: string;
    accentLight: string;
    accentDark: string;
}

export const colorSchemes: Record<ColorScheme, ColorTheme> = {
    indigo: {
        primaryFrom: '#4f46e5',
        primaryTo: '#9333ea',
        accent: '#6366f1',
        accentLight: '#818cf8',
        accentDark: '#4338ca'
    },
    emerald: {
        primaryFrom: '#059669',
        primaryTo: '#0d9488',
        accent: '#10b981',
        accentLight: '#34d399',
        accentDark: '#047857'
    },
    rose: {
        primaryFrom: '#e11d48',
        primaryTo: '#db2777',
        accent: '#f43f5e',
        accentLight: '#fb7185',
        accentDark: '#be123c'
    },
    amber: {
        primaryFrom: '#d97706',
        primaryTo: '#ea580c',
        accent: '#f59e0b',
        accentLight: '#fbbf24',
        accentDark: '#b45309'
    },
    cyan: {
        primaryFrom: '#0891b2',
        primaryTo: '#2563eb',
        accent: '#06b6d4',
        accentLight: '#22d3ee',
        accentDark: '#0e7490'
    },
    violet: {
        primaryFrom: '#7c3aed',
        primaryTo: '#c026d3',
        accent: '#8b5cf6',
        accentLight: '#a78bfa',
        accentDark: '#6d28d9'
    }
};

interface SettingsContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
    layoutMode: LayoutMode;
    setLayoutMode: (mode: LayoutMode) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
    currentTheme: ColorTheme;
    getGradientStyle: () => React.CSSProperties;
    getAccentColor: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [colorScheme, setColorScheme] = useState<ColorScheme>('indigo');
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('differentPage');
    const [language, setLanguage] = useState<Language>('en');
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
        const savedColor = localStorage.getItem('colorScheme') as ColorScheme;
        const savedLayout = localStorage.getItem('layoutMode') as LayoutMode;
        const savedLang = localStorage.getItem('language') as Language;
        const savedAnimations = localStorage.getItem('animationsEnabled');

        if (savedTheme) setThemeMode(savedTheme);
        if (savedColor) setColorScheme(savedColor);
        if (savedLayout) setLayoutMode(savedLayout);
        if (savedLang) {
            setLanguage(savedLang);
            i18n.changeLanguage(savedLang);
        }
        if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true');

        setMounted(true);
    }, [i18n]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('themeMode', themeMode);
        if (themeMode === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0a0a0a';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f8fafc';
        }
    }, [themeMode, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('colorScheme', colorScheme);
        const theme = colorSchemes[colorScheme];
        document.documentElement.style.setProperty('--color-primary-from', theme.primaryFrom);
        document.documentElement.style.setProperty('--color-primary-to', theme.primaryTo);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
    }, [colorScheme, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('layoutMode', layoutMode);
    }, [layoutMode, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
    }, [language, i18n, mounted]);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem('animationsEnabled', String(animationsEnabled));
    }, [animationsEnabled, mounted]);

    const currentTheme = colorSchemes[colorScheme];

    const getGradientStyle = (): React.CSSProperties => ({
        background: `linear-gradient(to right, ${currentTheme.primaryFrom}, ${currentTheme.primaryTo})`
    });

    const getAccentColor = (): string => currentTheme.accent;

    return (
        <SettingsContext.Provider
            value={{
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
                currentTheme,
                getGradientStyle,
                getAccentColor
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
