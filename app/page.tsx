"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ChevronRight, Calendar, Info, BookOpen, ShieldCheck, Users, Sprout, TrendingUp, Truck, Handshake, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Home() {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const galleryImages = [
    { title: "Annual Catfish Fry & Tour", type: "Event", image: "/event.png" },
    { title: "Feeding Logs & Growth", type: "Diary", image: "/diary.png" },
    { title: "Best Practices Guide", type: "Info", image: "/hero.png" }, // Reusing hero for info for now
    { title: "Harvest Day Highlights", type: "Event", image: "/event.png" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-x-clip">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-leaf/10 dark:bg-leaf/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute middle-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-earth/10 dark:bg-earth/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 translate-y-1/4 w-[400px] h-[400px] bg-deep-green/10 dark:bg-deep-green/5 rounded-full blur-[100px] -z-10" />


      {/* Desktop Sticky Search Bar (Hidden on mobile to prevent layout scattering) */}
      <div className="hidden md:sticky top-[72px] z-40 md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for farm produce, training, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-earth/20 dark:border-white/10 focus:border-leaf focus:ring-4 focus:ring-leaf/5 outline-none text-foreground bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg group-hover:shadow-xl placeholder:text-foreground/40 text-lg transition-all"
          />
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40 group-focus-within:text-leaf transition-colors"
          />
        </div>
      </div>

      {/* Hero Section - Standard Two-Column Layout */}
      <section className="w-full mb-24 relative heroDiv pt-32">
        {/* Mobile Search Bar */}
        <div className="md:hidden max-w-7xl mx-auto px-4 py-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search for farm produce, training, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-earth/20 dark:border-white/10 focus:border-leaf focus:ring-4 focus:ring-leaf/5 outline-none text-foreground bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg group-hover:shadow-xl placeholder:text-foreground/40 text-lg transition-all"
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40 group-focus-within:text-leaf transition-colors"
            />
          </div>
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
                Trusted Catfish Supplier
              </div>

              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9] text-deep-green dark:text-white">
                Premium Catfish for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-deep-green font-black">Farming & Consumption</span>
              </h1>

              <p className="text-xl text-foreground/60 mb-10 max-w-lg leading-relaxed font-bold">
                Healthy. Fresh. Responsibly Raised.
              </p>

              <p className="text-lg text-foreground/50 mb-10 max-w-lg leading-relaxed font-medium italic">
                We supply high-quality catfish across every growth stage—perfect for fish farmers, retailers, restaurants, and households.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link href="/booked-order" className="bg-leaf hover:bg-leaf-dark text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:-translate-y-1 shadow-2xl shadow-leaf/30 group uppercase tracking-widest">
                  Order Now
                  <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link href="/contact" className="border-2 border-earth/20 dark:border-white/10 hover:border-leaf text-foreground px-10 py-5 rounded-2xl font-bold transition-all hover:bg-leaf/5 flex items-center gap-2">
                  Contact Us
                </Link>
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

      {/* 4. About Us Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl">
              <Image
                src="/event.png"
                alt="Our Farm"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-leaf text-white p-8 rounded-3xl shadow-xl hidden md:block">
              <p className="text-4xl font-black mb-1">Fast</p>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Growth Strains</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 text-leaf rounded-full text-sm font-bold mb-6 uppercase tracking-widest">
              About Us
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-deep-green dark:text-white mb-8 leading-tight">
              Quality, Consistency & <br />
              <span className="text-leaf">Satisfaction</span>
            </h2>
            <p className="text-lg text-foreground/60 mb-8 leading-relaxed font-medium">
              We are a trusted catfish supplier committed to quality, consistency, and customer satisfaction. Our fish are raised under controlled conditions with proper feeding, clean water systems, and expert handling to ensure fast growth, high survival rates, and excellent taste.
            </p>
            <p className="text-lg text-foreground/50 mb-10 leading-relaxed italic">
              Whether you’re starting a fish farm, restocking ponds, or buying catfish for consumption, we’ve got you covered.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-leaf" />
                </div>
                <div>
                  <h4 className="font-bold text-deep-green dark:text-leaf-dark mb-1">Hygienic Bio-Security</h4>
                  <p className="text-sm text-foreground/50">Rigorous standards for healthy, disease-free fish.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-leaf" />
                </div>
                <div>
                  <h4 className="font-bold text-deep-green dark:text-leaf-dark mb-1">Expert Support</h4>
                  <p className="text-sm text-foreground/50">Professional guidance for serious fish farmers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-deep-green dark:text-leaf tracking-tight uppercase">Our Catfish Categories</h2>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">Finest Quality Across All Stages</p>
          </div>
          <div className="hidden md:block h-1 flex-grow mx-8 bg-earth/10 dark:bg-white/5 rounded-full" />
          <Link href="/category" className="bg-leaf/10 text-leaf hover:bg-leaf hover:text-white px-6 py-3 rounded-2xl font-black transition-all text-sm uppercase tracking-widest">
            View All Details
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Fingerlings",
              desc: "Strong, healthy fingerlings with high survival rates—ideal for new ponds.",
              img: "/assets/images/fingerlings.png",
              //color: "from-blue-500/20",
              tags: ["Disease-free", "Fast-growing strains", "Carefully sorted"]
            },
            {
              name: "Juveniles",
              desc: "Well-developed juveniles ready for rapid growth and smooth transition.",
              img: "/assets/images/juveniles.png",
              //color: "from-green-500/20",
              tags: ["Uniform sizes", "Feeding response", "Reduced grow-out"]
            },
            {
              name: "Fresh Table-Size",
              desc: "Freshly harvested, hygienically handled catfish for home and restaurants.",
              img: "/assets/images/tablesize.png",
              //color: "from-orange-500/20",
              tags: ["Meaty & Nutritious", "Weights: 0.5kg-2kg+", "Same-day harvest"]
            },
            {
              name: "Smoked Catfish",
              desc: "Richly smoked catfish with long shelf life and irresistible flavor.",
              img: "/assets/images/smoked.png",
              //color: "from-red-500/20",
              tags: ["Properly smoked", "No preservatives", "Export quality"]
            },
            {
              name: "Broodstock",
              desc: "High-quality broodstock selected for breeding and hatchery use.",
              img: "/assets/images/broodstock.png",
              //color: "from-purple-500/20",
              tags: ["Proven genetics", "High fertility", "Expertly selected"]
            },
            {
              name: "Hatchery Services",
              desc: "Professional hatchery services for scalable farm expansion.",
              img: "/assets/images/hatchery.png",
              //color: "from-teal-500/20",
              tags: ["Expert guidance", "Scalable solutions", "Reliable supply"]
            }
          ].filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden border-2 border-earth/5 dark:border-white/5 hover:border-leaf/20 transition-all shadow-xl shadow-black/5"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
               {/* <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-60`} /> */}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-deep-green dark:text-white mb-3 uppercase tracking-tight">{cat.name}</h3>
                <p className="text-foreground/50 font-medium mb-6 line-clamp-2">{cat.desc}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {cat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-leaf/5 text-leaf dark:text-leaf-dark text-[10px] font-black uppercase tracking-widest rounded-full border border-leaf/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href="/booked-order" className="inline-flex items-center gap-2 text-leaf font-black uppercase tracking-widest text-sm group/btn">
                  Order Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-deep-green py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-leaf rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-leaf rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl lg:text-5xl font-black mb-6 uppercase tracking-tight">Why Choose CCB Farms?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
              We supply catfish you can trust, delivered with reliability and expert care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Healthy & Disease-Free",
                desc: "Our fish are raised under strict bio-security controls to ensure robust health and zero disease.",
                icon: ShieldCheck
              },
              {
                title: "Consistent Quality",
                desc: "We guarantee uniform sizes and excellent feeding response across all our catfish categories.",
                icon: TrendingUp
              },
              {
                title: "Reliable Supply",
                desc: "Count on us for consistent supply and timely nationwide delivery to your farm or home.",
                icon: Truck
              },
              {
                title: "Affordable Pricing",
                desc: "Premium quality catfish at competitive market prices, offering the best value for your investment.",
                icon: ShoppingBag
              },
              {
                title: "Hygienic Processing",
                desc: "Hygienic handling and professional packaging for both live and smoked catfish products.",
                icon: Sprout
              },
              {
                title: "Expert Support",
                desc: "Professional guidance and technical support for farmers to ensure maximum yield and success.",
                icon: Handshake
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[40px] text-center"
              >
                <div className="w-16 h-16 bg-leaf rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-leaf/20">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 text-leaf rounded-full text-sm font-bold mb-6 uppercase tracking-widest">
            The Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-deep-green dark:text-white mb-6">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Choose Category", desc: "Select from Fingerlings, Juveniles, Table-size, Smoked, or Broodstock.", icon: Search },
            { step: "02", title: "Place Order", desc: "Order online or via phone/WhatsApp at [09093009400].", icon: ShoppingBag },
            { step: "03", title: "Processing", desc: "We package your order with care and handle with hygiene.", icon: ShieldCheck },
            { step: "04", title: "Delivery/Pickup", desc: "Fast and reliable nationwide delivery options available.", icon: Truck },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-earth/10 -z-10" />
              )}
              <div className="bg-white dark:bg-white/5 border border-earth/10 dark:border-white/10 p-8 rounded-[32px] hover:border-leaf transition-colors group">
                <div className="w-12 h-12 bg-earth/5 dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-leaf group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-earth/10 dark:text-white/5 absolute top-6 right-8">{item.step}</span>
                <h3 className="text-xl font-bold text-deep-green dark:text-leaf-dark mb-4">{item.title}</h3>
                <p className="text-foreground/50 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Serving Farmers & Families Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-leaf/5 dark:bg-leaf/10 rounded-[60px] p-8 md:p-16 border-2 border-leaf/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-leaf/10 -skew-x-12 translate-x-1/2" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-deep-green dark:text-white mb-8">Serving Farmers <br /> & Families Alike</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center shrink-0">
                    <Handshake className="w-7 h-7 text-leaf" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-deep-green dark:text-leaf mb-2">For Farmers & Retailers</h4>
                    <p className="text-foreground/60 leading-relaxed font-medium">From small-scale farmers to large commercial operations—we supply fish that meet your needs.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-7 h-7 text-leaf" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-deep-green dark:text-leaf mb-2">For Families & Restaurants</h4>
                    <p className="text-foreground/60 leading-relaxed font-medium">Hygienically handled catfish delivered straight to your home or kitchen for a premium experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
              <Image
                src="/diary.png"
                alt="Happy Farmers"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Event/Diary/Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-black text-deep-green dark:text-leaf tracking-tight uppercase">Event / Diary / Information</h2>
        </div>

        <div className="relative group/gallery">
          <div
            ref={galleryRef}
            className="flex gap-6 overflow-x-auto pb-12 snap-x no-scrollbar scroll-smooth"
            onScroll={(e) => {
              const target = e.currentTarget;
              const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth);
              const activeIndex = Math.round(progress * (galleryImages.length - 1));
              setActiveGalleryIndex(activeIndex);
            }}
          >
            {galleryImages.map((item, idx) => (
              <motion.div
                key={idx}
                id={`gallery-item-${idx}`}
                className="flex-shrink-0 w-[85vw] md:w-[450px] aspect-[4/3] rounded-[40px] bg-earth/5 dark:bg-white/5 relative overflow-hidden group snap-start cursor-pointer border-2 border-earth/10 dark:border-white/10"
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

          {/* Scroll Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to item ${i + 1}`}
                onClick={() => {
                  const item = document.getElementById(`gallery-item-${i}`);
                  if (galleryRef.current && item) {
                    galleryRef.current.scrollTo({
                      left: item.offsetLeft - galleryRef.current.offsetLeft,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-500 ${i === activeGalleryIndex ? 'bg-leaf w-10' : 'bg-earth/20 dark:bg-white/10 w-2 hover:bg-leaf/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-deep-green rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero.png')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-white text-5xl lg:text-7xl font-black mb-10 tracking-tighter">Ready to Buy <br /> <span className="text-leaf">Quality Catfish?</span></h2>
            <p className="text-white/60 text-xl font-bold mb-12 max-w-2xl mx-auto">Place your order today or speak with our team for guidance on the best option for you.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/booked-order" className="bg-leaf hover:bg-leaf-dark text-white px-12 py-6 rounded-2xl font-black text-xl transition-all hover:-translate-y-1 shadow-2xl shadow-leaf/40">
                PLACE ORDER NOW
              </Link>
              <Link href="/contact" className="bg-white hover:bg-gray-100 text-deep-green px-12 py-6 rounded-2xl font-black text-xl transition-all hover:-translate-y-1">
                GET EXPERT ADVICE
              </Link>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-12 text-white/50 font-bold uppercase tracking-widest text-sm">
              <span className="flex items-center gap-2"><Phone className="w-5 h-5" /> 09093009400</span>
              <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Ogun State & Lagos</span>
              <span className="flex items-center gap-2"><Truck className="w-5 h-5" /> Nationwide Delivery</span>
            </div>
          </div>
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
