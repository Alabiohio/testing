"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './GlobalSearch';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showSearchButton, setShowSearchButton] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef<HTMLElement | null>(null);

    const isHome = pathname === '/';

    // Body scroll lock
    useEffect(() => {
        if (isOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.marginRight = '0';
        };
    }, [isOpen, isSearchOpen]);

    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Category', href: '/category' },
        { name: 'Training', href: '/training' },
        { name: 'Booked Order', href: '/booked-order' },
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

            // Sync search button visibility
            if (!isHome) {
                setShowSearchButton(true);
            } else if (currentScrollY > 150) {
                setShowSearchButton(true);
            } else {
                setShowSearchButton(false);
            }

            setLastScrollY(currentScrollY);
        };

        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Add keyboard listener for search (Cmd+K or Ctrl+K)
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        const handleOpenSearch = () => setIsSearchOpen(true);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('open-global-search', handleOpenSearch);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-global-search', handleOpenSearch);
        };
    }, [lastScrollY]);


    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'scrolled' : 'bg-transparent'}`} ref={headerRef}>
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-18 items-center lg:px-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-36 h-36 flex items-center justify-center p-1 rounded-2xl overflow-hidden">
                                <Image
                                    src="/ccbLogo.png"
                                    alt="CCB Farms Logo"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 text-sm font-bold transition-all rounded-full relative group ${isActive
                                            ? 'text-leaf bg-leaf/10'
                                            : 'text-gray-900 dark:text-gray-100 hover:text-leaf'
                                            }`}
                                    >
                                        <span className="relative">
                                            {item.name}
                                            {!isActive && (
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leaf transition-all duration-300 group-hover:w-full" />
                                            )}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active"
                                                className="absolute inset-0 bg-leaf/5 rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Desktop Search Button */}
                            <AnimatePresence>
                                {showSearchButton && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setIsSearchOpen(true)}
                                        className={`ml-4 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-2 border border-transparent ${isScrolled
                                            ? 'bg-leaf/10 text-gray-900 dark:text-gray-100 hover:border-leaf/20'
                                            : 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-gray-100 hover:border-white/20'
                                            }`}
                                    >
                                        <Search className="w-5 h-5 text-leaf" />
                                        <span className="text-xs font-bold opacity-40 hidden lg:block">Cmd+K</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Controls */}
                        <div className="md:hidden flex items-center gap-2">
                            <AnimatePresence>
                                {showSearchButton && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onClick={() => setIsSearchOpen(true)}
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

                {/* Mobile Menu Side Drawer */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-zinc-900 z-[120] md:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col"
                            >
                                {/* Header */}
                                <div className="p-6 flex items-center justify-between border-b border-earth/5 dark:border-white/5">
                                    <div className="relative w-24 h-12">
                                        <Image
                                            src="/ccbLogo.png"
                                            alt="CCB Farms Logo"
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 bg-earth/5 dark:bg-white/5 rounded-xl text-foreground/40 hover:text-leaf transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Menu Content */}
                                <div className="flex-grow overflow-y-auto px-6 py-8 custom-scrollbar">
                                    {/* Mobile Search Input */}
                                    <div className="mb-10">
                                        <div
                                            className="relative group cursor-pointer"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsSearchOpen(true);
                                            }}
                                        >
                                            <div className="w-full h-14 pl-12 pr-4 rounded-2xl bg-earth/5 dark:bg-white/5 border-2 border-transparent group-hover:border-leaf/20 transition-all flex items-center">
                                                <span className="text-foreground/30 font-medium">Search for catfish...</span>
                                            </div>
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf/60" />
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="space-y-2">
                                        {menuItems.map((item, idx) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-bold transition-all group ${isActive
                                                            ? 'text-leaf bg-leaf/10'
                                                            : 'text-foreground/70 hover:text-leaf hover:bg-leaf/5'
                                                            }`}
                                                    >
                                                        {item.name}
                                                        <ArrowRight className={`w-5 h-5 transition-all ${isActive
                                                            ? 'opacity-100 translate-x-0 text-leaf'
                                                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                                                            }`} />
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="p-6 border-t border-earth/5 dark:border-white/5 bg-earth/5 dark:bg-white/5">
                                    <button className="w-full bg-leaf text-white py-5 rounded-[20px] font-black text-lg shadow-xl shadow-leaf/20 active:scale-95 transition-all">
                                        GET STARTED
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>

            {/* Global Search Modal */}
            <GlobalSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};

export default Navbar;
