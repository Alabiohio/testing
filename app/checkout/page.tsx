"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, User, ChevronRight, ShieldCheck, ShoppingBag, ArrowLeft, MapPin, Mail, Phone, Info } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { createOrder } from "../actions/order";
import { Country, State, City } from "country-state-city";

const deliveryOptions = [
    "Pickup",
    "Home Delivery",
    "Farm-to-Farm Transfer (for live fish)"
];

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const hasUndeterminedPrice = items.some(i => i.category === "Partner Ad" && !i.price);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        country: "Nigeria",
        state: "Lagos",
        postalCode: "",
        deliveryOption: "Home Delivery",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (items.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

        setIsSubmitting(true);
        const result = await createOrder({
            ...formData,
            items: items,
            totalAmount: totalPrice
        });
        setIsSubmitting(false);

        if (result.success) {
            alert("Thank you! Your order has been placed successfully. Our team will contact you within 24 hours.");
            clearCart();
            router.push("/");
        } else {
            alert(result.error || "Something went wrong. Please try again.");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-24 flex flex-col items-center justify-center font-black text-deep-green gap-4 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf/5 rounded-full blur-[120px] -z-10" />
                <h2 className="text-3xl">Your cart is empty</h2>
                <p className="text-foreground/50 font-medium font-sans max-w-md text-center mb-4">You need to add items to your cart before proceeding to checkout.</p>
                <Link href="/shop" className="text-leaf bg-leaf/10 p-4 rounded-xl flex items-center gap-2 hover:bg-leaf/20 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-earth/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-foreground/50 hover:text-leaf transition-colors font-bold text-sm uppercase tracking-wider mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-deep-green mb-4 tracking-tighter"
                    >
                        Secure <span className="text-leaf">Checkout</span>
                    </motion.h1>
                    <p className="text-lg text-foreground/50 max-w-2xl font-medium">
                        Complete your details below. Our team will contact you to finalize the payment and delivery.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <motion.form
                            id="checkout-form"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onSubmit={handleSubmit}
                            className="bg-white shadow-2xl shadow-black/5 border-2 border-earth/5 p-6 md:p-10 rounded-3xl space-y-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 rounded-bl-[100px] -z-0" />

                            {/* Section: Customer Info */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green uppercase tracking-tight">Customer Detail</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-4 px-6 outline-none transition-all font-bold"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-4 px-6 outline-none transition-all font-bold"
                                            placeholder="0909 300 9400"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-4 px-6 outline-none transition-all font-bold"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section: Delivery */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 border-t border-gray-100 pt-8 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green uppercase tracking-tight">Delivery Info</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {deliveryOptions.map((opt: string) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryOption: opt })}
                                            className={`p-4 rounded-xl border-2 transition-all text-center text-xs font-black uppercase tracking-widest ${formData.deliveryOption === opt
                                                ? "border-amber-500 bg-amber-50 text-amber-600"
                                                : "border-amber-500/10 hover:border-amber-500/30"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Country</label>
                                            <div className="relative group">
                                                <select
                                                    required
                                                    className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer"
                                                    value={formData.country}
                                                    onChange={(e) => {
                                                        const newCountry = e.target.value;
                                                        setFormData({ 
                                                            ...formData, 
                                                            country: newCountry,
                                                            state: "",
                                                            city: "" 
                                                        });
                                                    }}
                                                >
                                                    <option value="">Select Country</option>
                                                    {Country.getAllCountries().map((country) => (
                                                        <option key={country.isoCode} value={country.name}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 rotate-90 pointer-events-none group-focus-within:text-leaf transition-colors" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">State / Province</label>
                                            <div className="relative group">
                                                <select
                                                    required
                                                    className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer disabled:opacity-50"
                                                    value={formData.state}
                                                    disabled={!formData.country}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value, city: "" })}
                                                >
                                                    <option value="">Select State</option>
                                                    {formData.country && 
                                                        State.getStatesOfCountry(Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || "").map((state) => (
                                                            <option key={state.isoCode} value={state.name}>
                                                                {state.name}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 rotate-90 pointer-events-none group-focus-within:text-leaf transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">City / Town</label>
                                            <div className="relative group">
                                                <select
                                                    required={formData.deliveryOption !== "Pickup"}
                                                    className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer disabled:opacity-50"
                                                    value={formData.city}
                                                    disabled={!formData.state}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                >
                                                    <option value="">Select City</option>
                                                    {formData.state && formData.country && (() => {
                                                        const countryCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || "";
                                                        const stateCode = State.getStatesOfCountry(countryCode).find(s => s.name === formData.state)?.isoCode || "";
                                                        const cities = City.getCitiesOfState(countryCode, stateCode);
                                                        
                                                        // Fallback if no cities found for the state
                                                        if (cities.length === 0) {
                                                            return <option value={formData.state}>{formData.state} (Entire Region)</option>;
                                                        }

                                                        return cities.map((city) => (
                                                            <option key={city.name} value={city.name}>
                                                                {city.name}
                                                            </option>
                                                        ));
                                                    })()}
                                                </select>
                                                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 rotate-90 pointer-events-none group-focus-within:text-leaf transition-colors" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Postal / Zip Code</label>
                                            <input
                                                type="text"
                                                className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
                                                placeholder="e.g. 100001"
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">
                                            {formData.deliveryOption === "Pickup" ? "Preferred Pickup Area" : "Street Address"}
                                        </label>
                                        <input
                                            required={formData.deliveryOption !== "Pickup"}
                                            type="text"
                                            className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
                                            placeholder={
                                                formData.deliveryOption === "Pickup"
                                                    ? "e.g. Near Sagamu Interchange"
                                                    : formData.country.toLowerCase() !== "nigeria" 
                                                        ? "e.g. 123 Maple Avenue"
                                                        : "e.g. 123 Business Way"
                                            }
                                            value={formData.streetAddress}
                                            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                        />
                                    </div>

                                    {formData.deliveryOption === "Pickup" && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 ml-2">
                                            📌 Note: Pickup points are currently only available across Lagos and Ogun State.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-gray-100 pt-8 relative z-10">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Order Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-4 px-6 outline-none transition-all font-bold min-h-[100px]"
                                    placeholder="Special size requests, delivery instructions, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </motion.form>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-8 sticky top-32">
                        <div className="bg-amber-500/5 rounded-3xl p-8 md:p-10 border border-amber-500/10 border-dashed relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                            <h3 className="text-3xl font-black text-deep-green mb-10 leading-none">Order <br /> Summary</h3>

                            <div className="space-y-8 mb-10">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-amber-500/10 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-100 shadow-sm">
                                            <Image src={item.imageUrl || "/assets/bgImages/fingerlings.png"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0 pt-1">
                                            <p className="font-black text-sm text-deep-green uppercase tracking-tight truncate">{item.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mt-1">
                                                {(!(item.category === "Partner Ad" && !item.price)) ? `Qty: ${item.quantity} ${item.unit || 'units'}` : 'Qty Pending'}
                                            </p>
                                            <p className="font-black text-amber-600 text-sm mt-1">
                                                {item.price ? `₦${item.price.toLocaleString()}` : 'Quote Pending'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-amber-500/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Subtotal</p>
                                    <p className="font-black text-deep-green">{hasUndeterminedPrice ? "Quote Pending" : `₦${totalPrice.toLocaleString()}`}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Delivery</p>
                                    <p className="text-leaf font-black text-[10px] uppercase tracking-widest bg-leaf/10 px-2 py-1 rounded-md">Calculated later</p>
                                </div>
                                <div className="pt-4 border-t border-amber-500/10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-1">Total Value</p>
                                    <p className="text-3xl font-black text-deep-green tracking-tighter">
                                        {hasUndeterminedPrice ? "Quote Required" : `₦${totalPrice.toLocaleString()}`}
                                    </p>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-amber-500/5 mt-6">
                                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-foreground/50 font-medium leading-relaxed italic">
                                        Prices may vary based on market conditions. Final quote will be shared during confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? "bg-leaf/50" : "bg-leaf hover:bg-leaf-dark hover:scale-[1.02]"} text-white py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-4`}
                        >
                            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="space-y-4">
                            {[
                                { title: "Secure Checkout", desc: "Protected data handling", icon: ShieldCheck },
                                { title: "Expert Support", desc: "24h Response guaranteed", icon: Phone },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white/50 p-6 rounded-2xl border border-earth/5 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-leaf" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-deep-green text-sm uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
