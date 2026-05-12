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

export default function CheckoutPageClient() {
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
                <div className="w-16 h-16 bg-[#edf1eb] rounded-2xl flex items-center justify-center text-deep-green mb-2">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Your cart is empty</h2>
                <p className="text-foreground/50 font-medium max-w-md text-center mb-6">You need to add items to your cart before proceeding to checkout.</p>
                <Link href="/shop" className="text-deep-green bg-[#edf1eb] px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-[#e2e9df] transition-all font-black uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-8 pb-24 relative overflow-x-clip">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <header className="mb-12 px-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-deep-green mb-3 tracking-tighter"
                    >
                        Secure <span className="text-deep-green/75">Checkout</span>
                    </motion.h1>
                    <p className="text-base text-foreground/50 max-w-2xl font-medium">
                        Complete your details below. Our team will contact you within 24 hours to finalize the payment and delivery.
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
                            className="md:bg-white md:border md:border-earth/10 py-1 px-2 md:py-10 md:px-8 md:rounded-xl space-y-12 relative overflow-hidden"
                        >
                        
                            {/* Section: Customer Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center text-leaf">
                                        <User className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground tracking-tight">Customer Information</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-white border ${errors.name ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-foreground/30'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30`}
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors({ ...errors, name: "" });
                                            }}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className={`w-full bg-white border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-foreground/30'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30`}
                                            placeholder="0909 300 9400"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phone: e.target.value });
                                                if (errors.phone) setErrors({ ...errors, phone: "" });
                                            }}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-white border ${errors.email ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-foreground/30'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30`}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: "" });
                                        }}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Section: Delivery */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center text-leaf">
                                        <Truck className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground tracking-tight">Delivery Details</h2>
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
                                            className={`px-1 py-3 rounded-lg border transition-all text-center text-[10px] font-bold uppercase tracking-widest ${formData.deliveryOption === opt
                                                ? "bg-deep-green text-white"
                                                : "border-earth/10 text-foreground/50 hover:border-earth/30"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Country</label>
                                            <div className="relative group">
                                                <select
                                                    className={`w-full bg-white border ${errors.country ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-leaf'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium appearance-none cursor-pointer text-foreground`}
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
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 rotate-90 pointer-events-none transition-colors" />
                                            </div>
                                            {errors.country && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.country}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">State / Province</label>
                                            <div className="relative group">
                                                <select
                                                    className={`w-full bg-white border ${errors.state ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-leaf'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium appearance-none cursor-pointer disabled:opacity-50 text-foreground`}
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
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 rotate-90 pointer-events-none transition-colors" />
                                            </div>
                                            {errors.state && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">City / Town</label>
                                            <div className="relative group">
                                                <input
                                                    list="city-suggestions"
                                                    className={`w-full bg-white border ${errors.city ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-leaf'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium disabled:opacity-50 text-foreground placeholder:text-foreground/20`}
                                                    value={formData.city}
                                                    disabled={!formData.state}
                                                    placeholder="Enter or select city"
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, city: e.target.value });
                                                        if (errors.city) setErrors({ ...errors, city: "" });
                                                    }}
                                                />
                                                <datalist id="city-suggestions">
                                                    {formData.state && formData.country && (() => {
                                                        const countryCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || "";
                                                        const stateCode = State.getStatesOfCountry(countryCode).find(s => s.name === formData.state)?.isoCode || "";
                                                        const cities = City.getCitiesOfState(countryCode, stateCode);

                                                        if (cities.length === 0) {
                                                            return <option value={formData.state} />;
                                                        }

                                                        return cities.map((city) => (
                                                            <option key={city.name} value={city.name} />
                                                        ));
                                                    })()}
                                                </datalist>
                                            </div>
                                            {errors.city && (
                                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Postal / Zip Code (Optional)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                                placeholder="e.g. 100001"
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">
                                            {formData.deliveryOption === "Pickup" ? "Preferred Pickup Area" : "Street Address"}
                                        </label>
                                        <input
                                            type="text"
                                            className={`w-full bg-white border ${errors.streetAddress ? 'border-red-500 bg-red-50' : 'border-earth/10 focus:border-leaf'} rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30`}
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
                                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.streetAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Order Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-4 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30 min-h-[100px]"
                                    placeholder="Special size requests, delivery instructions, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </motion.form>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-6 lg:sticky lg:top-32">
                        <div className="bg-white rounded-xl md:rounded-3xl p-6 md:p-8 border border-earth/10 relative overflow-hidden shadow-sm">
                            <h3 className="text-2xl font-semibold text-deep-green mb-8 leading-tight">Order Summary</h3>

                            <div className="space-y-6 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-6 border-b border-earth/5 last:border-0 last:pb-0">
                                        <div className="relative w-14 h-14 rounded-xl border border-earth/5 bg-[#fafafa] shrink-0 overflow-hidden">
                                            <SafeImage src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center min-w-0">
                                            <p className="font-semibold text-foreground text-sm leading-tight truncate mb-1">{item.name}</p>
                                            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                                                <span>Qty: {item.quantity} {item.unit || 'units'}</span>
                                                <span className="mx-2 text-earth/20">•</span>
                                                <span className="text-amber-600">
                                                    {item.price ? `₦${item.price.toLocaleString()}` : 'Quote Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-earth/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Subtotal</p>
                                    <p className="font-bold text-foreground text-sm">{hasUndeterminedPrice ? "Quote Pending" : `₦${totalPrice.toLocaleString()}`}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Delivery</p>
                                    <p className="text-leaf font-bold text-[10px] uppercase tracking-widest bg-leaf/5 px-2 py-1 rounded-lg">Calculated later</p>
                                </div>
                                <div className="pt-4 border-t border-earth/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Total Value</p>
                                    <p className="text-3xl font-black text-deep-green tracking-tighter">
                                        {hasUndeterminedPrice ? "Quote Required" : `₦${totalPrice.toLocaleString()}`}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-foreground/[0.02] rounded-xl border border-earth/5 mt-6">
                                    <Info className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
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
                            className={`w-full ${isSubmitting || !isFormComplete ? "bg-deep-green/50 text-white/40 cursor-not-allowed" : "bg-deep-green hover:bg-[#0f2f21] text-white"} py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4`}
                        >
                            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="space-y-3">
                            {[
                                { title: "Secure Checkout", desc: "Protected data handling", icon: ShieldCheck },
                                { title: "Expert Support", desc: "24h Response guaranteed", icon: Phone },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white p-5 rounded-2xl border border-earth/5">
                                    <div className="w-10 h-10 rounded-lg bg-foreground/[0.03] flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground text-sm tracking-tight">{item.title}</h4>
                                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
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
