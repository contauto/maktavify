'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

const Footer: React.FC = () => {
    const { themeMode, animationsEnabled, currentTheme } = useSettings();

    const legalLinks = [
        { href: '/about', label: 'About' },
        { href: '/privacy', label: 'Privacy' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <motion.footer
            initial={animationsEnabled ? { y: 20, opacity: 0 } : undefined}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mt-12 mb-4"
        >
            {/* Legal Links */}
            <div className="flex items-center justify-center gap-4 mb-4">
                {legalLinks.map((link, index) => (
                    <React.Fragment key={link.href}>
                        <Link href={link.href}>
                            <motion.span
                                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                                className={`text-sm font-medium cursor-pointer transition-colors ${themeMode === 'dark'
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {link.label}
                            </motion.span>
                        </Link>
                        {index < legalLinks.length - 1 && (
                            <span className={themeMode === 'dark' ? 'text-gray-600' : 'text-gray-300'}>•</span>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Creator Credit */}
            <div className="flex items-center justify-center">
                <motion.a
                    href="https://berkemaktav.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={animationsEnabled ? { scale: 1.02, y: -2 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                    className={`
            group relative overflow-hidden
            px-6 py-3 rounded-2xl
            backdrop-blur-xl
            border transition-all duration-300
            ${themeMode === 'dark'
                            ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                            : 'bg-black/5 border-black/10 hover:border-black/20 hover:bg-black/10'
                        }
          `}
                >
                    {/* Subtle gradient glow on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(135deg, ${currentTheme.primaryFrom}20, ${currentTheme.primaryTo}20)`,
                        }}
                    />

                    <div className="relative flex items-center gap-2">
                        <span className={`text-sm font-medium ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Crafted with
                        </span>
                        <motion.span
                            animate={animationsEnabled ? {
                                scale: [1, 1.2, 1],
                            } : undefined}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut"
                            }}
                        >
                            <Heart
                                size={14}
                                className="fill-current"
                                style={{ color: currentTheme.primaryFrom }}
                            />
                        </motion.span>
                        <span className={`text-sm font-medium ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            by
                        </span>
                        <span
                            className="text-sm font-bold bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${currentTheme.primaryFrom}, ${currentTheme.primaryTo})`,
                            }}
                        >
                            berkemaktav.com
                        </span>
                        <ExternalLink
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                        />
                    </div>
                </motion.a>
            </div>

            {/* Copyright */}
            <div className={`text-center mt-4 text-xs ${themeMode === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                © 2026 Maktavify. All rights reserved.
            </div>
        </motion.footer>
    );
};

export default Footer;
