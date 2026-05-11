"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Cookie, ArrowRight, Settings, Check, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted-all');
    localStorage.setItem('marketing-consent', 'true');
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem('cookie-consent', 'rejected-optional');
    localStorage.setItem('marketing-consent', 'false');
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('marketing-consent', marketingConsent.toString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-0 md:px-0 md:pb-0 rounded-xl"
        >
          <div className="bg-primary-deep w-full mx-auto rounded-md">
            <div className="bg-primary-deep border border-black/5 md:border-x-0 md:border-b-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-2 md:p-6 relative overflow-hidden">
              {!showPreferences ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="max-w-2xl">
                      <p className="text-white text-sm md:text-md font-medium leading-relaxed">
                        We use essential cookies to provide you with a better experience. You can also opt-in to marketing cookies for a more personalized experience.
                        <Link href="/privacy" className="ml-1 text-leaf hover:underline font-bold">Privacy Policy</Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleRejectOptional}
                      className="px-5 py-3 rounded-xl text-[10px] text-white/80 font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject Optional
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="bg-white text-primary-deep px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                      Accept All
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setShowPreferences(true)}
                        className="p-2 rounded-xl text-white/80 hover:text-white transition-colors"
                        title="Preferences"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setShowPreferences(false)} className="p-2 hover:bg-zinc-100 text-white rounded-lg transition-colors">
                        <ArrowLeft className="w-4 h-4 text-white" />
                      </button>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">Cookie Preferences</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setMarketingConsent(!marketingConsent)}>
                        <div className={`w-8 h-5 rounded-full flex items-center px-1 transition-all duration-300 ${marketingConsent ? 'bg-leaf justify-end' : 'bg-zinc-200 justify-start'}`}>
                          <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-leaf transition-colors">Marketing Cookies</span>
                      </div>

                      <button
                        onClick={handleSavePreferences}
                        className="bg-deep-green hover:bg-leaf text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        Save Settings
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
