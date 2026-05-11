"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Truck, User, Phone, MapPin, Mail, ChevronRight, Info, ShieldCheck, Check, CheckCircle, AlertCircle } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { createOrder } from "../actions/order";
import { getOrderCategories } from "../actions/order-categories";
import { toast } from "sonner";

const deliveryOptions = [
    "Pickup",
    "Home Delivery",
    "Farm-to-Farm Transfer (for live fish)"
];

export default function BookedOrderPage() {
    const router = useRouter();
    const [categoryGroups, setCategoryGroups] = useState<Record<string, CategoryGroup>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        country: "Nigeria",
        state: "Lagos",
        postalCode: "",
        categories: [] as string[],
        items: [] as any[],
        deliveryOption: "Home Delivery",
        notes: "",
    });

    useEffect(() => {
        async function fetchCategories() {
            const result = await getOrderCategories();
            if (result.success && result.categories) {
                setCategoryGroups(result.categories);

                // Removed auto-initialization of first category per request
            }
            setIsLoading(false);
        }
        fetchCategories();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.categories.length === 0) {
            alert("Please select at least one product category.");
            return;
        }

        for (const catId of formData.categories) {
            const hasItem = formData.items.some((i: any) => i.categoryId === catId);
            if (!hasItem) {
                const group = categoryGroups[catId as keyof typeof categoryGroups];
                alert(`Please select a size/weight for ${group?.name || 'a selected product'}.`);
                return;
            }
        }

        for (const item of formData.items) {
            const group = categoryGroups[item.categoryId as keyof typeof categoryGroups];
            if (!item.quantity || Number(item.quantity) <= 0) {
                alert(`Please enter a valid quantity for ${group?.name || 'a product'}${item.subCategory ? ` (${item.subCategory})` : ''}.`);
                return;
            }
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Processing your order...");

        const submissionData = { 
            ...formData,
            category: formData.categories.map(catId => categoryGroups[catId]?.name || catId).join(', '),
            subCategory: formData.items.map((i: any) => i.subCategory).filter(Boolean).join(', '),
            quantity: formData.items.map((i: any) => {
                const group = categoryGroups[i.categoryId];
                return `${i.quantity}${group?.unit || ''}${i.subCategory ? ` (${i.subCategory})` : ''}`;
            }).join('; ')
        };

        try {
            const result = await createOrder(submissionData);
            setIsSubmitting(false);

            if (result.success) {
                toast.success("Order placed successfully!", {
                    id: toastId,
                    description: "Thank you! Our team will contact you within 24 hours."
                });
                
                router.push(`/checkout/success?orderId=${result.orderId}`);
                
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    streetAddress: "",
                    city: "",
                    country: "Nigeria",
                    state: "Lagos",
                    postalCode: "",
                    categories: [],
                    items: [],
                    deliveryOption: "Home Delivery",
                    notes: "",
                });
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
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-leaf border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-deep-green font-black uppercase tracking-widest animate-pulse">Loading...</p>
            </div>
        );
    }

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

    const isFormValid = useMemo(() => {
        // Standard fields
        if (!formData.name || !formData.streetAddress || !formData.country || !formData.state) return false;
        if (formData.deliveryOption !== "Pickup" && (!formData.city || !formData.postalCode)) return false;

        if (formData.categories.length === 0) return false;

        for (const catId of formData.categories) {
            const hasItem = formData.items.some((i: any) => i.categoryId === catId);
            if (!hasItem) return false;
        }

        for (const item of formData.items) {
            if (!item.quantity || Number(item.quantity) <= 0) return false;
        }

        return true;
    }, [formData, categoryGroups]);


    return (
        <div className="min-h-screen bg-background pt-8 pb-24 relative overflow-x-clip">
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
                                            required
                                            type="text"
                                            className="w-full bg-white border border-earth/10 focus:border-foreground/30 rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                            placeholder="0909 300 9400"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section: Product Selection */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-8 h-8 flex items-center justify-center text-leaf">
                                        <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground tracking-tight">Product Selection</h2>
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Select Products & Quantities</label>
                                    <div className="space-y-4">
                                        {Object.entries(categoryGroups).map(([id, group]: [string, CategoryGroup]) => {
                                            const isSelected = formData.categories.includes(id);
                                            const categoryItems = formData.items.filter((i: any) => i.categoryId === id);

                                            return (
                                                <div key={id} className={`rounded-xl border transition-all overflow-hidden ${isSelected ? "border-foreground bg-white" : "border-earth/10 bg-white hover:border-earth/20"}`}>
                                                    {/* Selection Header */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            let newCategories = [...formData.categories];
                                                            let newItems = [...formData.items];

                                                            if (isSelected) {
                                                                newCategories = newCategories.filter(c => c !== id);
                                                                newItems = newItems.filter((i: any) => i.categoryId !== id);
                                                            } else {
                                                                newCategories.push(id);
                                                                if (!group.options || group.options.length === 0) {
                                                                    newItems.push({ categoryId: id, subCategory: "", quantity: "" });
                                                                }
                                                            }

                                                            setFormData({ ...formData, categories: newCategories, items: newItems });
                                                        }}
                                                        className={`w-full py-5 px-3 flex items-center gap-6 text-left transition-colors ${isSelected ? "bg-foreground/[0.02]" : "hover:bg-foreground/[0.01]"}`}
                                                    >
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                            <Image
                                                                src={group.image}
                                                                alt={group.name}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${isSelected ? "text-foreground/70" : "text-foreground/40"}`}>
                                                                {id.replace('-', ' ')}
                                                            </p>
                                                            <h3 className="font-medium text-foreground leading-tight text-lg">{group.name}</h3>
                                                        </div>
                                                        <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "bg-leaf border-leaf text-white" : "border-earth/20"}`}>
                                                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                        </div>
                                                    </button>

                                                    {/* Inline Configuration Form */}
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-6 pt-0 space-y-8 border-t border-earth/5 mt-4">
                                                                    <div className="pt-6">
                                                                        {group.options && group.options.length > 0 ? (
                                                                            <div className="space-y-4">
                                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Select Sizes & Quantities</label>
                                                                                <div className="grid sm:grid-cols-2 gap-4">
                                                                                    {group.options.map((opt: CategoryOption) => {
                                                                                        const catItem = categoryItems.find((i: any) => i.subCategory === opt.label);
                                                                                        const isOptSelected = !!catItem;
                                                                                        
                                                                                        return (
                                                                                            <div key={opt.value} className={`p-4 rounded-xl border transition-all ${isOptSelected ? 'border-leaf bg-leaf/[0.03]' : 'border-earth/10 hover:border-earth/20 bg-white'}`}>
                                                                                                <div className="flex items-center justify-between gap-4">
                                                                                                    <span className={`text-xs font-bold uppercase tracking-wider ${isOptSelected ? 'text-leaf' : 'text-foreground/60'}`}>{opt.label}</span>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                            let newItems = [...formData.items];
                                                                                                            if (isOptSelected) {
                                                                                                                newItems = newItems.filter((i: any) => !(i.categoryId === id && i.subCategory === opt.label));
                                                                                                            } else {
                                                                                                                newItems.push({ categoryId: id, subCategory: opt.label, quantity: "" });
                                                                                                            }
                                                                                                            setFormData({ ...formData, items: newItems });
                                                                                                        }}
                                                                                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isOptSelected ? 'bg-leaf border-leaf text-white' : 'border-earth/20'}`}
                                                                                                    >
                                                                                                        {isOptSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                                                                    </button>
                                                                                                </div>
                                                                                                <AnimatePresence>
                                                                                                    {isOptSelected && (
                                                                                                        <motion.div
                                                                                                            initial={{ height: 0, opacity: 0 }}
                                                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                                                            exit={{ height: 0, opacity: 0 }}
                                                                                                            className="overflow-hidden"
                                                                                                        >
                                                                                                            <div className="pt-4">
                                                                                                                <input
                                                                                                                    required
                                                                                                                    type="text"
                                                                                                                    className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-2 px-3 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                                                                                                    placeholder={`Qty (${group.unit})`}
                                                                                                                    value={catItem.quantity}
                                                                                                                    onChange={(e) => {
                                                                                                                        const newItems = [...formData.items];
                                                                                                                        const updateIdx = newItems.findIndex((i: any) => i.categoryId === id && i.subCategory === opt.label);
                                                                                                                        if (updateIdx > -1) {
                                                                                                                            newItems[updateIdx].quantity = e.target.value;
                                                                                                                            setFormData({ ...formData, items: newItems });
                                                                                                                        }
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </motion.div>
                                                                                                    )}
                                                                                                </AnimatePresence>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            /* Simple Quantity Input for categories without sub-options */
                                                                            <div className="space-y-3">
                                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">
                                                                                    Quantity ({group.unit})
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <input
                                                                                        required
                                                                                        type="text"
                                                                                        className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
                                                                                        placeholder={`e.g. 1000 ${group.unit}`}
                                                                                        value={categoryItems[0]?.quantity || ""}
                                                                                        onChange={(e) => {
                                                                                            const newItems = [...formData.items];
                                                                                            const updateIdx = newItems.findIndex((i: any) => i.categoryId === id);
                                                                                            if (updateIdx > -1) {
                                                                                                newItems[updateIdx].quantity = e.target.value;
                                                                                                setFormData({ ...formData, items: newItems });
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
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

                                <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
                                    {deliveryOptions.map((opt: string) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryOption: opt })}
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
                                                    required
                                                    className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium appearance-none cursor-pointer text-foreground"
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
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 rotate-90 pointer-events-none transition-colors" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">State / Province</label>
                                            <div className="relative group">
                                                <select
                                                    required
                                                    className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium appearance-none cursor-pointer disabled:opacity-50 text-foreground"
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
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 rotate-90 pointer-events-none transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">City / Town</label>
                                            <input
                                                required={formData.deliveryOption !== "Pickup"}
                                                type="text"
                                                list="city-suggestions"
                                                className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30 disabled:opacity-50 text-foreground"
                                                placeholder="e.g. Ikeja"
                                                value={formData.city}
                                                disabled={!formData.state}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                            <datalist id="city-suggestions">
                                                {formData.state && formData.country && (() => {
                                                    const countryCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode || "";
                                                    const stateCode = State.getStatesOfCountry(countryCode).find(s => s.name === formData.state)?.isoCode || "";
                                                    const cities = City.getCitiesOfState(countryCode, stateCode);

                                                    return cities.map((city) => (
                                                        <option key={city.name} value={city.name} />
                                                    ));
                                                })()}
                                            </datalist>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Postal / Zip Code</label>
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
                                            required={formData.deliveryOption !== "Pickup"}
                                            type="text"
                                            className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-3 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30"
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
                                        <p className="text-[10px] font-medium text-foreground/50 ml-1">
                                            Note: Pickup points are currently only available across Lagos and Ogun State.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Additional Notes (Optional)</label>
                                <textarea
                                    className="w-full bg-white border border-earth/10 focus:border-leaf rounded-lg py-4 px-4 outline-none transition-all text-sm font-medium placeholder:text-foreground/30 min-h-[100px]"
                                    placeholder="Special size requests, bulk discounts, event orders, etc."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <p className="text-center text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                                Our team will contact you within 24 hours to confirm total cost.
                            </p>
                        </motion.form>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-6 lg:sticky lg:top-32">
                        <div className="bg-white rounded-xl md:rounded-3xl p-6 md:p-8 border border-earth/10 relative overflow-hidden">
                            <h3 className="text-2xl font-semibold text-deep-green mb-8 leading-tight">Order Summary</h3>

                            <div className="space-y-6">
                                {formData.items.map((item: any, idx: number) => {
                                    const group = categoryGroups[item.categoryId as keyof typeof categoryGroups];
                                    if (!group) return null;

                                    return (
                                        <div key={idx} className="flex gap-4 pb-6 border-b border-earth/5 last:border-0 last:pb-0">
                                            <div className="relative w-12 h-12 rounded-xl border border-earth/5 bg-[#fafafa] shrink-0 overflow-hidden">
                                                <Image src={group.image} alt={group.name} fill className="object-contain" />
                                            </div>
                                            
                                            <div className="flex-grow flex flex-col justify-center">
                                                <p className="font-semibold text-foreground text-sm leading-tight mb-1">{group.name}</p>
                                                
                                                <div className="flex items-center text-xs font-medium text-foreground/50">
                                                    {item.subCategory ? (
                                                        <span>{item.subCategory}</span>
                                                    ) : (
                                                        <span className="text-earth/40 italic">No size selected</span>
                                                    )}
                                                    
                                                    <span className="mx-2 text-earth/30">•</span>
                                                    
                                                    {item.quantity ? (
                                                        <span className="text-leaf">{item.quantity} {group.unit}</span>
                                                    ) : (
                                                        <span className="text-earth/40 italic">Qty required</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-2 border-t border-earth/5">
                                    <div className="space-y-1 mb-6">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Delivery Method</p>
                                        <p className="font-bold text-foreground text-base">{formData.deliveryOption}</p>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-foreground/[0.02] rounded-xl border border-earth/5">
                                        <Info className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-foreground/50 font-medium leading-relaxed">
                                            Prices may vary based on market conditions. Final quote will be shared during confirmation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            form="order-form"
                            type="submit"
                            disabled={isSubmitting || !isFormValid}
                            className={`w-full ${isSubmitting || !isFormValid ? "bg-deep-green/50 text-white/40 cursor-not-allowed" : "bg-deep-green hover:bg-[#0f2f21] text-white"} py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4`}
                        >
                            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="space-y-3">
                            {[
                                { title: "Secure Booking", desc: "Encrypted data handling", icon: ShieldCheck },
                                { title: "Expert Care", desc: "Hygienic processing", icon: Check },
                                { title: "Fast Support", desc: "24h Response guaranteed", icon: Phone },
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

