"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, BookOpen, FileText, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchableItems, SearchItem } from '@/lib/search-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchItem[]>([]);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const filtered = searchableItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8); // Limit results

        setResults(filtered);
    }, [query]);

    const handleSelect = (href: string) => {
        onClose();
        setQuery("");
        router.push(href);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Search Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-earth/10 dark:border-white/10"
                    >
                        {/* Search Input Area */}
                        <div className="p-6 border-b border-earth/5 dark:border-white/5">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-6 h-6 text-leaf" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search catfish, training modules, services..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-earth/5 dark:bg-white/5 pl-14 pr-12 py-4 rounded-2xl outline-none text-xl font-medium placeholder:text-foreground/30 text-foreground"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="absolute right-4 p-1 hover:bg-earth/10 dark:hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-foreground/40" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="space-y-6 pb-4">
                                    {/* Grouped results could go here, but let's keep it simple for now */}
                                    <div className="grid gap-2">
                                        {results.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(item.href)}
                                                className="w-full text-left p-4 rounded-2xl hover:bg-leaf/5 dark:hover:bg-leaf/10 group transition-all flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                                                    {item.category === "Produce" && <ShoppingBag className="w-6 h-6 text-leaf" />}
                                                    {item.category === "Training" && <BookOpen className="w-6 h-6 text-leaf" />}
                                                    {item.category === "Pages" && <FileText className="w-6 h-6 text-leaf" />}
                                                    {item.category === "Information" && <Info className="w-6 h-6 text-leaf" />}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-lg text-deep-green dark:text-white group-hover:text-leaf transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-leaf/60 bg-leaf/5 px-2 py-1 rounded-md">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground/50 line-clamp-1">{item.description}</p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-leaf group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : query.trim() !== "" ? (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 bg-earth/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-foreground/20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground/60">No results found for &quot;{query}&quot;</h3>
                                    <p className="text-foreground/40 mt-2">Try searching for &quot;fingerlings&quot; or &quot;training&quot;</p>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <p className="text-xs font-black uppercase tracking-widest text-foreground/30 mb-4 px-4">Popular Searches</p>
                                    <div className="flex flex-wrap gap-2 px-4">
                                        {["Fingerlings", "Juveniles", "Table Size", "Training"].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-4 py-2 bg-earth/5 dark:bg-white/5 hover:bg-leaf/10 hover:text-leaf rounded-full text-sm font-bold transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-earth/5 dark:bg-white/5 flex items-center justify-between border-t border-earth/5 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                {!isTouchDevice ? (
                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                                        Press <span className="text-foreground/60 font-black">ESC</span> to close
                                    </p>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-earth/10 dark:bg-white/10 rounded-xl text-[10px] font-black text-foreground/60 uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                            <Link
                                href="/category"
                                onClick={onClose}
                                className="text-[10px] font-black text-leaf hover:underline uppercase tracking-widest"
                            >
                                View all produce
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GlobalSearch;
