"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";

export default function ContactPage() {
    const contactInfo = [
        {
            title: "Call Us",
            value: "0909 300 9400",
            desc: "Mon-Sat, 8am-6pm",
            icon: Phone,
            color: "bg-blue-500",
        },
        {
            title: "WhatsApp",
            value: "0909 300 9400",
            desc: "Instant chat support",
            icon: MessageSquare,
            color: "bg-green-500",
        },
        {
            title: "Email Us",
            value: "hello@ccbfarms.com",
            desc: "We reply within 24h",
            icon: Mail,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-leaf rounded-full blur-[150px]" />
                <div className="absolute bottom-20 left-[-10%] w-[400px] h-[400px] bg-earth rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 text-leaf rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
                    >
                        Get In Touch
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-deep-green dark:text-white mb-8 tracking-tighter"
                    >
                        Contact <br />
                        <span className="text-leaf">CCB Farms</span>
                    </motion.h1>
                    <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
                        Have questions about our products or training? Reach out to us through any of the channels below or visit our farm.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Left Column: Contact Methods */}
                    <div className="space-y-12">
                        <div className="grid sm:grid-cols-2 gap-8">
                            {contactInfo.map((method, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-2xl shadow-black/5 border border-earth/5 dark:border-white/5 group hover:border-leaf/30 transition-all"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${method.color} bg-opacity-10`}>
                                        <method.icon className={`w-7 h-7 ${method.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-deep-green dark:text-white mb-2">{method.title}</h3>
                                    <p className="font-bold text-foreground/80 mb-2">{method.value}</p>
                                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">{method.desc}</p>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-deep-green p-8 rounded-[40px] text-white overflow-hidden relative"
                            >
                                <Clock className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                                <h3 className="text-xl font-black mb-4">Farm Hours</h3>
                                <div className="space-y-2 relative z-10">
                                    <p className="flex justify-between text-sm font-bold uppercase tracking-wider">
                                        <span>Mon - Fri</span>
                                        <span className="text-leaf">8:00 - 18:00</span>
                                    </p>
                                    <p className="flex justify-between text-sm font-bold uppercase tracking-wider">
                                        <span>Saturday</span>
                                        <span className="text-leaf">9:00 - 16:00</span>
                                    </p>
                                    <p className="flex justify-between text-sm font-bold uppercase tracking-wider">
                                        <span>Sunday</span>
                                        <span className="text-white/40">Closed</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="bg-leaf/5 p-10 rounded-[50px] border border-leaf/10">
                            <div className="flex gap-6 mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-8 h-8 text-leaf" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-deep-green dark:text-leaf mb-2">Our Location</h3>
                                    <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                                        Ogun State and Lagos State, <br />
                                        Nigeria.
                                    </p>
                                </div>
                            </div>
                            <button className="w-full bg-white dark:bg-zinc-900 border border-earth/10 dark:border-white/10 text-deep-green dark:text-leaf py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-leaf hover:text-white transition-all">
                                GET DIRECTIONS ON GOOGLE MAPS
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[60px] shadow-2xl shadow-earth/5 border-2 border-earth/5 dark:border-white/5"
                    >
                        <h2 className="text-3xl font-black text-deep-green dark:text-white mb-10 tracking-tight">Send Message</h2>
                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert("Message Sent!"); }}>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Full Name</label>
                                <input required type="text" className="w-full bg-earth/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf focus:bg-white dark:focus:bg-black rounded-3xl py-5 px-8 outline-none transition-all font-bold" placeholder="How should we address you?" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Email Address</label>
                                <input required type="email" className="w-full bg-earth/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf focus:bg-white dark:focus:bg-black rounded-3xl py-5 px-8 outline-none transition-all font-bold" placeholder="your@email.com" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Subject</label>
                                <select className="w-full bg-earth/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf focus:bg-white dark:focus:bg-black rounded-3xl py-5 px-8 outline-none transition-all font-bold appearance-none">
                                    <option>Product Inquiry</option>
                                    <option>Training Enrolment</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Message</label>
                                <textarea required className="w-full bg-earth/5 dark:bg-white/5 border-2 border-transparent focus:border-leaf focus:bg-white dark:focus:bg-black rounded-3xl py-5 px-8 outline-none transition-all font-bold min-h-[150px]" placeholder="Tell us what you need help with..." />
                            </div>
                            <button type="submit" className="w-full bg-leaf hover:bg-leaf-dark text-white py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-leaf/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-4">
                                SEND MESSAGE
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </form>

                        <div className="mt-12 pt-12 border-t border-earth/5 flex justify-center gap-6">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-leaf/5 flex items-center justify-center text-leaf hover:bg-leaf hover:text-white transition-all transform hover:-translate-y-1">
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
