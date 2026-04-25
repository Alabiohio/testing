"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, MessageCircle, Shield, Truck, ChevronRight, ArrowUpRight, ArrowRight } from 'lucide-react';

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
        <footer className="relative bg-[#111827] overflow-hidden">

            {/* Subtle top green gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] blur-md bg-[#22c55e]/30" />

            <div className="relative z-10 flex justify-center items-center gap-4 sm:gap-10 bg-white/95 py-6 border-b border-black/10 shadow-sm overflow-hidden">
                {/* CCB Farms */}
                <div className="inline-flex flex-col items-end w-36 -ml-2">
                    <div className="relative w-full h-auto flex items-center justify-center overflow-hidden px-1">
                        <Image
                            src="/ccbLg.png"
                            alt="CCB Farms Logo"
                            width={160}
                            height={160}
                            className="object-contain w-full h-auto"
                        />
                    </div>
                    <span className="text-black/70 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                        RC: 3709222
                    </span>
                </div>
                {/* Vertical Divider */}
                <div className="h-8 w-[1.5px] bg-black/10" />

                {/* Techgrow Farms */}
                 <div className="inline-flex flex-col items-end w-36 -ml-2">
                    <div className="relative w-full h-auto flex items-center justify-center overflow-hidden">
                        <Image
                            src="/assets/images/techgrowTrans.png"
                            alt="Techgrow Farms Logo"
                            width={180}
                            height={180}
                            className="object-contain w-full h-auto"
                        />
                    </div>
                    <span className="text-black/70 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                        RC: 8103767
                    </span>
                </div>
            </div>

            {/* Faint radial glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,197,94,0.06),transparent_55%)]" />

            {/* === CTA Banner === */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-0">
                <div className="relative rounded-2xl overflow-hidden mb-16 border border-white/8">
                    {/* Card bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 via-[#22c55e]/5 to-transparent" />
                    <div className="absolute inset-0 bg-[#161f2c]/60 backdrop-blur-sm" />

                    <div className="relative px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div>
                            <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-1">Expert Support</p>
                            <h3 className="text-white font-bold text-lg leading-snug">Need help choosing the right product?</h3>
                            <p className="text-white/45 text-sm mt-0.5">Our catfish experts are available 7 days a week.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <a
                                href="tel:+2349093009400"
                                className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                            >
                                <Phone className="w-4 h-4 text-[#22c55e]" />
                                Call Us
                            </a>
                            <a
                                href="https://wa.me/2349093009400"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#22c55e]/20 whitespace-nowrap"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* === Main Grid === */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-14 border-b border-white/[0.06]">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <div className="inline-flex flex-col items-end w-36 -ml-2">
                            <Link href="/" className="relative w-full">
                                <div className="relative w-32 h-auto flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/ccbLg.png"
                                        alt="CCB Farms Logo"
                                        width={128}
                                        height={128}
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                            <span className="text-white/70 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                                RC: 3709222
                            </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed max-w-[200px]">
                            Nigeria&apos;s trusted catfish supplier — premium quality, every time.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-2.5 pt-1">
                            {[
                                { Icon: Facebook, href: '#', label: 'Facebook' },
                                { Icon: Instagram, href: '#', label: 'Instagram' },
                                { Icon: Twitter, href: '#', label: 'Twitter' },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#22c55e] hover:border-[#22c55e] transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Products</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/90 hover:text-[#22c55e] transition-colors text-sm flex items-center gap-1.5 group"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#22c55e]" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/90 hover:text-[#22c55e] transition-colors text-sm flex items-center gap-1.5 group"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#22c55e]" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                                    <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">Lagos, Nationwide<br />& Internationally</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                                    <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                                </div>
                                <a href="tel:+2349093009400" className="text-white/90 hover:text-[#22c55e] text-sm transition-colors">0909 300 9400</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-[#22c55e]" />
                                </div>
                                <a href="mailto:hello@ccbfarms.com" className="text-white/90 hover:text-[#22c55e] text-sm transition-colors">hello@ccbfarms.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Newsletter</h3>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                            Subscribe for updates and exclusive offers.
                        </p>
                        <form className="relative" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#22c55e]/50 focus:bg-white/10 transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg transition-colors cursor-pointer"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* === Official Partner Bar === */}
                <div className="py-10 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="flex items-center gap-6">
                        {[
                            { icon: Shield, text: "Secure Ordering" },
                            { icon: Truck, text: "Nationwide Delivery" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-white/30 text-xs font-semibold uppercase tracking-wider">
                                <Icon className="w-3.5 h-3.5 text-[#22c55e]" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* === Bottom Bar === */}
                <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/25 text-xs">
                        © {currentYear} CCB Farms. All rights reserved. Crafted with care in Nigeria 🇳🇬
                    </p>
                    <div className="flex items-center gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/25 hover:text-white/55 text-xs transition-colors"
                            >
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
