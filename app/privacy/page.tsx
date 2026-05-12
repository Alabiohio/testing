import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Mail, ArrowLeft, Cookie } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how CCB Farms protects your privacy and secures your personal information. Read our complete data protection policy.',
};

const PrivacyPolicy = () => {
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
            <Shield className="w-5 h-5 text-leaf" />
            <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Privacy Center</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-deep-green uppercase tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Introduction</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              At CCB Farms, we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including purchasing livestock or subscribing to our newsletter.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Data We Collect</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              We collect information that you provide directly to us:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
              {[
                { title: "Identity Data", desc: "Name, phone number, and email address." },
                { title: "Order Data", desc: "Delivery address, purchase history, and order notes." },
                { title: "Newsletter Data", desc: "Email address and subscription preferences." },
                { title: "Technical Data", desc: "IP address and browser type for security monitoring." }
              ].map((item) => (
                <li key={item.title} className="bg-white border border-black/5 dark:border-white/5 p-5 rounded-2xl">
                  <span className="block text-sm font-black text-deep-green uppercase tracking-tight mb-1">{item.title}</span>
                  <span className="text-xs text-foreground/50 font-medium">{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">How We Use Data</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              Your information allows us to provide a seamless experience:
            </p>
            <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-zinc-100 border border-black/5 dark:border-white/5">
                    <div className="font-black text-leaf opacity-30 text-2xl">01</div>
                    <div>
                        <h4 className="text-sm font-black text-deep-green uppercase m-0 mb-1">Order Fulfillment</h4>
                        <p className="text-xs text-foreground/50 m-0">To process bookings, arrange deliveries, and contact you regarding your purchase.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-zinc-100 border border-black/5 dark:border-white/5">
                    <div className="font-black text-leaf opacity-30 text-2xl">02</div>
                    <div>
                        <h4 className="text-sm font-black text-deep-green uppercase m-0 mb-1">Communication</h4>
                        <p className="text-xs text-foreground/50 m-0">To send order confirmations, respond to inquiries, and provide newsletter updates (where opted-in).</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-zinc-100 border border-black/5 dark:border-white/5">
                    <div className="font-black text-leaf opacity-30 text-2xl">03</div>
                    <div>
                        <h4 className="text-sm font-black text-deep-green uppercase m-0 mb-1">Security</h4>
                        <p className="text-xs text-foreground/50 m-0">To protect against spam, abuse, and fraudulent transactions using rate-limiting technology.</p>
                    </div>
                </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-deep-green uppercase tracking-wide">Third-Party Services</h2>
            <p className="text-foreground/70 leading-relaxed font-medium">
              We do not sell your personal data. We only share information with trusted partners to perform essential business functions:
            </p>
          </section>

          {/* Section 5: Cookies & Analytics */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf">
                <Cookie className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-deep-green uppercase tracking-wide m-0">Cookies & Analytics</h2>
            </div>
            <p className="text-foreground/70 leading-relaxed font-medium">
              We use cookies and similar tracking technologies to track the activity on our Service and store certain information.
            </p>
            <div className="space-y-6">
                <div className="bg-leaf/5 p-6 rounded-2xl border border-leaf/10">
                    <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-4 h-4 text-leaf" />
                        <h4 className="text-sm font-black text-deep-green uppercase m-0">Essential & Performance Cookies (Compulsory)</h4>
                    </div>
                    <p className="text-xs text-foreground/60 leading-relaxed font-medium mb-0">
                        These cookies are necessary for the website to function properly. They include cookies for your shopping cart, security, and Google Analytics. Because these tools are integral to our service quality and site security, they are considered compulsory and cannot be switched off in our system.
                    </p>
                </div>

                <div className="bg-zinc-100 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                    <h4 className="text-sm font-black text-deep-green uppercase mb-3">Marketing & Personalization (Optional)</h4>
                    <p className="text-xs text-foreground/50 leading-relaxed font-medium mb-4">
                        With your consent, we use optional cookies to personalize your experience, show relevant advertisements, and improve our outreach. You can manage these preferences via our Cookie Bar.
                    </p>
               </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-deep-green uppercase tracking-wide">Your Rights</h2>
            <p className="text-foreground/70 leading-relaxed font-medium">
              You have the right to access, correct, or delete your personal information. You can unsubscribe from our newsletter at any time by clicking the "unsubscribe" link in our emails or by contacting us directly.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mt-20 p-8 md:p-12 bg-[#1a231d] rounded-[32px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-leaf/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
                <div className="w-16 h-16 bg-leaf text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-leaf/20">
                    <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Contact Our Privacy Team</h2>
                <p className="text-white/50 text-sm mb-8 font-medium max-w-md mx-auto">
                    Questions about your data? Reach out to our dedicated privacy officer at:
                </p>
                <a href="mailto:hello@ccbfarms.com" className="inline-block bg-white text-deep-green px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    hello@ccbfarms.com
                </a>
            </div>
          </section>
           <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-black/5 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
          © {new Date().getFullYear()} CCB Farms · RC: 3709222
        </p>
      </footer>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
