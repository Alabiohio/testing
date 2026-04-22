"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, ShieldCheck, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

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
        description: "High-quality broodstock selected for commercial breeding and genetic improvement. Proven genetics and high fertility rates for serious fish farmers.",
        image: "/assets/bgImages/broodstock.png",
        specs: ["Weight: 1.5kg - 3kg+", "Fertility: High", "Genetics: Proven"],
        price: "₦4,000 – ₦10,000 per fish",
    },
];

export default function CategoryListingPage() {
    const { addItem } = useCart();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background pt-12 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-black text-deep-green  mb-8 tracking-tighter"
                    >
                        CCB Farms <br className="hidden sm:block" />
                        Official <span className="text-leaf">Category</span>
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
                            className="grid lg:grid-cols-2 gap-12 items-center p-6 md:p-12 rounded-[20px] md:rounded-[20px] border-2 border-earth/5  bg-white/50  backdrop-blur-sm group hover:border-leaf/20 transition-all scroll-mt-32"
                        >
                            <div className={`w-full max-w-[500px] lg:max-w-none mx-auto ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                <Link href={`/${cat.id}`} className="relative block aspect-[4/3] rounded-[20px] md:rounded-[20px] overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>
                            </div>

                            <div className={`space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                    <h2 className="text-3xl md:text-4xl font-black text-deep-green ">{cat.name}</h2>
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
                                            <span className="text-[10px] md:text-xs font-bold text-deep-green  uppercase tracking-wider">{spec}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                                    <button 
                                        onClick={() => {
                                            addItem({
                                                id: cat.id,
                                                name: cat.name,
                                                price: null,
                                                price_range: cat.price,
                                                unit: cat.id === "broodstock" ? "fish" : (cat.id === "table-size" || cat.id === "smoked" ? "kg" : "piece"),
                                                category: cat.id,
                                                imageUrl: cat.image
                                            }, 1);
                                            router.push('/cart');
                                        }}
                                        className="bg-leaf hover:bg-leaf-dark text-white px-8 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                                    >
                                        Order {cat.name}
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                    <Link href={`/${cat.id}`} className="border-2 border-earth/20 hover:border-leaf text-foreground px-8 py-2.5 rounded-2xl font-bold transition-all flex items-center justify-center">
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Healthy Guarantee",
                            desc: "Every fish is inspected and certified disease-free before dispatch.",
                            icon: ShieldCheck
                        },
                        {
                            title: "Fast Logistics",
                            desc: "Nationwide delivery available",
                            icon: TrendingUp
                        },
                        {
                            title: "Expert Support",
                            desc: "Free consulting for all bulk orders and new pond set-ups.",
                            icon: Info
                        }
                    ].map((trust, i) => (
                        <div key={i} className="bg-leaf/5 rounded-3xl p-10 border-2 border-leaf/10 text-center">
                            <div className="w-16 h-16 bg-white  rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl text-leaf">
                                <trust.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-deep-green  mb-3">{trust.title}</h3>
                            <p className="text-foreground/60 font-medium text-sm leading-relaxed">{trust.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <h3 className="text-3xl font-black text-deep-green mb-6 tracking-tight uppercase">Ready to Explore Categories?</h3>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-leaf hover:bg-leaf-dark text-white px-12 py-6 rounded-2xl font-black text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-leaf/30 uppercase tracking-[0.2em]">
                        START SHOPPING
                        <ShoppingBag className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

