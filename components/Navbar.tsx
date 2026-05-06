"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingCart, ArrowRight, Truck, ShieldCheck, RefreshCcw, Headphones, Asterisk } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './GlobalSearch';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const promoVisible = true;
    const [isHeroSearchVisible, setIsHeroSearchVisible] = useState(false);
    const [cartCount] = useState(0);

    // Hero Search Visibility Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeroSearchVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const heroSearch = document.getElementById('hero-search-bar');
        if (heroSearch) {
            observer.observe(heroSearch);
        } else {
            // If we're not on a page with the hero search, always show the nav search
            setIsHeroSearchVisible(false);
        }

        return () => {
            if (heroSearch) observer.unobserve(heroSearch);
        };
    }, [pathname]); // Re-run when path changes to look for the element again
    const headerRef = useRef<HTMLElement | null>(null);

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
        { name: 'Shop', href: '/shop' },
        { name: 'Category', href: '/category' },
        { name: 'Training', href: '/training' },
        { name: 'Book Order', href: '/book-order' },
        { name: 'Contact', href: '/contact' },
    ];

    const tickerItems = [
        { 
            isPartner: true,
            content: (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="relative w-16 h-8 shrink-0">
                            <Image src="/ccbLg.png" alt="CCB Logo" fill className="object-contain" />
                        </div>
                        <span className="whitespace-nowrap uppercase tracking-wider font-bold text-[11px] text-white/90">RC: 3709222</span>
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90 italic mx-1">Official Partner of</span>
                    <div className="flex items-center gap-1.5">
                        <div className="relative w-28 h-9 shrink-0">
                          <Image src="/assets/images/techgrowWhite.png" alt="Techgrow Logo" fill className="object-contain" />
                        </div>
                        <span className="whitespace-nowrap uppercase tracking-wider font-bold text-[11px] text-white/90">RC: 8103767</span>
                    </div>
                </div>
            )
        },
        { text: 'Responsibly raised stock' },
        { text: 'Fresh harvest scheduling' },
        { text: 'Clean processing standards' },
        { text: 'Nationwide fulfilment' },
        { text: 'Wholesale supply available' },
        { content: <span className="font-black uppercase tracking-[0.15em] text-[10px] text-white/70">Products:</span> },
        { text: 'Garri2go' },
        { text: 'Soups2go' },
        { text: 'Banga Soup2go' },
        { text: 'Egusi Soup2go' },
        { text: 'Nationwide delivery available' },
        { text: 'Bulk orders available' },
        { text: 'Call  09093009400' }
    ];

    useEffect(() => {
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
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-global-search', handleOpenSearch);
        };
    }, []);

    return (
        <>
            {/* Promo Announcement Bar */}
            <AnimatePresence>
                {promoVisible && (
                    <motion.div
                        initial={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="promo-bar relative z-[105] overflow-hidden"
                    >
                        <div className="ticker-wrap">
                            <div className="ticker-content flex items-center">
                                {[...tickerItems, ...tickerItems].map((item, i) => (
                                    <React.Fragment key={i}>
                                        <span className="inline-flex items-center font-bold text-white text-sm sm:text-sm whitespace-nowrap">
                                            {item.content || item.text}
                                        </span>
                                        <div className="flex-shrink-0 flex items-center justify-center mx-4">
                                            <Asterisk className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Navbar - Statically Sticky */}
            <nav
                className="sticky top-0 z-[100] w-full transition-all duration-300 bg-[#f5f6f2]/95 backdrop-blur-xl shadow-[0_8px_28px_rgba(15,23,42,0.06)] border-b border-black/5"
                ref={headerRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-[72px] items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <div className="relative w-32 h-32 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/ccbLg.png"
                                    alt="CCB Farms Logo"
                                    width={128}
                                    height={128}
                                    className="object-contain"
                                />
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 text-sm font-semibold tracking-wide transition-all rounded-md relative group ${isActive
                                            ? 'text-deep-green bg-deep-green/8'
                                            : 'text-gray-700 hover:text-deep-green hover:bg-black/[0.03]'
                                            }`}
                                    >
                                        <span className="relative">
                                            {item.name}
                                            {!isActive && (
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leaf transition-all duration-300 group-hover:w-full rounded-full" />
                                            )}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active"
                                                className="absolute inset-0 bg-deep-green/8 rounded-md -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <AnimatePresence>
                                {!isHeroSearchVisible && (
                                    <motion.button
                                        key="desktop-search"
                                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                        onClick={() => setIsSearchOpen(true)}
                                        className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md border border-black/8 bg-white text-gray-500 hover:border-deep-green/20 hover:text-deep-green transition-all text-sm font-medium"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span className="text-xs opacity-60 hidden lg:block">Search</span>
                                        <span className="text-[10px] font-black opacity-30 bg-foreground/5 px-1.5 py-0.5 rounded-md hidden lg:block">⌘K</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Cart Icon */}
                            <Link
                                href="/book-order"
                                className="relative p-2.5 rounded-md transition-all hover:bg-deep-green/8 active:scale-95 group"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-deep-green transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-leaf text-white text-[10px] font-black rounded-full flex items-center justify-center cart-badge-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Shop CTA - Desktop */}
                            <Link
                                href="/book-order"
                                className="hidden lg:inline-flex items-center gap-2 bg-deep-green hover:bg-[#0f2f21] text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all shadow-sm active:scale-95 tracking-wide"
                            >
                                Start Order
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Mobile Controls */}
                            <div className="lg:hidden flex items-center gap-2">
                                <AnimatePresence>
                                    {!isHeroSearchVisible && (
                                        <motion.button
                                            key="mobile-search"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => setIsSearchOpen(true)}
                                            className="p-2.5 rounded-md bg-white border border-black/8 text-gray-600 active:scale-90 transition-all"
                                        >
                                            <Search className="w-5 h-5" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2.5 rounded-md bg-white border border-black/8 text-gray-700 active:scale-90 transition-all"
                                    aria-label="Toggle menu"
                                >
                                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[120] lg:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.25)] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                                <div className="relative w-24 h-10">
                                    <Image
                                        src="/ccbLg.png"
                                        alt="CCB Farms Logo"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:text-leaf transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Menu Content */}
                            <div className="flex-grow overflow-y-auto px-5 py-6">
                                {/* Mobile Search */}
                                <div
                                    className="relative cursor-pointer mb-8 group"
                                    onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}
                                >
                                    <div className="w-full h-12 pl-11 pr-4 rounded-md bg-[#f4f5f1] border border-transparent group-hover:border-deep-green/15 transition-all flex items-center">
                                        <span className="text-gray-400 text-sm font-medium">Search products...</span>
                                    </div>
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf/70" />
                                </div>

                                {/* Links */}
                                <div className="space-y-1">
                                    {menuItems.map((item, idx) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div
                                                key={item.name}
                                                initial={{ x: 24, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.08 + idx * 0.05 }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center justify-between px-4 py-3.5 rounded-md text-base font-semibold transition-all group ${isActive
                                                        ? 'text-deep-green bg-deep-green/8'
                                                        : 'text-gray-600 hover:text-deep-green hover:bg-black/[0.03]'
                                                        }`}
                                                >
                                                    {item.name}
                                                    <ArrowRight className={`w-4 h-4 transition-all ${isActive
                                                        ? 'opacity-100 text-deep-green'
                                                        : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
                                                    />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Mobile Trust Badges */}
                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Truck, text: 'Nationwide Delivery' },
                                        { icon: ShieldCheck, text: 'Quality Guaranteed' },
                                        { icon: RefreshCcw, text: 'Freshness Promise' },
                                        { icon: Headphones, text: 'Expert Support' },
                                    ].map(({ icon: Icon, text }) => (
                                        <div key={text} className="flex items-center gap-2 p-3 bg-[#f4f5f1] rounded-md">
                                            <Icon className="w-4 h-4 text-deep-green shrink-0" />
                                            <span className="text-xs font-semibold text-gray-600">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="p-5 border-t border-gray-100">
                                <Link
                                    href="/book-order"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-deep-green hover:bg-[#0f2f21] text-white py-4 rounded-md font-black text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wide"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Start Order
                                </Link>
                                <p className="text-center text-xs text-gray-400 mt-3 font-medium">
                                    Free delivery on orders above ₦50,000
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Global Search Modal */}
            <GlobalSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};

export default Navbar;
