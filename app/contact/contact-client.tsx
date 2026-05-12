"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowRight, Instagram, Facebook, Twitter, CheckCircle } from "lucide-react";
import { createContact } from "../actions/contact";
import { useState } from "react";

export default function ContactPageClient() {
    const contactInfo = [
        {
            title: "Call Us",
            value: "0909 300 9400",
            desc: " ",
            icon: Phone,
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500",
        },
        {
            title: "WhatsApp",
            value: "0909 300 9400",
            desc: "Instant chat support",
            icon: MessageSquare,
            bgColor: "bg-green-500/10",
            iconColor: "text-green-500",
        },
        {
            title: "Email Us",
            value: "hello@ccbfarms.com",
            desc: "We reply within 24h",
            icon: Mail,
            bgColor: "bg-orange-500/10",
            iconColor: "text-orange-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background pt-8 pb-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-8">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-deep-green  mb-8 tracking-tighter"
                    >
                        Contact the <br />
                        <span className="text-deep-green/75">CCB Farms team</span>
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
                                    className="bg-white p-8 rounded-xl shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 group hover:border-black/12 transition-all"
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${method.bgColor}`}>
                                        <method.icon className={`w-7 h-7 ${method.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-deep-green  mb-2">{method.title}</h3>
                                    <p className="font-bold text-foreground/80 mb-2">{method.value}</p>
                                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">{method.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white p-10 rounded-xl border border-black/6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                            <div className="flex gap-6 mb-8">
                                <div className="w-16 h-16 rounded-xl bg-[#f4f5f1] flex items-center justify-center shrink-0">
                                    <MapPin className="w-8 h-8 text-deep-green" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-deep-green  mb-2">Our Location</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-black text-deep-green uppercase tracking-widest mb-1">Lagos Flagship Office</p>
                                            <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                                                Suite A51, Primal Tek Plaza, <br />
                                                63/65 Egbeda-Idimu Road, <br />
                                                Egbeda, Lagos State, Nigeria
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-deep-green uppercase tracking-widest mb-1">Ogun State Farm</p>
                                            <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                                                Awowo Farm Settlements, <br />
                                                Abeokuta, Ogun State
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-10 md:p-14 rounded-xl shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6"
                    >
                        <h2 className="text-3xl font-black text-deep-green  mb-10 tracking-tight">Send Message</h2>

                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "Product Inquiry",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createContact(formData);

        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
            setFormData({
                name: "",
                email: "",
                subject: "Product Inquiry",
                message: ""
            });
            setTimeout(() => setIsSuccess(false), 5000);
        } else {
            alert(result.error || "Failed to send message. Please try again.");
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#edf1eb] border border-deep-green/15 rounded-xl p-12 text-center space-y-6"
            >
                <div className="w-20 h-20 bg-deep-green rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-deep-green">Message Sent!</h3>
                <p className="text-foreground/60 font-medium leading-relaxed">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="text-deep-green font-black uppercase tracking-widest text-xs hover:underline pt-4"
                >
                    SEND ANOTHER MESSAGE
                </button>
            </motion.div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Full Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-xl py-3 px-8 outline-none transition-all font-bold"
                    placeholder="How should we address you?"
                />
            </div>
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Email Address</label>
                <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-xl py-3 px-8 outline-none transition-all font-bold"
                    placeholder="your@email.com"
                />
            </div>
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Subject</label>
                <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-xl py-3 px-8 outline-none transition-all font-bold appearance-none"
                >
                    <option>Product Inquiry</option>
                    <option>Training Enrolment</option>
                    <option>Partnership</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Message</label>
                <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-xl py-3 px-8 outline-none transition-all font-bold min-h-[150px]"
                    placeholder="Tell us what you need help with..."
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-deep-green/50' : 'bg-deep-green hover:bg-[#0f2f21]'} text-white py-5 rounded-xl font-black text-base uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-4`}
            >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                <ArrowRight className="w-6 h-6" />
            </button>
        </form>
    );
}
