"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { motion } from "framer-motion";
import { Truck, User, ChevronRight, ShieldCheck, ShoppingBag, ArrowLeft, MapPin, Mail, Phone, Info } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { createOrder } from "../actions/order";
import { Country, State, City } from "country-state-city";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (formData.phone.trim().length < 10) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";

        if (formData.deliveryOption !== "Pickup") {
            if (!formData.city) newErrors.city = "City is required";
            if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormComplete = 
        formData.name.trim() !== "" && 
        formData.phone.trim().length >= 10 && 
        formData.country !== "" && 
        formData.state !== "" && 
        (formData.deliveryOption === "Pickup" || (formData.city !== "" && formData.streetAddress.trim() !== ""));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error("Your cart is empty", {
                description: "Please add items before checking out."
            });
            return;
        }

        if (!validateForm()) {
            toast.error("Form validation failed", {
                description: "Please check the fields marked in red."
            });
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Processing your order...");

        try {
            const result = await createOrder({
                ...formData,
                items: items,
                totalAmount: totalPrice
            });

            if (result.success) {
                toast.success("Order placed successfully!", {
                    id: toastId,
                    description: "Thank you! Our team will contact you within 24 hours."
                });
                clearCart();
                router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
                toast.error("Order failed", {
                    id: toastId,
                    description: result.error || "Something went wrong. Please try again."
                });
            }
        } catch (error) {
            toast.error("An unexpected error occurred", {
                id: toastId,
                description: "Please try again later."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-24 flex flex-col items-center justify-center font-black text-deep-green gap-4 relative">
                <h2 className="text-3xl">Your cart is empty</h2>
                <p className="text-foreground/50 font-medium font-sans max-w-md text-center mb-4">You need to add items to your cart before proceeding to checkout.</p>
                <Link href="/shop" className="text-deep-green bg-[#edf1eb] p-4 rounded-xl flex items-center gap-2 hover:bg-[#e2e9df] transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-8 pb-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-deep-green mb-4 tracking-tighter"
                    >
                        Secure <span className="text-deep-green/75">Checkout</span>
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
                            className="bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 p-6 md:p-10 rounded-xl space-y-10 relative overflow-hidden"
                        >
                        
                            {/* Section: Customer Info */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green uppercase tracking-tight">Customer Detail</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Full Name</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-leaf/5 border-2 ${errors.name ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-6 outline-none transition-all font-bold`}
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors({ ...errors, name: "" });
                                            }}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            className={`w-full bg-leaf/5 border-2 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-6 outline-none transition-all font-bold`}
                                            placeholder="0909 300 9400"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phone: e.target.value });
                                                if (errors.phone) setErrors({ ...errors, phone: "" });
                                            }}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-leaf/5 border-2 ${errors.email ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-6 outline-none transition-all font-bold`}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: "" });
                                        }}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Section: Delivery */}
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 border-t border-gray-100 pt-8 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green uppercase tracking-tight">Delivery Info</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {deliveryOptions.map((opt: string) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, deliveryOption: opt });
                                                // Clear city/address errors if switching to Pickup
                                                if (opt === "Pickup") {
                                                    const newErrors = { ...errors };
                                                    delete newErrors.city;
                                                    delete newErrors.streetAddress;
                                                    setErrors(newErrors);
                                                }
                                            }}
                                            className={`p-3 rounded-xl border transition-all text-center text-xs font-black uppercase tracking-widest ${formData.deliveryOption === opt
                                                ? "border-deep-green bg-[#edf1eb] text-deep-green"
                                                : "border-black/8 hover:border-deep-green/30"
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
                                                    className={`w-full bg-leaf/5 border-2 ${errors.country ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer`}
                                                    value={formData.country}
                                                    onChange={(e) => {
                                                        const newCountry = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            country: newCountry,
                                                            state: "",
                                                            city: ""
                                                        });
                                                        if (errors.country) setErrors({ ...errors, country: "" });
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
                                            {errors.country && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.country}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">State / Province</label>
                                            <div className="relative group">
                                                <select
                                                    className={`w-full bg-leaf/5 border-2 ${errors.state ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer disabled:opacity-50`}
                                                    value={formData.state}
                                                    disabled={!formData.country}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, state: e.target.value, city: "" });
                                                        if (errors.state) setErrors({ ...errors, state: "" });
                                                    }}
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
                                            {errors.state && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">City / Town</label>
                                            <div className="relative group">
                                                <select
                                                    className={`w-full bg-leaf/5 border-2 ${errors.city ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none cursor-pointer disabled:opacity-50`}
                                                    value={formData.city}
                                                    disabled={!formData.state}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, city: e.target.value });
                                                        if (errors.city) setErrors({ ...errors, city: "" });
                                                    }}
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
                                            {errors.city && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.city}
                                                </p>
                                            )}
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
                                            type="text"
                                            className={`w-full bg-leaf/5 border-2 ${errors.streetAddress ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-leaf'} rounded-xl py-3 px-8 outline-none transition-all font-bold`}
                                            placeholder={
                                                formData.deliveryOption === "Pickup"
                                                    ? "e.g. Near Sagamu Interchange"
                                                    : formData.country.toLowerCase() !== "nigeria"
                                                        ? "e.g. 123 Maple Avenue"
                                                        : "e.g. 123 Business Way"
                                            }
                                            value={formData.streetAddress}
                                            onChange={(e) => {
                                                setFormData({ ...formData, streetAddress: e.target.value });
                                                if (errors.streetAddress) setErrors({ ...errors, streetAddress: "" });
                                            }}
                                        />
                                        {errors.streetAddress && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.streetAddress}
                                            </p>
                                        )}
                                    </div>
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
                        <div className="bg-white rounded-xl p-8 md:p-10 border border-black/6 relative overflow-hidden shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#edf1eb] rounded-full blur-3xl" />
                            <h3 className="text-3xl font-black text-deep-green mb-10 leading-none">Order <br /> Summary</h3>

                            <div className="space-y-8 mb-10">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-amber-500/10 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-100 shadow-sm">
                                            <SafeImage src={item.imageUrl} alt={item.name} fill className="object-contain" />
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
                                    <p className="text-deep-green font-black text-[10px] uppercase tracking-widest bg-[#edf1eb] px-2 py-1 rounded-xl">Calculated later</p>
                                </div>
                                <div className="pt-4 border-t border-amber-500/10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-1">Total Value</p>
                                    <p className="text-3xl font-black text-deep-green tracking-tighter">
                                        {hasUndeterminedPrice ? "Quote Required" : `₦${totalPrice.toLocaleString()}`}
                                    </p>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-[#f8f9f6] rounded-xl border border-black/6 mt-6">
                                    <Info className="w-5 h-5 text-deep-green shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-foreground/50 font-medium leading-relaxed italic">
                                        Prices may vary based on market conditions. Final quote will be shared during confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isSubmitting || !isFormComplete}
                            className={`w-full ${isSubmitting || !isFormComplete ? "bg-deep-green/30 cursor-not-allowed" : "bg-deep-green hover:bg-[#0f2f21]"} text-white py-4 rounded-xl font-black text-base uppercase tracking-[0.18em] transition-all active:scale-95 flex items-center justify-center gap-4`}
                        >
                            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="space-y-4">
                            {[
                                { title: "Secure Checkout", desc: "Protected data handling", icon: ShieldCheck },
                                { title: "Expert Support", desc: "24h Response guaranteed", icon: Phone },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white p-6 rounded-xl border border-black/6">
                                    <div className="w-12 h-12 rounded-xl bg-[#edf1eb] flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-deep-green" />
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
