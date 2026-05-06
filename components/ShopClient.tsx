"use client";

import React, { useState, useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

import { type Product } from "@/lib/db/schema";
import { useCart } from "@/lib/cart-context";

interface ShopClientProps {
    products: Product[];
}

const ShopClient = ({ products }: ShopClientProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
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
    }, [products]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name" | "newest">("newest");
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

    const { addItem } = useCart();

    const handleOrderConfirm = (product: Product) => {
        setConfirmModal({
            isOpen: true,
            title: `Add to Cart: ${product.name}`,
            message: `Would you like to add ${product.name} to your cart and proceed to checkout?`,
            onConfirm: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    price_range: product.price_range,
                    unit: product.unit,
                    category: product.category,
                    imageUrl: product.imageUrl
                }, 1);
                
                startTransition(() => {
                    router.push("/cart");
                });
            },
        });
    };

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

        // Category filter
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Price filter
        result = result.filter(p => {
            const price = p.price || 0;
            if (price === 0 && p.price_range) return true; // Keep products with only price range if they aren't explicitly 0
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Availability filter
        if (onlyAvailable) {
            result = result.filter(p => p.available);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
            if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "newest") {
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
            return 0;
        });

        return result;
    }, [products, searchQuery, selectedCategory, priceRange, onlyAvailable, sortBy]);

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

            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-0.5 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`whitespace-nowrap px-8 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                            selectedCategory === cat.id
                                ? "bg-deep-green text-white shadow-sm"
                                : "bg-white text-foreground/50 border border-black/6 hover:border-deep-green/20 hover:text-deep-green"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Control Bar */}
            <div className="bg-white rounded-md p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 flex flex-col lg:flex-row items-center gap-6">
                {/* Search */}
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/20" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-3 bg-[#f4f5f1] rounded-md outline-none focus:ring-2 focus:ring-deep-green/10 transition-all font-semibold text-base"
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-3 px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all border-2 ${
                            isFilterOpen 
                                ? 'bg-deep-green text-white border-deep-green shadow-sm' 
                                : 'bg-white text-foreground/60 border-black/8 hover:border-deep-green/20'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                        {(priceRange[0] > 0 || priceRange[1] < maxProductPrice || onlyAvailable) && (
                            <span className="w-2.5 h-2.5 rounded-full bg-leaf animate-pulse" />
                        )}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative flex-grow lg:flex-grow-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="appearance-none w-full bg-[#f4f5f1] border border-transparent hover:border-black/8 px-8 py-2.5 pr-14 rounded-md font-black text-sm uppercase tracking-widest text-foreground/60 outline-none cursor-pointer transition-all"
                        >
                            <option value="newest">Latest</option>
                            <option value="price-asc">Price: Low</option>
                            <option value="price-desc">Price: High</option>
                            <option value="name">A - Z</option>
                        </select>
                        <ArrowUpDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 pointer-events-none" />
                    </div>
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
                        <div className="bg-white rounded-md p-10 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
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

                            {/* Availability Toggle */}
                            <div className="space-y-6">
                                <h4 className="font-black text-deep-green uppercase tracking-[0.2em] text-[10px]">Inventory</h4>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div
                                        onClick={() => setOnlyAvailable(!onlyAvailable)}
                                        className={`w-16 h-8 rounded-full transition-all relative border ${onlyAvailable ? 'bg-deep-green border-deep-green' : 'bg-white border-black/8'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${onlyAvailable ? 'left-9 bg-white' : 'left-1 bg-earth/20'}`} />
                                    </div>
                                    <span className="font-black text-foreground/60 group-hover:text-leaf transition-colors text-sm uppercase tracking-widest">Ready for pickup</span>
                                </label>
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                key={product.id}
                                className="group bg-white rounded-md overflow-hidden border border-black/6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] hover:shadow-[0_22px_44px_-30px_rgba(15,23,42,0.32)] hover:-translate-y-1 transition-all duration-500"
                            >
                                <div className="relative aspect-[5/4] bg-earth/5 overflow-hidden">
                                    <Image
                                        src={product.imageUrl || "/assets/bgImages/fingerlings.png"}
                                        alt={product.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-1000"
                                    />

                                    
                                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2">
                                        {product.available ? (
                                            <span className="bg-deep-green text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm backdrop-blur-md">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="bg-foreground/40 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg backdrop-blur-md">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-8">
                                    <div className="mb-2 sm:mb-4">
                                            <span className="text-[8px] sm:text-[10px] font-black text-deep-green uppercase tracking-[0.2em] bg-[#edf1eb] px-2 sm:px-3 py-1 rounded-full border border-black/6">
                                            {product.category}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-2xl font-black text-deep-green mb-1.5 sm:mb-3 group-hover:text-[#1f7a45] transition-colors leading-tight line-clamp-1 sm:line-clamp-none">
                                        {product.name}
                                    </h3>
                                    <p className="text-foreground/40 text-[10px] sm:text-sm font-medium mb-4 sm:mb-8 leading-relaxed line-clamp-2">
                                        {product.description || "Premium quality aquaculture produce from our sustainable farms."}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 sm:pt-8 border-t border-earth/5">
                                        <div>
                                            <p className="text-lg sm:text-2xl font-black text-deep-green tracking-tight">
                                                {product.price ? `₦${product.price.toLocaleString()}` : (product.price_range || "Contact")}
                                                <span className="text-[10px] sm:text-xs font-bold text-foreground/20 ml-1">/{product.unit}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleOrderConfirm(product)}
                                            className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-deep-green hover:bg-[#0f2f21] text-white rounded-md shadow-sm active:scale-95 transition-all cursor-pointer group/btn shrink-0"
                                        >
                                            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-white rounded-md p-24 text-center border border-black/6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
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
                        className="bg-deep-green hover:bg-[#0f2f21] text-white px-10 py-4 rounded-md font-black text-sm uppercase tracking-[0.2em] transition-all shadow-sm"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopClient;
