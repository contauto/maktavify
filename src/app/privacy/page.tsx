'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { themeMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();
    const { t } = useTranslation();

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
                            <Shield className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl p-6 md:p-8 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-xl`}
                >
                    <p className={`mb-6 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Last updated: January 31, 2026
                    </p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>1. Introduction</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                Welcome to Maktavify. This Privacy Policy explains how we collect, use, and protect your information when you use our JSON, GraphQL, and XML formatting and comparison tool.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>2. Information We Collect</h2>
                            <p className={`mb-3 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Data Processing:</strong> All JSON, GraphQL, and XML data you input is processed entirely in your browser. We do not store, transmit, or have access to any of your data.
                            </p>
                            <p className={`mb-3 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Analytics:</strong> We use Google Analytics to collect anonymous usage statistics, including page views, browser type, device information, and general geographic location.
                            </p>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                <strong>Local Storage:</strong> We store your preferences (theme, language, layout settings) in your browser's local storage for your convenience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>3. How We Use Your Information</h2>
                            <ul className={`list-disc list-inside space-y-2 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li>To provide and maintain our service</li>
                                <li>To improve user experience</li>
                                <li>To analyze usage patterns and optimize performance</li>
                                <li>To remember your preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>4. Third-Party Services</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                We use Google Analytics for anonymous usage tracking. Google's privacy policy can be found at{' '}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: currentTheme.accent }}>
                                    policies.google.com/privacy
                                </a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>5. Data Security</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                Since all data processing happens locally in your browser, your data never leaves your device. We use HTTPS to ensure secure connections to our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>6. Your Rights</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                You can clear your local storage at any time to remove all stored preferences. You can also use browser settings to opt out of analytics tracking.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>7. Changes to This Policy</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-3" style={{ color: currentTheme.accent }}>8. Contact Us</h2>
                            <p className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                If you have questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:info@berkemaktav.com" className="underline" style={{ color: currentTheme.accent }}>
                                    info@berkemaktav.com
                                </a>.
                            </p>
                        </section>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className={`text-center mt-8 text-sm ${themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    © 2026 Maktavify. All rights reserved.
                </div>
            </div>
        </div>
    );
}
