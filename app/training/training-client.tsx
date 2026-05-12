"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import Link from "next/link";

export default function TrainingPageClient() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-[#edf1eb] rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <Hammer className="w-12 h-12 text-deep-green" />
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-black text-deep-green mb-6 tracking-tighter"
                >
                    Coming <span className="text-deep-green/75">Soon</span>
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed font-medium mb-12"
                >
                    We are currently crafting our comprehensive catfish farming training program. 
                    Check back soon for courses, mentorship, and more.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/" className="inline-flex items-center justify-center bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-sm gap-2">
                        Back to Home
                    </Link>
                </motion.div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#edf1eb] rounded-full blur-3xl opacity-50 -translate-x-1/2 -z-10" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#edf1eb] rounded-full blur-3xl opacity-50 translate-x-1/2 -z-10" />
        </div>
    );
}
