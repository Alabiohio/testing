"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ChevronRight, Calendar, Info, BookOpen } from "lucide-react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate scroll progress from 0 to 1 over the first 200px
          const scrollY = window.scrollY;
          const maxScroll = 200; // Distance to complete the transition
          const progress = Math.min(scrollY / maxScroll, 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial call to set state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const categories = [
    "Broodstock",
    "Fingerlings",
    "Jumbo",
    "Melange",
    "Table size",
    "Smoked",
  ];

  const galleryImages = [
    { title: "Annual Catfish Fry & Tour", type: "Event", image: "/event.png" },
    { title: "Feeding Logs & Growth", type: "Diary", image: "/diary.png" },
    { title: "Best Practices Guide", type: "Info", image: "/hero.png" }, // Reusing hero for info for now
    { title: "Harvest Day Highlights", type: "Event", image: "/event.png" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-leaf/10 dark:bg-leaf/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute middle-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-earth/10 dark:bg-earth/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 translate-y-1/4 w-[400px] h-[400px] bg-deep-green/10 dark:bg-deep-green/5 rounded-full blur-[100px] -z-10" />


      {/* Hero Section - Standard Two-Column Layout */}
      <section className="w-full mb-24 relative heroDiv">

        {/* Search Bar Container - Always in flow */}
        <div>
          {/* Calculate dynamic values based on scroll progress */}
          {(() => {
            const isSticky = scrollProgress > 0.3;

            // Interpolate values smoothly
            const paddingTop = 144 - (scrollProgress * 140); // 144px to 4px
            const paddingY = 24 - (scrollProgress * 18); // 24px to 6px
            const inputHeight = 56 - (scrollProgress * 16); // 56px to 40px
            const fontSize = 18 - (scrollProgress * 4); // 18px to 14px
            const iconSize = 24 - (scrollProgress * 6); // 24px to 18px

            return (
              <>
                {/* Placeholder when fixed */}
                {isSticky && (
                  <div style={{ height: `${paddingTop + paddingY * 2 + inputHeight}px` }} aria-hidden="true" />
                )}

                <div
                  className={isSticky ? 'fixed top-[72px] left-0 right-0 z-40 hidden md:block' : 'relative'}
                  style={{
                    willChange: isSticky ? 'transform' : 'auto',
                  }}
                >
                  <div
                    className={`transition-all duration-300 ease-out ${isSticky
                      ? 'bg-white/95 dark:bg-[#1a1d1a]/95 backdrop-blur-lg'
                      : 'bg-transparent'
                      }`}
                  >
                    <div
                      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                      style={{
                        paddingTop: `${paddingTop}px`,
                        paddingBottom: `${paddingY}px`,
                      }}
                    >
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="Search for farm produce, training, etc..."
                          className="w-full pl-14 pr-6 rounded-2xl border-2 border-earth/20 dark:border-white/10 focus:border-leaf focus:ring-4 focus:ring-leaf/5 outline-none text-foreground bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg group-hover:shadow-xl placeholder:text-foreground/40"
                          style={{
                            height: `${inputHeight}px`,
                            fontSize: `${fontSize}px`,
                          }}
                        />
                        <Search
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-leaf transition-colors"
                          style={{
                            width: `${iconSize}px`,
                            height: `${iconSize}px`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>




        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 text-leaf dark:text-leaf-dark rounded-full text-xl font-bold mb-8 uppercase tracking-widest">
                Home of Catfish
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-deep-green dark:text-white">
                Fresh Organic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-deep-green">Catfish</span>
              </h1>

              <p className="text-xl text-foreground/60 mb-10 max-w-lg leading-relaxed font-medium">
                Experience the finest quality organic catfish, nurtured with care in our sustainable farm. Straight from our ponds to your table.
              </p>

              <div className="flex flex-wrap gap-5">
                <button className="bg-leaf hover:bg-leaf-dark text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:-translate-y-1 shadow-2xl shadow-leaf/30 group uppercase tracking-widest">
                  Order Now
                  <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
                <button className="border-2 border-earth/20 dark:border-white/10 hover:border-leaf text-foreground px-10 py-5 rounded-2xl font-bold transition-all hover:bg-leaf/5">
                  Learn More
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-16 grid grid-cols-2 gap-8 border-t border-foreground/5 pt-8">
                <div>
                  <p className="text-3xl font-black text-leaf">100%</p>
                  <p className="text-sm font-bold text-foreground/50 uppercase tracing-wider">Organic Feed</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-leaf">24h</p>
                  <p className="text-sm font-bold text-foreground/50 uppercase tracing-wider">Farm to Table</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-square relative rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-white dark:border-white/5 group">
                <Image
                  src="/hero.png"
                  alt="Catfish Farm"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-deep-green/40 to-transparent mix-blend-overlay" />

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-earth/10 dark:border-white/10 animate-bounce-slow">
                  <p className="text-leaf font-black text-3xl">Premium</p>
                  <p className="text-foreground/50 text-xs font-bold uppercase tracking-widest">Quality Guaranteed</p>
                </div>
              </div>

              {/* Abstract Background for Image */}
              <div className="absolute -z-10 -top-10 -right-10 w-full h-full bg-leaf/10 rounded-[60px] blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Our Range Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-deep-green dark:text-leaf tracking-tight uppercase">Our Range</h2>
          <div className="h-1 flex-grow mx-8 bg-earth/10 dark:bg-white/5 rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white/50 dark:bg-white/5 border-2 border-earth/5 dark:border-white/5 p-6 rounded-[32px] text-center hover:border-leaf/30 transition-all cursor-pointer group shadow-sm hover:shadow-xl backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-leaf/5 dark:bg-leaf/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-leaf/10 transition-colors">
                <ChevronRight className="w-8 h-8 text-leaf" />
              </div>
              <p className="font-bold text-deep-green dark:text-leaf-dark text-sm lg:text-base uppercase tracking-wider">{cat}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Event/Diary/Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-black text-deep-green dark:text-leaf tracking-tight uppercase">Event / Diary / Information</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {galleryImages.map((item, idx) => (
            <motion.div
              key={idx}
              className="flex-shrink-0 w-[350px] md:w-[450px] aspect-[4/3] rounded-[40px] bg-earth/5 dark:bg-white/5 relative overflow-hidden group snap-start cursor-pointer border-2 border-earth/10 dark:border-white/10"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-3 text-leaf font-bold text-sm uppercase tracking-widest mb-2">
                  {item.type}
                </div>
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      <style jsx global>{`
        .glass-dark {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
