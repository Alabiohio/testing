"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, MessageSquare, PhoneCall, Calendar } from "lucide-react";
import confetti from "canvas-confetti";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background pt-20 pb-32 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Decorative backgrounds */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-leaf/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full p-8 md:p-16 text-center relative z-10"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-24 h-24 bg-deep-green rounded-3xl flex items-center justify-center text-white mx-auto mb-10"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-deep-green mb-6 tracking-tighter leading-tight"
                >
                    Order Placed <br /><span className="text-deep-green/60 italic font-medium">Successfully!</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-foreground/50 font-medium mb-12 max-w-md mx-auto leading-relaxed"
                >
                    Thank you for choosing CCB Farms. Your order has been received and is being processed.
                </motion.p>

                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                    {[
                        { icon: PhoneCall, title: "Quick Callback", desc: "Our team will call you within 24 hours" },
                        { icon: Calendar, title: "Delivery Date", desc: "We'll coordinate the best time with you" },
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-[#f8f9f6] p-6 rounded-2xl border border-black/5 text-left"
                        >
                            <item.icon className="w-6 h-6 text-deep-green mb-3" />
                            <h4 className="font-black text-deep-green text-sm uppercase tracking-tight mb-1">{item.title}</h4>
                            <p className="text-xs text-foreground/40 font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link 
                        href="/shop" 
                        className="bg-deep-green text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#0f2f21] transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <ShoppingBag className="w-5 h-5" /> Continue Shopping
                    </Link>
                    <Link 
                        href="/contact" 
                        className="bg-[#edf1eb] text-deep-green px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#e2e9df] transition-all"
                    >
                        <MessageSquare className="w-5 h-5" /> Need Help?
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function SuccessPageClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-deep-green/20 border-t-deep-green rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
