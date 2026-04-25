"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingCart, ArrowRight, Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './GlobalSearch';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [promoVisible, setPromoVisible] = useState(true);
    const [cartCount] = useState(0);
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
                        <div className="ticker-wrap py-1">
                            <div className="ticker-content flex items-center">
                                {[
                                    { text: '📦 Bulk order discounts available — Call 09093009400' },
                                    { text: '100% Organically Grown with No Hormones Inducement' },
                                    { text: 'No preservatives!' },
                                    {text: 'Naturally farmed'},
                                    {text: 'National wide delivery'},
                                    { 
                                        isPartner: true,
                                        content: (
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="relative w-15 h-7 shrink-0">
                                                        <Image src="/ccbLg.png" alt="CCB" fill className="object-contain p-0.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="whitespace-nowrap uppercase tracking-wider">CCB Farms</span>
                                                        <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase">RC: 3709222</span>
                                                    </div>
                                                </div>
                                                <span className="opacity-40 font-normal mx-1">|</span>
                                                <div className="flex items-center font-black gap-1.5">
                                                    <span className="whitespace-nowrap uppercase tracking-wider">an Official Partner of Techgrow Farms Limited</span>
                                                    <div className="relative w-20 h-7 shrink-0">
                                                        <Image src="/assets/images/techgrowTrans.png" alt="Techgrow" fill className="object-contain p-0.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase">RC: 8103767</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                ].map((item, i) => (
                                    <span key={i} className="inline-flex items-center text-white text-xs sm:text-sm px-8 opacity-95">
                                        {item.content || item.text}
                                    </span>
                                ))}
                                {/* Duplicate for continuous scroll */}
                                {[
                                    { text: '📦 Bulk order discounts available — Call 09093009400' },
                                    { text: '🚚 Nationwide delivery available' },
                                    { text: '🌿 100% organic feed — no hormones, no preservatives' },
                                    { 
                                        isPartner: true, 
                                        content: (
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="relative w-15 h-7 shrink-0">
                                                        <Image src="/ccbLg.png" alt="CCB" fill className="object-contain p-0.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="whitespace-nowrap uppercase tracking-wider">CCB Farms</span>
                                                        <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase">RC: 3709222</span>
                                                    </div>
                                                </div>
                                                <span className="opacity-40 font-normal mx-1">|</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="whitespace-nowrap uppercase tracking-wider">an Official Partner of Techgrow Farms Limited</span>
                                                    <div className="relative w-20 h-7 shrink-0">
                                                        <Image src="/assets/images/techgrowTrans.png" alt="Techgrow" fill className="object-contain p-0.5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase">RC: 8103767</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                ].map((item, i) => (
                                    <span key={`r-${i}`} className="inline-flex items-center text-white text-xs sm:text-sm px-8 opacity-95">
                                        {item.content || item.text}
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

            {/* Main Navbar - Statically Sticky */}
            <nav
                className="sticky top-0 z-[100] w-full transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200"
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
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:border-leaf/30 hover:text-leaf transition-all text-sm font-medium"
                            >
                                <Search className="w-4 h-4" />
                                <span className="text-xs opacity-60 hidden lg:block">Search</span>
                                <span className="text-[10px] font-black opacity-30 bg-foreground/5 px-1.5 py-0.5 rounded-md hidden lg:block">⌘K</span>
                            </motion.button>

                            {/* Cart Icon */}
                            <Link
                                href="/book-order"
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
                                href="/book-order"
                                className="hidden lg:inline-flex items-center gap-2 bg-leaf hover:bg-leaf-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-leaf/25 active:scale-95 tracking-wide"
                            >
                                Order Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Mobile Controls */}
                            <div className="lg:hidden flex items-center gap-2">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2.5 rounded-xl bg-gray-100 text-gray-600 active:scale-90 transition-all"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2.5 rounded-xl bg-gray-100 text-gray-700 active:scale-90 transition-all"
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
                                    href="/book-order"
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
