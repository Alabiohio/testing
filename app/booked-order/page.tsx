"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Truck, User, Phone, MapPin, Mail, ChevronRight, Info, ShieldCheck, Check } from "lucide-react";

export default function BookedOrderPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        state: "Lagos",
        category: "fingerlings",
        subCategory: "",
        quantity: "",
        deliveryOption: "Home Delivery",
        notes: "",
    });

    const categoryGroups = {
        fingerlings: {
            name: "Fingerlings (Farming)",
            unit: "pieces",
            options: [
                { label: "Small Fingerlings (5–10g)", value: "small-fingerlings" },
                { label: "Medium Fingerlings (10–20g)", value: "medium-fingerlings" },
                { label: "Large Fingerlings (20–30g)", value: "large-fingerlings" },
            ]
        },
        juveniles: {
            name: "Juvenile Catfish (Farming)",
            unit: "pieces",
            options: [
                { label: "Small Juveniles (50–100g)", value: "small-juveniles" },
                { label: "Medium Juveniles (100–200g)", value: "medium-juveniles" },
                { label: "Large Juveniles (200–300g)", value: "large-juveniles" },
            ]
        },
        broodstock: {
            name: "Broodstock Catfish (Farming)",
            unit: "fish",
            options: [
                { label: "Medium Broodstock (1.5 – 2kg)", value: "medium-broodstock" },
                { label: "Large Broodstock (2 – 3kg)", value: "large-broodstock" },
                { label: "Extra Large (3kg and above)", value: "xl-broodstock" },
            ]
        },
        "table-size": {
            name: "Fresh Table-Size (Consumption)",
            unit: "kg",
            options: [
                { label: "Small (0.5 – 0.8kg)", value: "small-table" },
                { label: "Medium (1 – 1.5kg)", value: "medium-table" },
                { label: "Large (1.5 – 2kg)", value: "large-table" },
            ]
        },
        smoked: {
            name: "Smoked Catfish (Consumption)",
            unit: "kg",
            options: [
                { label: "Small Smoked (0.3 – 0.5kg)", value: "small-smoked" },
                { label: "Medium Smoked (0.6 – 0.9kg)", value: "medium-smoked" },
                { label: "Large Smoked (1kg and above)", value: "large-smoked" },
            ]
        }
    };

    const deliveryOptions = [
        "Pickup",
        "Home Delivery",
        "Farm-to-Farm Transfer (for live fish)"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you! Your order has been placed successfully. Our team will contact you within 24 hours.");
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-earth/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-leaf/10 text-leaf rounded-full text-sm font-black uppercase tracking-widest mb-6 border border-leaf/20"
                    >
                        <ShoppingBag className="w-4 h-4" /> Order Form
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-8xl font-black text-deep-green dark:text-white mb-8 tracking-tighter leading-[0.9]"
                    >
                        Seamless <br />
                        <span className="text-leaf">Catfish Ordering</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium"
                    >
                        Place your order easily and we&apos;ll handle the rest. Our team will confirm availability and total cost after submission.
                    </motion.p>
                </header>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Order Form */}
                    <div className="lg:col-span-2">
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onSubmit={handleSubmit}
                            className="bg-white dark:bg-zinc-900 shadow-2xl shadow-black/5 border-2 border-earth/5 dark:border-white/5 p-8 md:p-14 rounded-[60px] space-y-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 rounded-bl-[100px] -z-0" />

                            {/* Section: Customer Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center text-white shadow-lg shadow-leaf/20">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green dark:text-leaf uppercase tracking-tight">Customer Information</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                            placeholder="0909 300 9400"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section: Product Selection */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center text-white shadow-lg shadow-leaf/20">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green dark:text-leaf uppercase tracking-tight">Product Selection</h2>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Select Main Category</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(categoryGroups).map(([id, group]) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: id, subCategory: "" })}
                                                className={`p-6 rounded-3xl border-2 transition-all text-left group relative overflow-hidden ${formData.category === id
                                                    ? "border-leaf bg-leaf/10"
                                                    : "border-earth/10 bg-earth/5 hover:border-leaf/30"
                                                    }`}
                                            >
                                                {formData.category === id && (
                                                    <div className="absolute top-4 right-4 text-leaf">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <p className={`font-black uppercase tracking-wider text-xs mb-2 ${formData.category === id ? "text-leaf" : "text-foreground/40"}`}>
                                                    {id.replace('-', ' ')}
                                                </p>
                                                <p className="font-black text-deep-green dark:text-white leading-tight">{group.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={formData.category}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Choose Size/Weight</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {categoryGroups[formData.category as keyof typeof categoryGroups].options.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, subCategory: opt.label })}
                                                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${formData.subCategory === opt.label
                                                        ? "border-leaf bg-leaf/5 text-leaf"
                                                        : "border-leaf/10 dark:border-white/5 hover:border-leaf/40"
                                                        }`}
                                                >
                                                    <span className="font-bold">{opt.label}</span>
                                                    {formData.subCategory === opt.label && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">
                                        Quantity Required ({categoryGroups[formData.category as keyof typeof categoryGroups].unit})
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                            placeholder={`e.g. 1000 ${categoryGroups[formData.category as keyof typeof categoryGroups].unit}`}
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Delivery */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center text-white shadow-lg shadow-leaf/20">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green dark:text-leaf uppercase tracking-tight">Delivery Details</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {deliveryOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryOption: opt })}
                                            className={`p-5 rounded-2xl border-2 transition-all text-center text-xs font-black uppercase tracking-widest ${formData.deliveryOption === opt
                                                ? "border-leaf bg-leaf text-white"
                                                : "border-leaf/10 dark:border-white/5 hover:border-leaf/30"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">
                                            {formData.deliveryOption === "Pickup" ? "Preferred Pickup Area (Optional)" : "Street Address"}
                                        </label>
                                        <input
                                            required={formData.deliveryOption !== "Pickup"}
                                            type="text"
                                            className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                            placeholder={
                                                formData.deliveryOption === "Pickup"
                                                    ? "e.g. Near Sagamu Interchange"
                                                    : "123 Business Way, Ikeja"
                                            }
                                            value={formData.streetAddress}
                                            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">State</label>
                                        <select
                                            className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold appearance-none"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        >
                                            <option value="">Select State</option>
                                            <option value="Lagos">Lagos State</option>
                                            <option value="Ogun">Ogun State</option>
                                        </select>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">City / Town</label>
                                            <input
                                                required={formData.deliveryOption !== "Pickup"}
                                                type="text"
                                                className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold"
                                                placeholder="e.g. Ikeja"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {formData.deliveryOption === "Pickup" && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-leaf ml-2">
                                            📌 Note: Pickup points are available across Ogun State and Lagos.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Additional Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-leaf/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf rounded-3xl py-5 px-8 outline-none transition-all font-bold min-h-[100px]"
                                    placeholder="Special size requests, bulk discounts, event orders, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-leaf hover:bg-leaf-dark text-white py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-leaf/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                            >
                                PLACE ORDER
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <p className="text-center text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                📌 Our team will contact you within 24 hours to confirm total cost and delivery.
                            </p>
                        </motion.form>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-8 sticky top-32">
                        <div className="bg-leaf/5 rounded-[50px] p-10 border border-leaf/10 border-dashed relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-leaf/10 rounded-full blur-3xl" />
                            <h3 className="text-3xl font-black text-deep-green dark:text-leaf mb-10 leading-none">Order <br /> Summary</h3>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Category</p>
                                    <p className="font-black text-deep-green dark:text-white uppercase text-lg">
                                        {categoryGroups[formData.category as keyof typeof categoryGroups].name}
                                    </p>
                                </div>

                                {formData.subCategory && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Size/Weight</p>
                                        <p className="font-black text-leaf text-lg uppercase">{formData.subCategory}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Quantity</p>
                                    <p className="font-black text-deep-green dark:text-white text-lg uppercase">
                                        {formData.quantity ? `${formData.quantity} ${categoryGroups[formData.category as keyof typeof categoryGroups].unit}` : "—"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Delivery</p>
                                    <p className="font-black text-deep-green dark:text-white text-lg uppercase">{formData.deliveryOption}</p>
                                </div>

                                <div className="pt-8 border-t border-leaf/10">
                                    <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-leaf/5">
                                        <Info className="w-5 h-5 text-leaf shrink-0 mt-0.5" />
                                        <p className="text-xs text-foreground/50 font-medium leading-relaxed italic">
                                            Prices may vary based on market conditions. Final quote will be shared during confirmation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Secure Booking", desc: "Encrypted data handling", icon: ShieldCheck },
                                { title: "Expert Care", desc: "Hygienic processing", icon: Check },
                                { title: "Fast Support", desc: "24h Response guaranteed", icon: Phone },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white/50 dark:bg-white/5 p-6 rounded-[30px] border border-earth/5 dark:border-white/5 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-leaf/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-leaf" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-deep-green dark:text-white text-sm uppercase tracking-tight">{item.title}</h4>
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
