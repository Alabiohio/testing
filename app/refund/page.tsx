import React from 'react';
import Link from 'next/link';
import { RefreshCcw, CheckCircle, AlertTriangle, Clock, ShoppingBag, Mail, ArrowLeft, HeartPulse } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Understand our refund and returns policy for livestock products and training services. Customer satisfaction guaranteed.',
};

const RefundPolicy = () => {
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
            <RefreshCcw className="w-5 h-5 text-leaf" />
            <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Refund Center</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-deep-green uppercase tracking-tight mb-4">
            Refund Policy
          </h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          {/* Section 1: Overview */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Policy Overview</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              At CCB Farms, we pride ourselves on the quality of our livestock and agricultural services. Because our primary products are living creatures and perishable goods, we maintain specific refund guidelines to ensure fairness and biosecurity.
            </p>
          </section>

          {/* Section 2: Live Assets */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Livestock (Live Assets)</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              Fingerlings, Juveniles, and Table-Size Catfish are highly sensitive to transport and environmental changes.
            </p>
            <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-zinc-50 border border-black/5">
                    <h4 className="text-sm font-black text-deep-green uppercase mb-2">Point of Collection</h4>
                    <p className="text-xs text-foreground/50 leading-relaxed font-medium">Customers are required to inspect the health and count of livestock at the point of collection or delivery. Once the livestock has been accepted and our team has departed, CCB Farms cannot be held liable for mortality or health issues due to environmental factors at the new location.</p>
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="text-sm font-black uppercase m-0">Non-Refundable Condition</h4>
                    </div>
                    <p className="text-xs text-red-900/70 leading-relaxed font-medium m-0">
                        Refunds or replacements are NOT issued for livestock mortality that occurs more than 2 hours after delivery, as water quality and handling at the destination are beyond our control.
                    </p>
                </div>
            </div>
          </section>

          {/* Section 3: Training & Consulting 
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Training & Consulting</h2>
            </div>
            <ul className="space-y-4 p-0 m-0 list-none">
                <li className="p-5 rounded-2xl bg-white border border-black/5 flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-leaf mt-1.5 shrink-0" />
                    <div>
                        <span className="block text-sm font-black text-deep-green uppercase mb-1">Cancellations</span>
                        <span className="text-xs text-foreground/50 font-medium">Refunds for training programs are available if requested at least 7 days prior to the start date, minus a 10% administrative fee.</span>
                    </div>
                </li>
                <li className="p-5 rounded-2xl bg-white border border-black/5 flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-leaf mt-1.5 shrink-0" />
                    <div>
                        <span className="block text-sm font-black text-deep-green uppercase mb-1">Late Cancellations</span>
                        <span className="text-xs text-foreground/50 font-medium">No refunds are issued for cancellations made within 72 hours of the program start date; however, you may reschedule for a future session.</span>
                    </div>
                </li>
            </ul>
          </section>*/}

          {/* Section 4: Process */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Claims Process</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              To initiate a claim regarding damaged smoked catfish or delivery discrepancies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { step: "01", text: "Photograph the issue immediately upon delivery." },
                    { step: "02", text: "Contact us via WhatsApp or Email within 2 hours." },
                    { step: "03", text: "Provide your order reference and receipt." }
                ].map((item) => (
                    <div key={item.step} className="p-4 rounded-xl bg-zinc-50 border border-black/5">
                        <span className="block text-lg font-black text-leaf/30 mb-2">{item.step}</span>
                        <span className="text-[11px] text-foreground/60 font-bold uppercase leading-tight">{item.text}</span>
                    </div>
                ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-20 p-8 md:p-12 bg-[#1a231d] rounded-[32px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-leaf/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
                <div className="w-16 h-16 bg-leaf text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-leaf/20">
                    <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Refund Support</h2>
                <p className="text-white/50 text-sm mb-8 font-medium max-w-md mx-auto">
                    Need assistance with a return or refund? Our team is here to help:
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

export default RefundPolicy;
