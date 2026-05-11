"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PriceCatalogItem } from "@/lib/db/schema";
import { toCategorySlug } from "@/lib/category-slugs";
import { SafeImage } from "./ProductCard";

interface CategoryClientProps {
    initialPriceCatalog: PriceCatalogItem[];
}

// Fallback data for specs since they aren't in the DB yet
const categorySpecs: Record<string, string[]> = {
    "Fingerlings": ["Disease-free", "Fast growing", "Carefully sorted and packaged"],
    "Juvenile Catfish": ["Uniform sizes", "Excellent feeding response", "Reduced grow-out time"],
    "Fresh Table-Size": ["Meaty and nutritious", "Available in various weights", "Same-day harvest available"],
    "Smoked Catfish": ["Properly cleaned and smoked", "No artificial preservatives", "Perfect for retail and export"],
    "Broodstock": ["Proven genetics", "High fertility rates", "Ideal for serious fish farmers"],
};



export default function CategoryClient({ initialPriceCatalog }: CategoryClientProps) {
    return (
        <div className="min-h-screen pt-12 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="grid gap-12 max-w-5xl mx-auto">
                    {initialPriceCatalog.map((cat, idx) => {
                        const slug = toCategorySlug(cat.name);
                        const specs = categorySpecs[cat.name] || ["Quality: Premium", "Source: Farm-fresh", "Status: Certified"];
                        const image = cat.imageUrl;

                        return (
                            <motion.div
                                key={cat.id}
                                id={slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="grid lg:grid-cols-2 gap-12 items-center p-6 md:p-12 rounded-xl border border-black/6 bg-white group hover:border-black/12 transition-all scroll-mt-32 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]"
                            >
                                <div className={`w-full max-w-[500px] lg:max-w-none mx-auto ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                    <Link href={`/category/${slug}`} className="relative block aspect-[4/3] rounded-xl overflow-hidden shadow-sm group-hover:scale-[1.01] transition-transform duration-700">
                                        <SafeImage
                                            src={image}
                                            alt={cat.name}
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform duration-1000"
                                        />
                                    </Link>
                                </div>

                                <div className={`space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                        <h2 className="text-3xl md:text-4xl font-black text-deep-green">{cat.name}</h2>
                                        <span className="bg-deep-green text-white px-4 py-2 rounded-full text-xs font-black whitespace-normal sm:whitespace-nowrap w-fit mx-auto sm:mx-0">
                                            {cat.priceRange} / {cat.unit}
                                        </span>
                                    </div>

                                    <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-medium">
                                        {cat.description}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
                                        {specs.map((spec, sIdx) => (
                                            <div key={sIdx} className="flex items-center justify-center lg:justify-start gap-2 bg-[#f4f5f1] px-3 md:px-4 py-2 md:py-3 rounded-xl border border-black/6">
                                                <ShieldCheck className="w-4 h-4 text-deep-green shrink-0" />
                                                <span className="text-[10px] md:text-xs font-bold text-deep-green uppercase tracking-wider">{spec}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                                        <Link
                                            href={`/book-order/?cat=${slug}`}
                                            className="bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                                        >
                                            Order {cat.name}
                                            <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                        <Link href={`/category/${slug}`} className="border border-black/10 hover:border-deep-green text-foreground px-8 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center">
                                            Explore {cat.name}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Section   */}
                <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Healthy Guarantee",
                            desc: "Every fish is inspected and certified disease-free before dispatch.",
                            icon: ShieldCheck
                        },
                        {
                            title: "Fast Logistics",
                            desc: "Nationwide and international delivery available",
                            icon: TrendingUp
                        },
                    ].map((trust, i) => (
                        <div key={i} className="bg-white rounded-xl p-10 border border-black/6 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                            <div className="w-16 h-16 bg-[#f4f5f1] rounded-xl flex items-center justify-center mx-auto mb-6 text-deep-green">
                                <trust.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-deep-green mb-3">{trust.title}</h3>
                            <p className="text-foreground/60 font-medium text-sm leading-relaxed">{trust.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <h3 className="text-3xl font-black text-deep-green mb-6 tracking-tight uppercase">Ready to Explore Categories?</h3>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-deep-green hover:bg-[#0f2f21] text-white px-12 py-5 rounded-xl font-black text-base transition-all uppercase tracking-[0.18em]">
                        START SHOPPING
                        <ShoppingBag className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
