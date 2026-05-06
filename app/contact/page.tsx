"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowRight, Instagram, Facebook, Twitter, CheckCircle } from "lucide-react";
import { createContact } from "../actions/contact";
import { useState } from "react";

export default function ContactPage() {
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
                                    className="bg-white p-8 rounded-md shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 group hover:border-black/12 transition-all"
                                >
                                    <div className={`w-14 h-14 rounded-md flex items-center justify-center mb-6 ${method.bgColor}`}>
                                        <method.icon className={`w-7 h-7 ${method.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-deep-green  mb-2">{method.title}</h3>
                                    <p className="font-bold text-foreground/80 mb-2">{method.value}</p>
                                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">{method.desc}</p>
                                </motion.div>
                            ))}

                             {/**]
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
                            </motion.div>**/}
                        </div>

                        <div className="bg-white p-10 rounded-md border border-black/6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
                            <div className="flex gap-6 mb-8">
                                <div className="w-16 h-16 rounded-md bg-[#f4f5f1] flex items-center justify-center shrink-0">
                                    <MapPin className="w-8 h-8 text-deep-green" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-deep-green  mb-2">Our Location</h3>
                                    <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                                        Lagos, Nationwide and <br />
                                        Internationally.
                                    </p>
                                </div>
                            </div>                
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-10 md:p-14 rounded-md shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6"
                    >
                        <h2 className="text-3xl font-black text-deep-green  mb-10 tracking-tight">Send Message</h2>
                        
                        <ContactForm />

                        <div className="mt-12 pt-12 border-t border-earth/5 flex justify-center gap-6">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-md bg-[#f4f5f1] flex items-center justify-center text-deep-green hover:bg-deep-green hover:text-white transition-all">
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section 
                <section className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-deep-green  mb-6 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {[
                            {
                                q: "Do you deliver nationwide?",
                                a: "Yes We currently provide reliable delivery services within Nationwide, using optimized transport to ensure our fish arrive healthy and vibrant."
                            },
                            {
                                q: "What are your minimum order quantities?",
                                a: "Minimum order for fingerlings is 500 pieces. For juveniles, it's 200 pieces. Table-size and smoked catfish start from 10kg."
                            },
                            {
                                q: "Are your training programs online or physical?",
                                a: "We offer both! Our theory modules are available online for convenience, followed by intensive physical residency for hands-on farm experience."
                            },
                            {
                                q: "How do I pay for my order?",
                                a: "We accept bank transfers, online card payments, and USSD. Once you place an order, our team will provide a final invoice for secure payment."
                            }
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white  border-2 border-earth/5  rounded-3xl p-8 hover:border-leaf/20 transition-all cursor-help group"
                            >
                                <h3 className="text-xl font-black text-deep-green  mb-4 flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-leaf/10 text-leaf flex items-center justify-center text-xs">Q</span>
                                    {faq.q}
                                </h3>
                                <p className="text-foreground/60 leading-relaxed font-medium pl-12">
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>*/}
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
                className="bg-[#edf1eb] border border-deep-green/15 rounded-md p-12 text-center space-y-6"
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
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-md py-3 px-8 outline-none transition-all font-bold" 
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
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-md py-3 px-8 outline-none transition-all font-bold" 
                    placeholder="your@email.com" 
                />
            </div>
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/30 ml-2">Subject</label>
                <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-md py-3 px-8 outline-none transition-all font-bold appearance-none"
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
                    className="w-full bg-[#f4f5f1] border border-transparent focus:border-deep-green focus:bg-white rounded-md py-3 px-8 outline-none transition-all font-bold min-h-[150px]" 
                    placeholder="Tell us what you need help with..." 
                />
            </div>
            <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-deep-green/50' : 'bg-deep-green hover:bg-[#0f2f21]'} text-white py-5 rounded-md font-black text-base uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-4`}
            >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                <ArrowRight className="w-6 h-6" />
            </button>
        </form>
    );
}

