"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showSearchIcon, setShowSearchIcon] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef<HTMLElement | null>(null);


    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Category', href: '/category' },
        { name: 'Training', href: '/training' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Header background logic
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Mobile Search Icon logic: show when past hero (60px)
            if (currentScrollY > 60) {
                setShowSearchIcon(true);

                const isScrollingUp = currentScrollY < lastScrollY;
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);

                if (!isScrollingUp && scrollDelta > 5) {
                    setIsSearchOpen(false); // Close search when scrolling down
                }
            } else {
                setShowSearchIcon(false);
                setIsSearchOpen(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);


    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'scrolled' : 'bg-transparent'}`} ref={headerRef}>
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-4">
                <div className="flex justify-between h-18 items-center lg:px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-36 h-36 flex items-center justify-center p-1 rounded-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                            <Image
                                src="/logo.png"
                                alt="CCB Farms Logo"
                                width={144}
                                height={144}
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 text-sm font-medium transition-all rounded-full relative group ${isScrolled
                                    ? 'text-gray-900 dark:text-gray-100 hover:text-leaf dark:hover:text-leaf hover:bg-leaf/5'
                                    : 'text-gray-900 dark:text-gray-100 hover:text-leaf dark:hover:text-leaf hover:bg-black/5 dark:hover:bg-white/10'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-2">
                        <AnimatePresence>
                            {showSearchIcon && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${isScrolled
                                        ? 'bg-leaf/10 text-gray-900 dark:text-gray-100 hover:text-leaf'
                                        : 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 hover:text-leaf'
                                        }`}
                                >
                                    <Search className="w-6 h-6" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2.5 rounded-xl transition-all active:scale-90 ${isScrolled
                                ? 'bg-leaf/10 text-gray-900 dark:text-gray-100 hover:text-leaf'
                                : 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 hover:text-leaf'
                                }`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Slide Down */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden glass border-t border-glass-border overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search catfish, training..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-earth/20 dark:border-white/10 focus:border-leaf focus:ring-4 focus:ring-leaf/5 outline-none text-foreground bg-white/50 dark:bg-white/10 backdrop-blur-md"
                                    autoFocus
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="md:hidden glass border-t border-glass-border shadow-2xl overflow-hidden m-2 rounded-3xl"
                    >
                        <div className="px-3 pt-4 pb-8 space-y-2">
                            {menuItems.map((item, idx) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.name}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-4 text-lg font-semibold text-foreground/70 hover:text-leaf hover:bg-leaf/10 rounded-2xl transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-6 px-4">
                                <button className="w-full bg-leaf text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-leaf/30 text-lg">
                                    Get Started Today
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
