"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, Package, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@/lib/db/schema";
import { useCart } from "@/lib/cart-context";
import { toast } from 'sonner';
import ProductCard, { type ProductCardProps } from "./ProductCard";
import { fetchMoreProductsAction } from "@/app/actions/products";

interface ShopClientProps {
    products: ProductCardProps[];
}

const ShopClient = ({ products: initialProducts }: ShopClientProps) => {
    const [allProducts, setAllProducts] = useState<ProductCardProps[]>(initialProducts);
    const [offset, setOffset] = useState(initialProducts.length);
    const [hasMore, setHasMore] = useState(initialProducts.length === 20); // Assumes initial limit was 20
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Sentinel for infinite scroll
    const sentinelRef = useRef<HTMLDivElement>(null);

    const categories = useMemo(() => {
        // We only show categories that exist in the currently loaded products
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
        const categoryMap: Record<string, string> = {
            "fingerlings": "Fingerlings",
            "juveniles": "Juveniles",
            "table-size": "Fresh Table-Size",
            "smoked": "Smoked Catfish",
            "broodstock": "Broodstock"
        };

        return [
            { id: "all", name: "All Products" },
            ...uniqueCategories.map(cat => ({
                id: cat,
                name: categoryMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")
            }))
        ];
    }, [allProducts]);
    
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name" | "newest">("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { addItem } = useCart();

    const handleOrderConfirm = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.rawPrice,
            price_range: product.rawPriceRange,
            unit: product.unit,
            category: product.category,
            imageUrl: product.img || product.imageUrl
        }, 1);
        toast.success(`${product.name} added to cart`);
    };

    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return;
        
        setIsLoadingMore(true);
        // Add a small artificial delay to make the loading state feel more professional
        await new Promise(resolve => setTimeout(resolve, 400));
        const result = await fetchMoreProductsAction(offset, 20);
        
        if (result.success && result.products.length > 0) {
            setAllProducts(prev => [...prev, ...result.products]);
            setOffset(prev => prev + result.products.length);
            setHasMore(result.products.length === 20);
        } else {
            setHasMore(false);
        }
        setIsLoadingMore(false);
    };

    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, offset]);

    const maxProductPrice = useMemo(() => {
        const prices = allProducts.map(p => p.rawPrice || 0);
        return prices.length > 0 ? Math.max(...prices, 10000) : 50000;
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Search filter
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Price filter
        result = result.filter(p => {
            const price = p.rawPrice || 0;
            if (price === 0 && p.rawPriceRange) return true;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Availability filter
        if (onlyAvailable) {
            result = result.filter(p => p.badge !== "Out of Stock" && p.badge !== "Sold Out");
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "price-asc") return (a.rawPrice || 0) - (b.rawPrice || 0);
            if (sortBy === "price-desc") return (b.rawPrice || 0) - (a.rawPrice || 0);
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });

        return result;
    }, [allProducts, searchQuery, selectedCategory, priceRange, onlyAvailable, sortBy]);

    return (
        <div className="space-y-8">


            {/* Category Navigation */}
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 border-2 ${selectedCategory === cat.id
                            ? "bg-deep-green text-white border-deep-green shadow-lg shadow-deep-green/20"
                            : "bg-white text-foreground/40 border-black/[0.05] hover:border-deep-green/20 hover:text-deep-green"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Sticky Search Header */}
            <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl border-b border-black/5 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 mb-6 transition-all duration-300">
                <div className="relative group max-w-3xl mx-auto lg:mx-0 px-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-deep-green transition-colors" />
                    <input
                        type="text"
                        placeholder="Search our catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-2 bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white border-2 border-transparent focus:border-deep-green/10 rounded-2xl outline-none transition-all font-bold text-base placeholder:text-foreground/20 placeholder:font-medium"
                    />
                </div>
            </div>

            {/* Filter/Sort Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-10 bg-[#f8f9f6] rounded-2xl p-2 border border-black/5">
                {/* Filter Icon Button */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 transition-all border shadow-sm ${isFilterOpen
                        ? 'bg-deep-green text-white border-deep-green'
                        : 'bg-white text-foreground/40 border-black/5 hover:border-deep-green/20 hover:text-deep-green'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {(priceRange[0] > 0 || priceRange[1] < maxProductPrice || onlyAvailable) && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-leaf shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                    )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 max-w-[220px]">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="appearance-none w-full bg-white border border-black/5 px-5 py-3 pr-10 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-foreground/60 outline-none cursor-pointer transition-all hover:border-deep-green/20 shadow-sm"
                    >
                        <option value="newest">Latest Arrivals</option>
                        <option value="price-asc">Price: Lowest</option>
                        <option value="price-desc">Price: Highest</option>
                        <option value="name">Alphabetical</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/25 pointer-events-none" />
                </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-xl p-10 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                            {/* Price Range */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-deep-green uppercase tracking-[0.2em] text-[10px]">Price Budget (₦)</h4>
                                    <span className="text-leaf font-black text-sm">
                                        Max: ₦{priceRange[1].toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxProductPrice}
                                    step="500"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-3 bg-[#edf1eb] rounded-full appearance-none cursor-pointer accent-[#1f7a45]"
                                />
                                <div className="flex justify-between text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                                    <span>min: ₦0</span>
                                    <span>max: ₦{maxProductPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Reset Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setPriceRange([0, maxProductPrice]);
                                        setOnlyAvailable(false);
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                    }}
                                    className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:text-red-700 transition-colors group"
                                >
                                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    Reset all filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {filteredProducts.length > 0 ? (
                <div className="space-y-12 pb-20">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, idx) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={idx}
                                    onOrder={handleOrderConfirm}
                                    layout={true}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    {/* Infinite Scroll Sentinel / Loading Indicator */}
                    <div 
                        ref={sentinelRef}
                        className="flex justify-center py-12"
                    >
                        {isLoadingMore && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Loader2 className="w-10 h-10 text-deep-green animate-spin" />
                                    <div className="absolute inset-0 bg-deep-green/10 rounded-full animate-ping" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-green animate-pulse">
                                    Loading more products...
                                </span>
                            </div>
                        )}
                        {!hasMore && allProducts.length > 20 && (
                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                <Package className="w-6 h-6" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                    You've reached the end
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-24 text-center border border-black/6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                    <div className="w-24 h-24 bg-earth/5 text-foreground/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform -rotate-12">
                        <Package className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-deep-green mb-4 tracking-tight">No products found</h3>
                    <p className="text-foreground/40 font-medium mb-12 max-w-md mx-auto leading-relaxed">
                        We couldn't find any items matching your current filters. Try broadening your search or resetting all filters.
                    </p>
                    <button
                        onClick={() => {
                            setPriceRange([0, maxProductPrice]);
                            setOnlyAvailable(false);
                            setSearchQuery("");
                            setSelectedCategory("all");
                        }}
                        className="bg-deep-green hover:bg-[#0f2f21] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-sm"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopClient;
