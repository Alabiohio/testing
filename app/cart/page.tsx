"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCart();

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-deep-green tracking-tight mb-4 flex items-center gap-4">
                        Your Cart <ShoppingCart className="w-10 h-10 text-leaf" />
                    </h1>
                    <p className="text-foreground/50 font-medium text-lg">
                        Review your items and proceed to checkout.
                    </p>
                </header>

                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-deep-green mb-3">Your cart is empty</h2>
                        <p className="text-foreground/50 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our premium catfish offerings to get started.</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-leaf hover:bg-leaf-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-leaf/20">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-full sm:w-28 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                            <Image
                                                src={item.imageUrl || "/assets/bgImages/fingerlings.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-xl font-black text-deep-green truncate pr-4">{item.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-leaf mb-3">{item.category}</p>

                                            <div className="flex flex-wrap items-center gap-4 justify-between">
                                                <div className="text-lg font-black text-gray-900">
                                                    {item.price ? `₦${item.price.toLocaleString()}` : (item.price_range || "Contact for price")}
                                                    <span className="text-xs text-gray-400 font-medium ml-1">/{item.unit}</span>
                                                </div>

                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-amber-500 text-gray-600 hover:text-amber-600 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-leaf text-gray-600 hover:text-leaf transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 border border-gray-100 sticky top-32">
                            <h3 className="text-2xl font-black text-deep-green mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 text-sm font-medium text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <span>Shipping</span>
                                    <span className="text-leaf italic text-xs">Calculated at checkout</span>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <span className="font-black text-deep-green">Estimated Total</span>
                                    <span className="font-black text-amber-500">₦{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 bg-leaf hover:bg-leaf-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-leaf/20 active:scale-95"
                            >
                                Secure Checkout <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/shop"
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-100 text-deep-green py-4 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Continue Shopping
                            </Link>

                            <div className="mt-6 flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-xs font-medium">
                                <Tag className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>For items without a fixed price, our team will provide a quote during confirmation.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
