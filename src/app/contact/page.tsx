'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, MessageCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

export default function ContactUs() {
    const { themeMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Maktavify Contact: Message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:info@berkemaktav.com?subject=${subject}&body=${body}`;
    };

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
                            <Mail className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <motion.div
                        initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`rounded-2xl p-6 md:p-8 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-xl`}
                    >
                        <h2 className="text-xl font-bold mb-6" style={{ color: currentTheme.accent }}>Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div
                                    style={getGradientStyle()}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                >
                                    <Mail className="text-white" size={18} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <a
                                        href="mailto:info@berkemaktav.com"
                                        className={`text-sm hover:underline ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                    >
                                        info@berkemaktav.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div
                                    style={getGradientStyle()}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                >
                                    <Globe className="text-white" size={18} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Website</h3>
                                    <a
                                        href="https://berkemaktav.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm hover:underline ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                    >
                                        berkemaktav.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div
                                    style={getGradientStyle()}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                >
                                    <MessageCircle className="text-white" size={18} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Response Time</h3>
                                    <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        We typically respond within 24-48 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-8 p-4 rounded-xl ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Have a feature request or found a bug? We'd love to hear from you! Your feedback helps us improve Maktavify for everyone.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`rounded-2xl p-6 md:p-8 ${themeMode === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-xl`}
                    >
                        <h2 className="text-xl font-bold mb-6" style={{ color: currentTheme.accent }}>Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${themeMode === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:outline-none focus:ring-2`}
                                    style={{ '--tw-ring-color': currentTheme.accent } as React.CSSProperties}
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${themeMode === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:outline-none focus:ring-2`}
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border resize-none ${themeMode === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:outline-none focus:ring-2`}
                                    placeholder="How can we help?"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
                                whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                                style={getGradientStyle()}
                                className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Send Message
                            </motion.button>

                            <p className={`text-xs text-center ${themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                This will open your email client
                            </p>
                        </form>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className={`text-center mt-8 text-sm ${themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    © 2026 Maktavify. All rights reserved.
                </div>
            </div>
        </div>
    );
}
