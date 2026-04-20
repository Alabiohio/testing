"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowRight, MessageCircle, Shield, Truck, Star, ChevronRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: 'Fingerlings', href: '/fingerlings' },
            { name: 'Juveniles', href: '/juveniles' },
            { name: 'Table-Size Catfish', href: '/table-size' },
            { name: 'Smoked Catfish', href: '/smoked' },
            { name: 'Broodstock', href: '/broodstock' },
            { name: 'Bulk Orders', href: '/book-order' },
        ],
        company: [
            { name: 'About Us', href: '/#about' },
            { name: 'Training Programs', href: '/training' },
            { name: 'Contact Us', href: '/contact' },
            { name: 'Book Order', href: '/book-order' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Refund Policy', href: '/refund' },
        ],
    };

    return (
        <footer className="bg-[#050e05] border-t border-white/5 pt-16 pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top CTA Bar */}
                <div className="bg-leaf/10 border border-leaf/20 rounded-2xl p-6 md:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-white font-black text-xl mb-1">Need help choosing?</h3>
                        <p className="text-white/50 text-sm font-medium">Our catfish experts are available 7 days a week.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <a
                            href="tel:+2349093009400"
                            className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all border border-white/10 whitespace-nowrap"
                        >
                            <Phone className="w-4 h-4 text-leaf" />
                            Call Us
                        </a>
                        <a
                            href="https://wa.me/2349093009400"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 bg-leaf hover:bg-leaf-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-leaf/25 whitespace-nowrap"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </a>
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link href="/" className="inline-block relative w-44 h-44">
                            <Image
                                src="/ccb.png"
                                alt="CCB Farms Logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed font-medium max-w-xs">
                            Nigeria's trusted catfish supplier. From fingerlings to smoked catfish — premium quality, every time.
                        </p>

                        {/* Ratings */}
                        <div className="flex items-center gap-2.5 bg-white/5 border border-white/8 rounded-xl px-4 py-3 w-fit">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                            </div>
                            <div>
                                <p className="text-white font-black text-sm leading-none">4.9/5</p>
                                <p className="text-white/40 text-[10px] font-medium mt-0.5">500+ reviews</p>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex gap-3">
                            {[
                                { Icon: Facebook, href: '#', label: 'Facebook' },
                                { Icon: Instagram, href: '#', label: 'Instagram' },
                                { Icon: Twitter, href: '#', label: 'Twitter' },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-leaf hover:text-white hover:border-leaf transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-5">Category</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/40 hover:text-leaf transition-colors text-sm font-medium flex items-center gap-1.5 group"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0 text-leaf" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-5">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/40 hover:text-leaf transition-colors text-sm font-medium flex items-center gap-1.5 group"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0 text-leaf" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-5">Get in Touch</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-leaf" />
                                </div>
                                <p className="text-white/40 text-sm font-medium leading-relaxed">Ogun State & Lagos,<br />Nigeria</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                    <Phone className="w-3.5 h-3.5 text-leaf" />
                                </div>
                                <a href="tel:+2349093009400" className="text-white/40 hover:text-leaf text-sm font-medium transition-colors">0909 300 9400</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-leaf" />
                                </div>
                                <a href="mailto:hello@ccbfarms.com" className="text-white/40 hover:text-leaf text-sm font-medium transition-colors">hello@ccbfarms.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="border-t border-white/5 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                    {[
                        { icon: Shield, text: "Secure Ordering" },
                        { icon: Truck, text: "Nationwide Delivery" },
                        { icon: Star, text: "4.9/5 Rating" },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                            <Icon className="w-4 h-4 text-leaf" />
                            {text}
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/25 text-xs font-medium">
                        © {currentYear} CCB Farms. All rights reserved. Crafted with care in Nigeria 🇳🇬
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-white/25 hover:text-white/50 text-xs font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

