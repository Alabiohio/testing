"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingCart, ChevronDown, ArrowRight, Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react';
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
    const [promoVisible, setPromoVisible] = useState(true);
    const [cartCount] = useState(0);
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
        { name: 'My Orders', href: '/booked-order' },
        { name: 'Contact', href: '/contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
            if (!isHome) {
                setShowSearchButton(true);
            } else if (currentScrollY > 150) {
                setShowSearchButton(true);
            } else {
                setShowSearchButton(false);
            }
            setLastScrollY(currentScrollY);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

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
    }, [isHome, lastScrollY]);

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
                        {/* Ticker Content... */}
                        <div className="ticker-wrap py-2.5">
                            <div className="ticker-content">
                                {['🎉 FREE delivery on orders above ₦50,000', '🐟 Fresh harvest every Monday & Thursday', '⭐ Trusted by 500+ farmers across Nigeria', '📦 Bulk order discounts available — Call 09093009400', '🚚 Nationwide delivery within 48 hours', '🌿 100% organic feed — no hormones, no preservatives'].map((msg, i) => (
                                    <span key={i} className="inline-flex items-center text-white font-bold text-sm px-12 opacity-95">
                                        {msg}
                                    </span>
                                ))}
                                {['🎉 FREE delivery on orders above ₦50,000', '🐟 Fresh harvest every Monday & Thursday', '⭐ Trusted by 500+ farmers across Nigeria', '📦 Bulk order discounts available — Call 09093009400', '🚚 Nationwide delivery within 48 hours', '🌿 100% organic feed — no hormones, no preservatives'].map((msg, i) => (
                                    <span key={`r-${i}`} className="inline-flex items-center text-white font-bold text-sm px-12 opacity-95">
                                        {msg}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setPromoVisible(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            aria-label="Close announcement"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Navbar - Now Sticky on its own */}
            <nav
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled ? 'scrolled bg-white' : 'bg-white/80 backdrop-blur-md'}`}
                ref={headerRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-[72px] items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <div className="relative w-44 h-44 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/ccb.png"
                                    alt="CCB Farms Logo"
                                    width={180}
                                    height={180}
                                    className="object-contain"
                                />
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 text-sm font-semibold tracking-wide transition-all rounded-xl relative group ${isActive
                                            ? 'text-leaf bg-leaf/10'
                                            : 'text-gray-700 hover:text-leaf hover:bg-leaf/5'
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
                                                className="absolute inset-0 bg-leaf/8 rounded-xl -z-10"
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
                                {showSearchButton && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setIsSearchOpen(true)}
                                        className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${isScrolled
                                            ? 'bg-gray-100 border-gray-200 text-gray-500 hover:border-leaf/30 hover:text-leaf'
                                            : 'bg-black/5 border-white/20 text-gray-600 hover:border-white/30'
                                            }`}
                                    >
                                        <Search className="w-4 h-4" />
                                        <span className="text-xs opacity-60 hidden lg:block">Search</span>
                                        <span className="text-[10px] font-black opacity-30 bg-foreground/5 px-1.5 py-0.5 rounded-md hidden lg:block">⌘K</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Cart Icon */}
                            <Link
                                href="/booked-order"
                                className="relative p-2.5 rounded-xl transition-all hover:bg-leaf/10 active:scale-95 group"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-leaf transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-leaf text-white text-[10px] font-black rounded-full flex items-center justify-center cart-badge-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Shop CTA - Desktop */}
                            <Link
                                href="/booked-order"
                                className="hidden md:inline-flex items-center gap-2 bg-leaf hover:bg-leaf-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-leaf/25 active:scale-95 tracking-wide"
                            >
                                Order Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Mobile Controls */}
                            <div className="md:hidden flex items-center gap-2">
                                <AnimatePresence>
                                    {showSearchButton && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => setIsSearchOpen(true)}
                                            className={`p-2.5 rounded-xl transition-all active:scale-90 ${isScrolled
                                                ? 'bg-gray-100 text-gray-600'
                                                : 'bg-black/5 text-gray-600'}`}
                                        >
                                            <Search className="w-5 h-5" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${isScrolled
                                        ? 'bg-gray-100 text-gray-700'
                                        : 'bg-black/5 text-gray-700'}`}
                                    aria-label="Toggle menu"
                                >
                                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Bar — only when scrolled */}
                <AnimatePresence>
                    {isScrolled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="trust-strip hidden lg:block overflow-hidden"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-12">
                                {[
                                    { icon: Truck, text: 'Free Delivery on ₦50k+' },
                                    { icon: ShieldCheck, text: '100% Organic & Disease-Free' },
                                    { icon: RefreshCcw, text: 'Quality Guarantee' },
                                    { icon: Headphones, text: '24/7 Farmer Support' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-xs font-bold text-deep-green opacity-80">
                                        <Icon className="w-3.5 h-3.5 text-leaf" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[120] md:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.25)] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                                <div className="relative w-24 h-10">
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
                                    <div className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-100 border-2 border-transparent group-hover:border-leaf/20 transition-all flex items-center">
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
                                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all group ${isActive
                                                        ? 'text-leaf bg-leaf/10'
                                                        : 'text-gray-600 hover:text-leaf hover:bg-leaf/5'
                                                        }`}
                                                >
                                                    {item.name}
                                                    <ArrowRight className={`w-4 h-4 transition-all ${isActive
                                                        ? 'opacity-100 text-leaf'
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
                                        <div key={text} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                            <Icon className="w-4 h-4 text-leaf shrink-0" />
                                            <span className="text-xs font-semibold text-gray-600">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="p-5 border-t border-gray-100">
                                <Link
                                    href="/booked-order"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-leaf hover:bg-leaf-dark text-white py-4 rounded-xl font-black text-base shadow-lg shadow-leaf/25 active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wide"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Place Order
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

