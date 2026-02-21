"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, ShieldCheck, TrendingUp, Info } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        id: "fingerlings",
        name: "Fingerlings",
        description: "Strong, healthy fingerlings with high survival rates—ideal for new ponds and commercial farms. Fast-growing strains, disease-free, and carefully sorted.",
        image: "/assets/bgImages/fingerlings.png",
        specs: ["Size: 5-30g", "Strain: Fast growing", "Status: Disease-free"],
        price: "₦80 – ₦150 per piece",
    },
    {
        id: "juveniles",
        name: "Juveniles",
        description: "Well-developed juveniles ready for rapid growth and smooth transition to table size. Uniform sizes and reduced grow-out time.",
        image: "/assets/bgImages/juveniles.png",
        specs: ["Size: 50-300g", "Response: Excellent feeding", "Grow-out: Reduced"],
        price: "₦300 – ₦700 per piece",
    },
    {
        id: "table-size",
        name: "Fresh Table-Size",
        description: "Freshly harvested, hygienically handled catfish for home use, restaurants, and bulk buyers. Meaty, nutritious, and available in various weights.",
        image: "/assets/bgImages/tablesize.png",
        specs: ["Weight: 0.5kg - 2kg+", "Harvest: Same-day", "Quality: Meaty"],
        price: "₦1,500 – ₦3,500 per kg",
    },
    {
        id: "smoked",
        name: "Smoked Catfish",
        description: "Richly smoked catfish with long shelf life and irresistible flavor. Properly cleaned, no artificial preservatives. Perfect for retail and export.",
        image: "/assets/bgImages/smoked.png",
        specs: ["Shelf Life: Long", "Preservatives: None", "Flavor: Irresistible"],
        price: "₦4,000 – ₦8,000 per kg",
    },
    {
        id: "broodstock",
        name: "Broodstock",
        description: "High-quality broodstock selected for breeding and hatchery use. Proven genetics and high fertility rates for serious fish farmers.",
        image: "/assets/bgImages/broodstock.png",
        specs: ["Weight: 1.5kg - 3kg+", "Fertility: High", "Genetics: Proven"],
        price: "₦4,000 – ₦10,000 per fish",
    },
];

export default function CategoryPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 text-leaf rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
                    >
                        Explore Our Range
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-black text-deep-green dark:text-white mb-8 tracking-tighter"
                    >
                        Organic Catfish <br className="hidden sm:block" />
                        <span className="text-leaf">Categories</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-foreground/60 max-w-2xl leading-relaxed"
                    >
                        From the earliest stages of growth to premium smoked products, we offer the finest selection of sustainable aquaculture produce.
                    </motion.p>
                </header>

                <div className="grid gap-12">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            id={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            className="grid lg:grid-cols-2 gap-12 items-center p-6 md:p-12 rounded-[40px] md:rounded-[60px] border-2 border-earth/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm group hover:border-leaf/20 transition-all scroll-mt-32"
                        >
                            <div className={`w-full max-w-[500px] lg:max-w-none mx-auto ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                <div className="relative aspect-[4/3] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className={`space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                    <h2 className="text-3xl md:text-4xl font-black text-deep-green dark:text-leaf">{cat.name}</h2>
                                    <span className="bg-leaf text-white px-4 py-2 rounded-full text-xs font-black whitespace-normal sm:whitespace-nowrap w-fit mx-auto sm:mx-0">
                                        {cat.price}
                                    </span>
                                </div>

                                <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-medium">
                                    {cat.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
                                    {cat.specs.map((spec, sIdx) => (
                                        <div key={sIdx} className="flex items-center justify-center lg:justify-start gap-2 bg-leaf/5 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-leaf/10">
                                            <ShieldCheck className="w-4 h-4 text-leaf shrink-0" />
                                            <span className="text-[10px] md:text-xs font-bold text-deep-green dark:text-leaf-dark uppercase tracking-wider">{spec}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                                    <Link href={`/booked-order?cat=${cat.id}`} className="bg-leaf hover:bg-leaf-dark text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all">
                                        Order {cat.name}
                                        <ShoppingBag className="w-5 h-5" />
                                    </Link>
                                    <button className="border-2 border-earth/20 dark:border-white/10 hover:border-leaf text-foreground px-8 py-4 rounded-2xl font-bold transition-all">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
