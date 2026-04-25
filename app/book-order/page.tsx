"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Truck, User, Phone, MapPin, Mail, ChevronRight, Info, ShieldCheck, Check, CheckCircle } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { createOrder } from "../actions/order";

const categoryGroups: Record<string, CategoryGroup> = {
    fingerlings: {
        name: "Fingerlings (Farming)",
        unit: "pieces",
        image: "/assets/bgImages/fingerlings.png",
        options: [
            { label: "Small Fingerlings (5–10g)", value: "small-fingerlings" },
            { label: "Medium Fingerlings (10–20g)", value: "medium-fingerlings" },
            { label: "Large Fingerlings (20–30g)", value: "large-fingerlings" },
        ]
    },
    juveniles: {
        name: "Juvenile Catfish (Farming)",
        unit: "pieces",
        image: "/assets/bgImages/juveniles.png",
        options: [
            { label: "Small Juveniles (50–100g)", value: "small-juveniles" },
            { label: "Medium Juveniles (100–200g)", value: "medium-juveniles" },
            { label: "Large Juveniles (200–300g)", value: "large-juveniles" },
        ]
    },
    broodstock: {
        name: "Broodstock Catfish (Farming)",
        unit: "fish",
        image: "/assets/bgImages/broodstock.png",
        options: [
            { label: "Medium Broodstock (1.5 – 2kg)", value: "medium-broodstock" },
            { label: "Large Broodstock (2 – 3kg)", value: "large-broodstock" },
            { label: "Extra Large (3kg and above)", value: "xl-broodstock" },
        ]
    },
    "table-size": {
        name: "Fresh Table-Size (Consumption)",
        unit: "kg",
        image: "/assets/bgImages/tablesize.png",
        options: [
            { label: "Small (0.5 – 0.8kg)", value: "small-table" },
            { label: "Medium (1 – 1.5kg)", value: "medium-table" },
            { label: "Large (1.5 – 2kg)", value: "large-table" },
        ]
    },
    smoked: {
        name: "Smoked Catfish (Consumption)",
        unit: "kg",
        image: "/assets/bgImages/smoked.png",
        options: [
            { label: "Small Smoked (0.3 – 0.5kg)", value: "small-smoked" },
            { label: "Medium Smoked (0.6 – 0.9kg)", value: "medium-smoked" },
            { label: "Large Smoked (1kg and above)", value: "large-smoked" },
        ]
    },
};

const deliveryOptions = [
    "Pickup",
    "Home Delivery",
    "Farm-to-Farm Transfer (for live fish)"
];

export default function BookedOrderPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        country: "Nigeria",
        state: "Lagos",
        postalCode: "",
        categories: ["fingerlings"] as string[],
        items: [{ categoryId: "fingerlings", subCategory: "", quantity: "" }],
        deliveryOption: "Home Delivery",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const firstItem = formData.items[0];
        const submissionData = {
            ...formData,
            category: firstItem?.categoryId,
            subCategory: firstItem?.subCategory,
            quantity: firstItem?.quantity,
        };

        const result = await createOrder(submissionData);
        setIsSubmitting(false);

        if (result.success) {
            alert("Thank you! Your order has been placed successfully. Our team will contact you within 24 hours.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                streetAddress: "",
                city: "",
                country: "Nigeria",
                state: "Lagos",
                postalCode: "",
                categories: ["fingerlings"],
                items: [{ categoryId: "fingerlings", subCategory: "", quantity: "" }],
                deliveryOption: "Home Delivery",
                notes: "",
            });
        } else {
            alert(result.error || "Something went wrong. Please try again.");
        }
    };

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-leaf">Loading...</div>}>
            <OrderFormContent formData={formData} setFormData={setFormData} categoryGroups={categoryGroups} deliveryOptions={deliveryOptions} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Suspense>
    );
}

interface CategoryOption {
    label: string;
    value: string;
}

interface CategoryGroup {
    name: string;
    unit: string;
    image: string;
    options: CategoryOption[];
}

interface OrderFormContentProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    categoryGroups: Record<string, CategoryGroup>;
    deliveryOptions: string[];
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
}

function OrderFormContent({ formData, setFormData, categoryGroups, deliveryOptions, handleSubmit, isSubmitting }: OrderFormContentProps) {
    const searchParams = useSearchParams();
    const catParam = searchParams.get("cat");

    useEffect(() => {
        if (catParam && categoryGroups[catParam] && !formData.categories.includes(catParam)) {
            setFormData((prev: any) => ({ 
                ...prev, 
                categories: [catParam],
                items: [{ categoryId: catParam, subCategory: "", quantity: "" }]
            }));
        }
    }, [catParam, categoryGroups, setFormData]);

    return (
        <div className="min-h-screen bg-background pt-4 pb-24 relative overflow-x-clip">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-earth/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Order Form */}
                    <div className="lg:col-span-2">
                        <motion.form
                            id="order-form"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onSubmit={handleSubmit}
                            className="bg-white  shadow-2xl shadow-black/5 border-2 border-earth/5  py-8 px-4 md:py-10 md:px-8 rounded-3xl space-y-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 rounded-bl-[100px] -z-0" />

                            {/* Section: Customer Info */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green  uppercase tracking-tight">Customer Information</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-leaf/5  border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
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
                                            className="w-full bg-leaf/5  border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
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
                                        className="w-full bg-leaf/5  border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section: Product Selection */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green  uppercase tracking-tight">Product Selection</h2>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Select Main Category</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(categoryGroups).map(([id, group]: [string, CategoryGroup]) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => {
                                                    const isSelected = formData.categories.includes(id);
                                                    let newCategories = [...formData.categories];
                                                    let newItems = [...formData.items];

                                                    if (isSelected) {
                                                        if (newCategories.length > 1) {
                                                            newCategories = newCategories.filter(c => c !== id);
                                                            newItems = newItems.filter(i => i.categoryId !== id);
                                                        }
                                                    } else {
                                                        newCategories.push(id);
                                                        newItems.push({ categoryId: id, subCategory: "", quantity: "" });
                                                    }

                                                    setFormData({ ...formData, categories: newCategories, items: newItems });
                                                }}
                                                className={`p-4 rounded-xl border-2 transition-all text-left group relative overflow-hidden flex items-center gap-4 ${formData.categories.includes(id)
                                                    ? "border-amber-500 bg-amber-50"
                                                    : "border-earth/10 bg-earth/5 hover:border-amber-500/30"
                                                    }`}
                                            >
                                                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-leaf/10">
                                                    <Image
                                                        src={group.image}
                                                        alt={group.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className={`font-black uppercase tracking-wider text-[10px] mb-1 ${formData.categories.includes(id) ? "text-amber-600" : "text-foreground/40"}`}>
                                                        {id.replace('-', ' ')}
                                                    </p>
                                                    <p className="font-black text-deep-green  leading-tight text-sm">{group.name}</p>
                                                </div>
                                                {formData.categories.includes(id) && (
                                                    <div className="text-amber-600 shrink-0">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {formData.items.map((item: any, itemIdx: number) => {
                                        const group = categoryGroups[item.categoryId as keyof typeof categoryGroups];
                                        return (
                                            <motion.div 
                                                key={item.categoryId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 rounded-[32px] bg-white border-2 border-earth/5 space-y-8"
                                            >
                                                <div className="flex items-center gap-4 pb-4 border-b border-earth/5">
                                                    <div className="w-10 h-10 rounded-xl bg-leaf/10 flex items-center justify-center text-leaf">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-deep-green uppercase tracking-tight">{group.name}</h3>
                                                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Configure Specifications</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Choose Size/Weight</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {group.options.map((opt: CategoryOption) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    const newItems = [...formData.items];
                                                                    newItems[itemIdx].subCategory = opt.label;
                                                                    setFormData({ ...formData, items: newItems });
                                                                }}
                                                                className={`px-3 py-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${item.subCategory === opt.label
                                                                    ? "border-amber-500 bg-amber-50 text-amber-600"
                                                                    : "border-amber-500/10 hover:border-amber-500/40"
                                                                    }`}
                                                            >
                                                                <span className="font-bold text-sm">{opt.label}</span>
                                                                {item.subCategory === opt.label && <Check className="w-4 h-4" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">
                                                        Quantity Required ({group.unit})
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            type="text"
                                                            className="w-full bg-leaf/5 border-2 border-transparent focus:border-leaf rounded-xl py-3 px-8 outline-none transition-all font-bold"
                                                            placeholder={`e.g. 1000 ${group.unit}`}
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const newItems = [...formData.items];
                                                                newItems[itemIdx].quantity = e.target.value;
                                                                setFormData({ ...formData, items: newItems });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section: Delivery */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-black text-deep-green  uppercase tracking-tight">Delivery Details</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {deliveryOptions.map((opt: string) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryOption: opt })}
                                            className={`px-3 py-3 rounded-xl border-2 transition-all text-center text-xs font-black uppercase tracking-widest ${formData.deliveryOption === opt
                                                ? "border-amber-500 bg-amber-500 text-white"
                                                : "border-amber-500/10  hover:border-amber-500/30"
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

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Additional Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-leaf/5  border-2 border-transparent focus:border-leaf rounded-xl py-5 px-8 outline-none transition-all font-bold min-h-[100px]"
                                    placeholder="Special size requests, bulk discounts, event orders, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <p className="text-center text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                📌 Our team will contact you within 24 hours to confirm total cost and delivery.
                            </p>
                        </motion.form>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-8 sticky top-32">
                        <div className="bg-amber-500/5 rounded-3xl p-8 md:p-10 border border-amber-500/10 border-dashed relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                            <h3 className="text-3xl font-black text-deep-green  mb-10 leading-none">Order <br /> Summary</h3>

                            <div className="space-y-8">
                                {formData.items.map((item: any, idx: number) => {
                                    const group = categoryGroups[item.categoryId as keyof typeof categoryGroups];
                                    if (!group) return null;

                                    return (
                                        <div key={idx} className="space-y-4 pb-8 border-b border-amber-500/10 last:border-0 last:pb-0">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Category {formData.items.length > 1 ? `#${idx + 1}` : ""}</p>
                                                <p className="font-black text-deep-green uppercase text-lg">{group.name}</p>
                                            </div>

                                            {item.subCategory && (
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Size/Weight</p>
                                                    <p className="font-black text-amber-600 text-lg uppercase">{item.subCategory}</p>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Quantity</p>
                                                <p className="font-black text-deep-green text-lg uppercase">
                                                    {item.quantity ? `${item.quantity} ${group.unit}` : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-2 border-t border-amber-500/10">
                                    <div className="space-y-1 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Delivery Method</p>
                                        <p className="font-black text-deep-green text-lg uppercase">{formData.deliveryOption}</p>
                                    </div>
                                    
                                    <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-amber-500/5">
                                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-foreground/50 font-medium leading-relaxed italic">
                                            Prices may vary based on market conditions. Final quote will be shared during confirmation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            form="order-form"
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? "bg-leaf/50" : "bg-leaf hover:bg-leaf-dark hover:scale-[1.02]"} text-white py-3 rounded-xl font-black text-xl uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-4`}
                        >
                            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="space-y-4">
                            {[
                                { title: "Secure Booking", desc: "Encrypted data handling", icon: ShieldCheck },
                                { title: "Expert Care", desc: "Hygienic processing", icon: Check },
                                { title: "Fast Support", desc: "24h Response guaranteed", icon: Phone },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white/50  p-6 rounded-2xl border border-earth/5  backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-leaf" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-deep-green  text-sm uppercase tracking-tight">{item.title}</h4>
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

