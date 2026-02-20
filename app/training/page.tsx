"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, ArrowRight, ShieldCheck, Award, MessageSquare } from "lucide-react";
import Link from "next/link";

const trainingModules = [
    {
        title: "Catfish Basics for Beginners",
        duration: "4 Weeks",
        students: "1,200+",
        rating: "4.9",
        desc: "A comprehensive introduction to pond construction, water management, and basic feeding techniques for new farmers.",
        icon: BookOpen,
    },
    {
        title: "Advanced Hatchery Operations",
        duration: "6 Weeks",
        students: "450+",
        rating: "5.0",
        desc: "Master the art of induced breeding, egg incubation, and managing fragile fingerlings for high-scale commercial success.",
        icon: Award,
    },
    {
        title: "Sustainable Farm Management",
        duration: "8 Weeks",
        students: "800+",
        rating: "4.8",
        desc: "Detailed strategies on organic feed production, disease prevention, and financial management for sustainable growth.",
        icon: ShieldCheck,
    },
];

export default function TrainingPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-leaf/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-24">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-deep-green dark:text-white mb-8 tracking-tighter"
                    >
                        Become a Professional <br />
                        <span className="text-leaf">Catfish Farmer</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Join Nigeria&apos;s leading aquaculture training program. We combine decades of hands-on experience with modern, sustainable techniques.
                    </motion.p>
                </header>

                {/* Stats Section 
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {[
                        { label: "Students Trained", value: "2,500+", icon: Users },
                        { label: "Success Rate", value: "94%", icon: ShieldCheck },
                        { label: "Expert Mentors", value: "15+", icon: Award },
                        { label: "Training Hubs", value: "3", icon: MessageSquare },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/50 dark:bg-white/5 border border-earth/10 dark:border-white/10 p-8 rounded-[32px] text-center"
                        >
                            <stat.icon className="w-8 h-8 text-leaf mx-auto mb-4" />
                            <p className="text-3xl font-black text-deep-green dark:text-leaf mb-1">{stat.value}</p>
                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
                */}

                {/* Modules Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {trainingModules.map((module, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-white dark:bg-zinc-900 shadow-2xl shadow-black/5 dark:shadow-none border border-earth/5 dark:border-white/5 p-10 rounded-[48px] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:scale-150 transition-transform duration-700" />

                            <div className="w-14 h-14 bg-leaf/10 rounded-2xl flex items-center justify-center mb-8">
                                <module.icon className="w-7 h-7 text-leaf" />
                            </div>

                            <h3 className="text-2xl font-black text-deep-green dark:text-white mb-6 leading-tight">{module.title}</h3>
                            <p className="text-foreground/60 mb-8 leading-relaxed mb-10">{module.desc}</p>

                            <div className="flex items-center gap-6 mb-10 pt-6 border-t border-foreground/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-leaf" />
                                    <span className="text-sm font-bold text-foreground/40 uppercase tracking-wider">{module.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-leaf" />
                                    <span className="text-sm font-bold text-foreground/40 uppercase tracking-wider">{module.students}</span>
                                </div>
                            </div>

                            <button className="w-full bg-leaf hover:bg-leaf-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-leaf/20">
                                Enroll Now
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-deep-green rounded-[60px] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/event.png')] bg-cover bg-center" />
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black mb-8">Ready to Start Your Journey?</h2>
                        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
                            Don&apos;t just farm, farm like a pro. Get the skills, mentorship, and support you need to succeed in the catfish business.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/contact" className="bg-white text-deep-green px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                                Contact for Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
