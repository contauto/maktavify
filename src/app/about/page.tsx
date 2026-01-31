'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Sparkles, Zap, Code2, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

export default function AboutUs() {
    const { themeMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();

    const features = [
        {
            icon: <Code2 size={24} />,
            title: 'JSON Beautifier',
            description: 'Format and beautify JSON data with customizable indentation and syntax highlighting.'
        },
        {
            icon: <Zap size={24} />,
            title: 'GraphQL Formatter',
            description: 'Clean up and format GraphQL queries and schemas for better readability.'
        },
        {
            icon: <Sparkles size={24} />,
            title: 'XML Tools',
            description: 'Beautify XML documents and convert between XML and JSON formats seamlessly.'
        },
        {
            icon: <GitCompare size={24} />,
            title: 'Data Comparison',
            description: 'Compare JSON or XML documents side-by-side with detailed difference highlighting.'
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeMode === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(to bottom right, ${currentTheme.primaryFrom}15, transparent, ${currentTheme.primaryTo}15)`
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
                {/* Header */}
                <motion.div
                    initial={animationsEnabled ? { y: -20, opacity: 0 } : undefined}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <Link href="/">
                        <motion.button
                            whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                            whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                            className={`p-2 rounded-lg ${themeMode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
                        >
                            <ArrowLeft size={20} />
                        </motion.button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div
                            style={getGradientStyle()}
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                        >
                            <Users className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">About Us</h1>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 md:p-8 mb-6 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-xl`}
                >
                    <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.accent }}>Welcome to Maktavify</h2>
                    <p className={`text-lg mb-6 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Maktavify is a powerful, free online tool designed for developers, data analysts, and anyone who works with structured data formats like JSON, GraphQL, and XML.
                    </p>
                    <p className={`mb-6 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Our mission is simple: to provide fast, secure, and easy-to-use data formatting and comparison tools that respect your privacy. All processing happens directly in your browser – your data never leaves your device.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={animationsEnabled ? { scale: 1.02, y: -4 } : undefined}
                            className={`rounded-xl p-5 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-lg`}
                        >
                            <div
                                style={getGradientStyle()}
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white"
                            >
                                {feature.icon}
                            </div>
                            <h3 className="font-bold mb-2">{feature.title}</h3>
                            <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Creator Section */}
                <motion.div
                    initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-2xl p-6 md:p-8 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-xl`}
                >
                    <h2 className="text-xl font-bold mb-4" style={{ color: currentTheme.accent }}>The Creator</h2>
                    <p className={`mb-4 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Maktavify is created and maintained by <strong>Berke Maktav</strong>, a passionate software developer dedicated to building useful tools for the developer community.
                    </p>
                    <p className={`${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Visit{' '}
                        <a
                            href="https://berkemaktav.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline"
                            style={{ color: currentTheme.accent }}
                        >
                            berkemaktav.com
                        </a>{' '}
                        to explore more projects and get in touch.
                    </p>
                </motion.div>

                {/* Footer */}
                <div className={`text-center mt-8 text-sm ${themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    © 2026 Maktavify. All rights reserved.
                </div>
            </div>
        </div>
    );
}
