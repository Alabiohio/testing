"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShoppingBag, Waves, Fish, ShieldCheck, Stars, ChevronRight } from "lucide-react";

const mainCategories = [
    {
        title: "Farming & Rearing",
        subtitle: "The foundation of your success",
        desc: "Everything you need to start and scale your catfish farm. From resilient fingerlings to robust juveniles, we supply high-growth strains optimized for survival.",
        href: "/category?filter=Farming",
        image: "/assets/bgImages/juveniles.png",
        icon: Waves,
        features: ["High Survival Rates", "Fast-Growing Strains", "Uniform Sizing"],
        color: "from-blue-500 to-blue-700",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600"
    },
    {
        title: "Consumption & Retail",
        subtitle: "Farm-to-table excellence",
        desc: "Premium table-size catfish and artisanal smoked fish for homes, restaurants, and retail. Hygienically handled and delivered fresh to ensure maximum nutrition.",
        href: "/category?filter=Consumption",
        image: "/assets/bgImages/tablesize.png",
        icon: Fish,
        features: ["Same-Day Harvest", "Organic Feed Only", "Hygienically Packed"],
        color: "from-leaf to-deep-green",
        lightColor: "bg-leaf/5",
        textColor: "text-leaf"
    },
    {
        title: "Elite Breeding",
        subtitle: "Superior genetics for aquaculture",
        desc: "Expertly selected broodstock for commercial breeding and genetic improvement. High fertility rates and proven performance for serious aquaculture investors.",
        href: "/category?filter=Breeding",
        image: "/assets/bgImages/broodstock.png",
        icon: Stars,
        features: ["Proven Genetics", "High Fertility", "Expert Support"],
        color: "from-purple-500 to-purple-700",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600"
    }
];

export default function ShopOverviewPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-leaf/5 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-leaf/10 text-leaf rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            Explore Our Universe
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-black text-deep-green mb-6 tracking-tight">
                            Select Your <span className="text-leaf">Shop</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                            Whether you're starting a farm or stocking your kitchen, we provide premium aquaculture solutions tailored to your specific needs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="flex flex-col gap-16 md:gap-24">
                    {mainCategories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Image Part */}
                            <div className="w-full lg:w-1/2 group">
                                <Link href={cat.href} className="block relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group-hover:shadow-leaf/20 transition-all duration-500">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    
                                    {/* Icon Floating Badge */}
                                    <div className={`absolute top-6 right-6 w-16 h-16 rounded-2xl ${cat.lightColor} backdrop-blur-md flex items-center justify-center shadow-xl`}>
                                        <cat.icon className={`w-8 h-8 ${cat.textColor}`} />
                                    </div>
                                </Link>
                            </div>

                            {/* Content Part */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div>
                                    <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-3 ${cat.textColor}`}>
                                        {cat.subtitle}
                                    </h4>
                                    <h2 className="text-3xl sm:text-5xl font-black text-deep-green mb-6 leading-tight">
                                        {cat.title}
                                    </h2>
                                    <p className="text-lg text-gray-500 leading-relaxed font-medium">
                                        {cat.desc}
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {cat.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full ${cat.lightColor} flex items-center justify-center shrink-0`}>
                                                <ShieldCheck className={`w-4 h-4 ${cat.textColor}`} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={cat.href}
                                        className={`inline-flex items-center justify-center gap-2 transition-all px-8 py-4 rounded-2xl font-black tracking-wide text-white bg-gradient-to-r ${cat.color} hover:shadow-xl hover:-translate-y-1 active:scale-95`}
                                    >
                                        Explore Products
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-gray-600 border-2 border-gray-100 hover:border-leaf/20 hover:bg-leaf/5 transition-all"
                                    >
                                        Expert Consultation
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Varieties Section */}
            <section className="bg-gray-50 py-24 mb-24 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-leaf/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-sm font-black text-leaf uppercase tracking-[0.3em]">Quick Navigation</span>
                        <h2 className="text-3xl md:text-5xl font-black text-deep-green mt-4 tracking-tighter">Shop by Variety</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { name: "Fingerlings", id: "fingerlings", icon: "🌱" },
                            { name: "Juveniles", id: "juveniles", icon: "🐟" },
                            { name: "Table-Size", id: "table-size", icon: "🍽️" },
                            { name: "Smoked Meat", id: "smoked", icon: "🔥" },
                            { name: "Broodstock", id: "broodstock", icon: "🧬" }
                        ].map((variety) => (
                            <Link 
                                key={variety.id} 
                                href={`/${variety.id}`}
                                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all text-center group"
                            >
                                <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{variety.icon}</div>
                                <h3 className="font-black text-deep-green group-hover:text-leaf transition-colors">{variety.name}</h3>
                                <div className="mt-4 flex items-center justify-center text-leaf opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase tracking-widest mr-2">Explore</span>
                                    <ChevronRight className="w-3 h-3" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-deep-green rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center text-white">
                    <div className="absolute inset-0 opacity-10 bg-[url('/assets/bgImages/hero.png')] bg-cover bg-center" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Not sure where to start?</h2>
                        <p className="text-white/70 text-lg mb-10 font-medium leading-relaxed">
                            Our team is here to help you choose the right fish for your specific needs, whether for commercial farming or home consumption.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-leaf hover:bg-leaf-dark text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:-translate-y-1 shadow-2xl shadow-black/20"
                        >
                            Speak with an Expert
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
