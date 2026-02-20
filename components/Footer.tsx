"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About Us', href: '/#about' },
            { name: 'Category', href: '/category' },
            { name: 'Training', href: '/training' },
            { name: 'Contact Us', href: '/contact' },
        ],
        services: [
            { name: 'Fingerlings', href: '/category' },
            { name: 'Juveniles', href: '/category' },
            { name: 'Training Programs', href: '/training' },
            { name: 'Bulk Orders', href: '/booked-order' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Refund Policy', href: '/refund' },
        ]
    };

    return (
        <footer className="bg-white dark:bg-[#0a0d0a] border-t border-earth/10 dark:border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block relative w-32 h-12">
                            <Image
                                src="/ccbLogo.png"
                                alt="CCB Farms Logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-foreground/60 leading-relaxed max-w-xs font-medium">
                            Nurturing excellence in sustainable aquaculture. From pond to plate, we provide the finest organic catfish and professional training.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center text-leaf hover:bg-leaf hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-deep-green dark:text-leaf font-black text-sm uppercase tracking-widest mb-6">Explore</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-foreground/60 hover:text-leaf transition-colors font-medium flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-deep-green dark:text-leaf font-black text-sm uppercase tracking-widest mb-6">How we help</h4>
                        <ul className="space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-foreground/60 hover:text-leaf transition-colors font-medium flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-deep-green dark:text-leaf font-black text-sm uppercase tracking-widest mb-6">Get in Touch</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-leaf/5 rounded-2xl">
                                    <MapPin className="w-5 h-5 text-leaf" />
                                </div>
                                <p className="text-foreground/60 font-medium">Ogun State and Lagos, <br />Nigeria</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-leaf/5 rounded-2xl">
                                    <Phone className="w-5 h-5 text-leaf" />
                                </div>
                                <a href="tel:+2349093009400" className="text-foreground/60 hover:text-leaf font-medium transition-colors">0909 300 9400</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-leaf/5 rounded-2xl">
                                    <Mail className="w-5 h-5 text-leaf" />
                                </div>
                                <a href="mailto:hello@ccbfarms.com" className="text-foreground/60 hover:text-leaf font-medium transition-colors">hello@ccbfarms.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-earth/10 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-foreground/40 text-sm font-medium">
                        © {currentYear} CCB Farms. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-foreground/40 hover:text-leaf text-sm font-medium transition-colors">
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
