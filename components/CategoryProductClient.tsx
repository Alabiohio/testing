"use client";

import React, { useState, useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ShieldCheck, Clock, Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

import { type Product } from "@/lib/db/schema";

interface CategoryProductClientProps {
    products: Product[];
    displayTitle: string;
}

const CategoryProductClient = ({ products, displayTitle }: CategoryProductClientProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name" | "newest">("newest");
    const [minRating, setMinRating] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const router = useRouter();
    const [, startTransition] = useTransition();

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const handleOrderConfirm = (link: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: `Confirm Order: ${name}`,
            message: `You're about to proceed to the secure checkout for ${name}. Would you like to continue?`,
            onConfirm: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                startTransition(() => {
                    router.push(link);
                });
            },
        });
    };

    // Derived values for the price range slider
    const maxProductPrice = useMemo(() => {
        const prices = products.map(p => p.price || 0);
        return prices.length > 0 ? Math.max(...prices, 10000) : 50000;
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Price filter
        result = result.filter(p => {
            const price = p.price || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Availability filter
        if (onlyAvailable) {
            result = result.filter(p => p.available);
        }

        // Rating filter (Simulated: all products currently have ~4.9 rating in UI, but logic should exist)
        if (minRating > 0) {
            result = result.filter(p => (4.9) >= minRating); // Using 4.9 as placeholder for real DB ratings
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
            if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0; // Default (newest - usually what DB returned)
        });

        return result;
    }, [products, searchQuery, priceRange, onlyAvailable, sortBy, minRating]);

    return (
        <div className="space-y-8">
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type="info"
                confirmText="Yes, Proceed"
                cancelText="Maybe Later"
            />
            {/* Control Bar */}
            <div className="bg-white rounded-[1rem] p-4 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-4">
                {/* Search */}
                <div className="relative flex-grow w-full lg:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${displayTitle.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-leaf/20 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all border ${isFilterOpen ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-100 hover:border-amber-500/30'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {(priceRange[0] > 0 || priceRange[1] < maxProductPrice || onlyAvailable) && (
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative group flex-grow lg:flex-grow-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="appearance-none w-full bg-gray-50 border border-transparent hover:border-gray-200 px-6 py-2 pr-12 rounded-2xl font-bold text-gray-700 outline-none cursor-pointer transition-all"
                        >
                            <option value="newest">Latest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">A - Z</option>
                        </select>
                        <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-[1rem] p-4 shadow-sm border border-gray-100 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {/* Price Range */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-deep-green uppercase tracking-widest text-xs">Price Range (₦)</h4>
                                    <span className="text-leaf font-bold text-sm">
                                        ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxProductPrice}
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                                    <span>min</span>
                                    <span>max: ₦{maxProductPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Availability Toggle */}
                            <div className="space-y-4">
                                <h4 className="font-black text-deep-green uppercase tracking-widest text-xs">Availability</h4>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setOnlyAvailable(!onlyAvailable)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${onlyAvailable ? 'bg-amber-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${onlyAvailable ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 group-hover:text-leaf transition-colors text-sm">In Stock Only</span>
                                </label>
                            </div>

                            {/* Rating Selector */}
                            <div className="space-y-4">
                                <h4 className="font-black text-deep-green uppercase tracking-widest text-xs">Minimum Rating</h4>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setMinRating(star === minRating ? 0 : star)}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${star <= minRating ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/20' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}
                                        >
                                            <Star className={`w-4 h-4 ${star <= minRating ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div className="space-y-4">
                                <h4 className="font-black text-deep-green uppercase tracking-widest text-xs">Quick Reset</h4>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, maxProductPrice]);
                                        setOnlyAvailable(false);
                                        setMinRating(0);
                                        setSearchQuery("");
                                    }}
                                    className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-2 group"
                                >
                                    <span className="group-hover:rotate-180 transition-transform duration-500 inline-block text-lg">↺</span>
                                    Clear all active filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={product.id}
                            className="group bg-white rounded-[1.4rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                                <Image
                                    src={product.imageUrl || "/assets/bgImages/fingerlings.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {product.available ? (
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full shadow-lg">
                                        Available
                                    </div>
                                ) : (
                                    <div className="absolute top-4 left-4 bg-gray-400 text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-lg">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            <div className="p-4 sm:p-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-gray-900/40 tracking-wider">4.9 / 5.0</span>
                                </div>

                                <h3 className="text-base sm:text-2xl font-black text-deep-green mb-1 sm:mb-2 group-hover:text-amber-500 transition-colors leading-tight truncate sm:whitespace-normal">{product.name}</h3>
                                <p className="text-gray-500 text-[11px] sm:text-sm font-medium mb-3 leading-relaxed line-clamp-2">{product.description}</p>

                                {/* Category Badge */}
                                <div className="mb-4">
                                    <Link 
                                        href={`/${product.category}`}
                                        className="inline-block text-[10px] font-black bg-leaf/10 text-leaf hover:bg-leaf hover:text-white px-3 py-1.5 rounded-full uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        {product.category}
                                    </Link>
                                </div>


                                <div className="hidden sm:grid grid-cols-2 gap-3 mb-8">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase">Certified</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase">Fast Delivery</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price</p>
                                        <p className="text-lg sm:text-2xl font-black text-deep-green tracking-tight">
                                            {product.price ? `₦${product.price.toLocaleString()}` : (product.price_range || "Contact")}
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1">/{product.unit}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOrderConfirm(`/booked-order?cat=${product.id}`, product.name)}
                                        className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/25 active:scale-90 transition-all cursor-pointer border-none"
                                    >
                                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] p-16 text-center border border-gray-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-leaf/20" />
                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                            <SlidersHorizontal className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-deep-green mb-2">No items match your filters</h3>
                        <p className="text-gray-500 font-medium mb-8">Try adjusting your price range or search terms to find what you're looking for.</p>
                        <button
                            onClick={() => {
                                setPriceRange([0, maxProductPrice]);
                                setOnlyAvailable(false);
                                setSearchQuery("");
                            }}
                            className="text-leaf font-black uppercase tracking-widest text-xs hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProductClient;
