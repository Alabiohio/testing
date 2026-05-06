"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { PriceCatalogItem } from "@/lib/db/schema";

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

// Fallback images if DB doesn't have them
const fallbackImages: Record<string, string> = {
    "Fingerlings": "/assets/bgImages/fingerlings.png",
    "Juvenile Catfish": "/assets/bgImages/juveniles.png",
    "Fresh Table-Size": "/assets/bgImages/tablesize.png",
    "Smoked Catfish": "/assets/bgImages/smoked.png",
    "Broodstock": "/assets/bgImages/broodstock.png",
};

// Helper to get slug from name
const getSlug = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("fingerling")) return "fingerlings";
    if (n.includes("juvenile")) return "juveniles";
    if (n.includes("table-size")) return "table-size";
    if (n.includes("smoked")) return "smoked";
    if (n.includes("broodstock")) return "broodstock";
    return n.replace(/\s+/g, "-");
};

export default function CategoryClient({ initialPriceCatalog }: CategoryClientProps) {
    const { addItem } = useCart();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background pt-12 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 max-w-5xl mx-auto">
                    {initialPriceCatalog.map((cat, idx) => {
                        const slug = getSlug(cat.name);
                        const specs = categorySpecs[cat.name] || ["Quality: Premium", "Source: Farm-fresh", "Status: Certified"];
                        const image = cat.imageUrl || fallbackImages[cat.name] || "/hero.png";

                        return (
                            <motion.div
                                key={cat.id}
                                id={slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="grid lg:grid-cols-2 gap-12 items-center p-6 md:p-12 rounded-md border border-black/6 bg-white group hover:border-black/12 transition-all scroll-mt-32 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]"
                            >
                                <div className={`w-full max-w-[500px] lg:max-w-none mx-auto ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                    <Link href={`/${slug}`} className="relative block aspect-[4/3] rounded-md overflow-hidden shadow-sm group-hover:scale-[1.01] transition-transform duration-700">
                                        <Image
                                            src={image}
                                            alt={cat.name}
                                            fill
                                            className="object-contain"
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
                                            <div key={sIdx} className="flex items-center justify-center lg:justify-start gap-2 bg-[#f4f5f1] px-3 md:px-4 py-2 md:py-3 rounded-md border border-black/6">
                                                <ShieldCheck className="w-4 h-4 text-deep-green shrink-0" />
                                                <span className="text-[10px] md:text-xs font-bold text-deep-green uppercase tracking-wider">{spec}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                                        <Link
                                            href={`/book-order/?cat=${slug}`}
                                            className="bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-2.5 rounded-md font-bold flex items-center justify-center gap-3 transition-all"
                                        >
                                            Order {cat.name}
                                            <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                        <Link href={`/${slug}`} className="border border-black/10 hover:border-deep-green text-foreground px-8 py-2.5 rounded-md font-bold transition-all flex items-center justify-center">
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
                        <div key={i} className="bg-white rounded-md p-10 border border-black/6 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                            <div className="w-16 h-16 bg-[#f4f5f1] rounded-md flex items-center justify-center mx-auto mb-6 text-deep-green">
                                <trust.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-deep-green mb-3">{trust.title}</h3>
                            <p className="text-foreground/60 font-medium text-sm leading-relaxed">{trust.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <h3 className="text-3xl font-black text-deep-green mb-6 tracking-tight uppercase">Ready to Explore Categories?</h3>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-deep-green hover:bg-[#0f2f21] text-white px-12 py-5 rounded-md font-black text-base transition-all uppercase tracking-[0.18em]">
                        START SHOPPING
                        <ShoppingBag className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
