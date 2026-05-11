import React from 'react';
import Link from 'next/link';
import { FileText, Scale, Gavel, AlertCircle, ShoppingBag, Truck, Mail, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | CCB Farms',
  description: 'The legal terms governing your use of CCB Farms services and products.',
};

const TermsAndConditions = () => {
  const lastUpdated = "May 11, 2024";

  return (
    <div className="min-h-screen selection:bg-leaf/20 selection:text-deep-green">
      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-deep-green/70 hover:text-leaf transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-leaf" />
            <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Legal Terms</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-deep-green uppercase tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          {/* Section 1: Agreement */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Gavel className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Agreement to Terms</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              By accessing our website or placing an order with CCB Farms, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, users, and customers of CCB Farms.
            </p>
          </section>

          {/* Section 2: Products & Services */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Products & Services</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              CCB Farms specializes in the supply of quality livestock, primarily catfish (Fingerlings, Juveniles, Table-Size, and Smoked), and provides agricultural training programs.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-50 border border-black/5">
                    <h4 className="text-sm font-black text-deep-green uppercase mb-2">Live Assets</h4>
                    <p className="text-xs text-foreground/50 leading-relaxed font-medium">As we deal with living creatures, health and size may naturally vary. We guarantee quality at the point of fulfillment but are not liable for environmental factors post-delivery.</p>
                </div>
            {/*    <div className="p-5 rounded-2xl bg-zinc-50 border border-black/5">
                    <h4 className="text-sm font-black text-deep-green uppercase mb-2">Training</h4>
                    <p className="text-xs text-foreground/50 leading-relaxed font-medium">Materials provided during training are for personal use only and may not be redistributed without explicit permission.</p>
                </div> */}
            </div>
          </section>

          {/* Section 3: Ordering & Payments */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Ordering & Payments</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              All orders placed through our website are subject to availability and confirmation. We reserve the right to refuse or cancel any order for reasons including stock availability or errors in pricing.
            </p>
            <ul className="space-y-3 p-0 m-0 list-none">
                <li className="flex items-start gap-3 p-4 rounded-xl bg-white border border-black/5">
                    <div className="w-2 h-2 rounded-full bg-leaf mt-1.5 shrink-0" />
                    <p className="text-xs text-foreground/60 font-medium m-0">Prices are subject to change based on market conditions, but will be locked in once an order is confirmed.</p>
                </li>
            </ul>
          </section>

          {/* Section 4: Delivery & Risk */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Delivery & Logistics</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              We offer nationwide delivery for our livestock products. Delivery timelines are estimates and may vary based on logistics and seasonal factors.
            </p>
            <div className="bg-amber-50 border border-amber-200/50 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                    <h4 className="text-sm font-black uppercase m-0">Transfer of Risk</h4>
                </div>
                <p className="text-xs text-amber-900/70 leading-relaxed font-medium m-0">
                    Ownership and risk of loss for live assets pass to the customer upon delivery to the agreed location or upon handover to a third-party logistics provider nominated by the customer.
                </p>
            </div>
          </section>

          {/* Section 5: Cancellations & Refunds */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-deep-green uppercase tracking-wide">Cancellations & Refunds</h2>
            <p className="text-foreground/70 leading-relaxed font-medium">
              Due to the perishable and live nature of our products, CCB Farms maintains a strict refund policy. Cancellations for livestock orders must be made at least 48 hours before the scheduled harvest or delivery. Training program fees are non-refundable once the course has commenced.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mt-20 p-8 md:p-12 bg-[#1a231d] rounded-[32px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-leaf/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
                <div className="w-16 h-16 bg-leaf text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-leaf/20">
                    <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Legal Inquiries</h2>
                <p className="text-white/50 text-sm mb-8 font-medium max-w-md mx-auto">
                    If you have any questions regarding these terms, please contact our legal team:
                </p>
                <a href="mailto:hello@ccbfarms.com" className="inline-block bg-white text-deep-green px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    hello@ccbfarms.com
                </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-black/5 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
          © {new Date().getFullYear()} CCB Farms · RC: 3709222
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
