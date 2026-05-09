"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, ShoppingCart, ChevronRight, ChevronLeft, ChevronDown,
  Shield, Truck, Clock, Star, ArrowRight, CheckCircle,
  Zap, Tag, Phone, MapPin, Users, Leaf, Package, Heart, Activity, Brain, Asterisk, MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import { useCart } from "@/lib/cart-context";
import { PriceCatalogItem, GrowthStage } from "@/lib/db/schema";
import ProductCard, { type ProductCardProps as ProductProps, SafeImage, formatPriceRange } from "./ProductCard";
import { toCategorySlug } from "@/lib/category-slugs";







// Countdown Timer Hook
function useCountdown(targetDate?: Date | string) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, totalHours: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return { d: 0, h: 11, m: 59, s: 59, totalHours: 11 };
      const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
      const difference = target.getTime() - new Date().getTime();
      if (difference <= 0) return { d: 0, h: 0, m: 0, s: 0, totalHours: 0 };

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: totalHours % 24,
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
        totalHours
      };
    };

    setTime(calculateTimeLeft());
    const t = setInterval(() => {
      setTime(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return time;
}

const pad = (n: number) => String(n).padStart(2, '0');

// Redundant local utilities removed. Using exports from ProductCard.tsx

const TestimonialSlider = ({ testimonials }: { testimonials: any[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="w-full py-2">
      <div className="relative min-h-[180px] sm:min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="relative bg-[#F7F7F7] px-8 py-1 md:p-14 rounded-sm mb-2 group">
              <p className="text-gray-700 text-base md:text-xl font-medium leading-relaxed italic text-center max-w-3xl mx-auto">
                "{testimonials[current].review}"
              </p>
            </div>

            <div className="text-center mt-6">
              <p className="text-[#888888] font-bold text-sm md:text-base tracking-tight mb-1">{testimonials[current].name}</p>
              {testimonials[current].role && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{testimonials[current].role}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${current === idx ? 'bg-black w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const AdContent = ({ ad, handleAdOrderConfirm }: { ad: any, handleAdOrderConfirm: (ad: any) => void }) => {
  if (ad.hasLink === false) {
    return (
      <div className="block rounded-xl overflow-hidden bg-gray-50">
        <SafeImage
          src={ad.imageUrl}
          alt={ad.title || "Special offer"}
          width={1200}
          height={600}
          className="w-full h-[180px] md:h-[280px] object-contain"
        />
      </div>
    );
  }

  return (
    <>
      {ad.linkUrl ? (
        <Link
          href={ad.linkUrl}
          target={ad.linkUrl.startsWith('http') ? "_blank" : "_self"}
          className="block rounded-xl overflow-hidden cursor-pointer group transition-all bg-gray-50"
        >
          <SafeImage
            src={ad.imageUrl}
            alt={ad.title || "Special offer"}
            width={800}
            height={400}
            className="w-full h-[180px] md:h-[280px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
          />
        </Link>
      ) : (
        <div
          onClick={() => handleAdOrderConfirm(ad)}
          className="block rounded-xl overflow-hidden cursor-pointer group transition-all bg-gray-50"
        >
          <SafeImage
            src={ad.imageUrl}
            alt={ad.title || "Special offer"}
            width={800}
            height={400}
            className="w-full h-[180px] md:h-[280px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}
    </>
  );
};

const SliderCountdown = ({ targetDate, isMobile }: { targetDate: Date | string | null, isMobile?: boolean }) => {
  const time = useCountdown(targetDate || undefined);
  const showDays = time.d > 0;

  return (
    <div className={`flex items-center gap-1 font-bold ${!isMobile ? 'text-xl' : ''} tabular-nums`} suppressHydrationWarning>
      {showDays ? (
        <>
          <span>{pad(time.d)}d</span>
          <span>:</span>
          <span>{pad(time.h)}h</span>
          <span>:</span>
          <span>{pad(time.m)}m</span>
        </>
      ) : (
        <>
          <span>{pad(time.h)}h</span>
          <span>:</span>
          <span>{pad(time.m)}m</span>
          <span>:</span>
          <span>{pad(time.s)}s</span>
        </>
      )}
    </div>
  );
};

const HeroCountdown = ({ targetDate }: { targetDate: Date | string | null }) => {
  const time = useCountdown(targetDate || undefined);
  const showDays = time.d > 0;

  return (
    <div className="flex items-center gap-2 ml-1 font-black text-deep-green tabular-nums" suppressHydrationWarning>
      {showDays ? (
        <>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-xl text-[11px]">{pad(time.d)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">d</span>
          </div>
          <span className="text-foreground/10">:</span>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-xl text-[11px]">{pad(time.h)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">h</span>
          </div>
          <span className="text-foreground/10">:</span>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-xl text-[11px]">{pad(time.m)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">m</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-sm text-[11px]">{pad(time.h)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">h</span>
          </div>
          <span className="text-foreground/10">:</span>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-xl text-[11px]">{pad(time.m)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">m</span>
          </div>
          <span className="text-foreground/10">:</span>
          <div className="flex items-center gap-1">
            <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-xl text-[11px]">{pad(time.s)}</span>
            <span className="text-[9px] text-foreground/30 font-bold lowercase">s</span>
          </div>
        </>
      )}
    </div>
  );
};

const PartnerAdSection = ({ initialPartnerAds, handleAdOrderConfirm }: { initialPartnerAds: any[], handleAdOrderConfirm: (ad: any) => void }) => {
  if (!initialPartnerAds || initialPartnerAds.length === 0) return null;

  // Reverse the order so the last item shows first
  const reversedAds = [...initialPartnerAds].reverse();

  return (
    <section className="bg-transparent overflow-hidden mb-8 mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10 border-b border-gray-100/80 pb-8 md:pb-14">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight mb-4">
              Featured Products
            </h2>
          </div>

          <div className="flex flex-row items-end gap-3 md:gap-8 shrink-0">
            {/* Promotional Flyer */}
            <div className="w-[110px] sm:w-[180px] md:w-[220px] shrink-0 relative group">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-black/5 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                <SafeImage
                  src="/assets/images/garri2goFlyer.jpeg"
                  alt="Garri2go Flyer"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Featured Video Reel */}
            <div className="flex-1 sm:w-[400px] md:w-[500px] sm:shrink-0 relative">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-black/5 group">
                <video
                  src="/assets/bgVid/products.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        <div
          className="flex w-max partner-ad-scroll"
          style={{
            // Increased speed: from 10s per item down to 4s
            animationDuration: `${initialPartnerAds.length * 4}s`,
          }}
        >
          {/* Two identical sets with trailing gap padding for seamless infinite loop */}
          {[1, 2].map((set) => (
            <div key={set} className="flex gap-4 md:gap-8 pr-4 md:pr-8">
              {reversedAds.map((ad: any, idx: number) => (
                <div key={`${set}-${idx}`} className="w-[280px] md:w-[350px] shrink-0 group">
                  <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden p-2">
                    <AdContent ad={ad} handleAdOrderConfirm={handleAdOrderConfirm} />
                    <div className="mt-3 px-2 pb-2">
                      <h3 className="font-black text-deep-green text-sm uppercase tracking-tight line-clamp-1">{ad.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



export default function HomeClient({
  initialProducts,
  initialFlashDeal,
  activeFlashDeals = [],
  globalSettings,
  initialTestimonials = [],
  initialPriceCatalog = [],
  initialPartnerAds = [],
  initialGrowthStages = []
}: {
  initialProducts: ProductProps[],
  initialFlashDeal?: any,
  activeFlashDeals?: any[],
  globalSettings?: any,
  initialTestimonials?: any[],
  initialPriceCatalog?: PriceCatalogItem[],
  initialPartnerAds?: any[],
  initialGrowthStages?: GrowthStage[]
}) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const galleryRef = useRef<HTMLDivElement>(null);
  // Removed tabbed filters state as we now use vertical sections

  // Use global settings for slider if available, otherwise find earliest
  const sliderEndTime = globalSettings?.endTime || (activeFlashDeals.length > 0
    ? [...activeFlashDeals].sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())[0]?.endTime
    : null);

  const router = useRouter();
  const [, startTransition] = useTransition();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const { addItem } = useCart();
  const [catalogItems, setCatalogItems] = useState<PriceCatalogItem[]>(initialPriceCatalog || []);

  const handleAdOrderConfirm = (ad: any) => {
    setConfirmModal({
      isOpen: true,
      title: `Add to Cart: ${ad.title}`,
      message: `Would you like to add this special offer (${ad.title}) to your cart and proceed?`,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        const rawPrice = ad.price ? ad.price.toString().replace(/[^0-9.]/g, '') : '';
        const parsedPrice = rawPrice ? parseFloat(rawPrice) : null;

        addItem({
          id: ad.id,
          name: ad.title,
          price: parsedPrice,
          price_range: parsedPrice ? null : "Special Offer",
          unit: "offer",
          category: "Partner Ad",
          imageUrl: ad.imageUrl
        }, 1);
        startTransition(() => {
          router.push("/cart");
        });
      },
    });
  };

  const handleOrderConfirm = (product: ProductProps) => {
    setConfirmModal({
      isOpen: true,
      title: `Add to Cart: ${product.name}`,
      message: `Would you like to add ${product.name} to your cart and proceed?`,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        addItem({
          id: product.id,
          name: product.name,
          price: product.rawPrice,
          price_range: product.rawPriceRange,
          unit: product.unit,
          category: product.category,
          imageUrl: product.img
        }, 1);
        startTransition(() => {
          router.push("/cart");
        });
      },
    });
  };

  const products = initialProducts;

  const filters = ["Farming", "Consumption", "Breeding"];

  // Dynamically derive type filters from available products
  const productCategories = Array.from(new Set(products.map(p => p.category)));
  const typeFilters = ["All Fish", ...productCategories.map(cat => {
    // Map internal slugs to display names for standard ones, or just use the name
    const map: Record<string, string> = {
      "fingerlings": "Fingerlings",
      "juveniles": "Juvenile",
      "broodstock": "Broodstock",
      "table-size": "Table Size",
      "smoked": "Smoked"
    };
    return map[cat.toLowerCase()] || cat.charAt(0).toUpperCase() + cat.slice(1);
  })].filter((v, i, a) => a.indexOf(v) === i); // Ensure uniqueness

  // Filtered lists for vertical sections are computed inline to avoid redundant state management

  const renderProductCard = (product: ProductProps, idx: number) => (
    <ProductCard
      key={product.id}
      product={product}
      index={idx}
      onOrder={handleOrderConfirm}
    />
  );


  const galleryImages = [
    { title: "Annual Catfish Fry & Tour", type: "Event", image: "/event.png" },
    { title: "Feeding Logs & Growth", type: "Diary", image: "/diary.png" },
    { title: "Best Practices Guide", type: "Info", image: "/hero.png" },
    { title: "Harvest Day Highlights", type: "Event", image: "/event.png" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-x-clip">
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="info"
        confirmText="Yes, Proceed"
        cancelText="Maybe Later"
      />


      {/* ===== HERO ===== */}
      <section className="w-full mb-20 relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            src="/assets/bgVid/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,13,0.86)_0%,rgba(10,16,13,0.72)_44%,rgba(10,16,13,0.58)_100%)]" />
        </div>

        {/* Search Bar */}
        <div id="hero-search-bar" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-18 mb-12 relative z-10">
          <div
            className="relative group cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
          >
            <div className="w-full h-12 pl-14 pr-6 rounded-xl border border-white/15 bg-white/92 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all flex items-center">
              <span className="text-gray-500 text-sm font-medium">Search products, sizes, or categories</span>
            </div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-green" />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-xl uppercase tracking-widest border border-gray-200">⌘K</span>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl"
          >

            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.02] text-white max-w-3xl">
              Premium catfish for buyers who value consistency.
            </h1>

            <p className="text-base text-white/78 mb-8 max-w-2xl leading-relaxed font-medium">
              From fingerlings to processed stock, CCB Farms supplies carefully raised catfish for farmers, retailers, restaurants, and households with dependable quality and straightforward fulfilment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/category" className="inline-flex items-center justify-center gap-2.5 bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-2.5 rounded-xl font-bold text-base transition-all shadow-sm active:scale-95 tracking-wide">
                <ShoppingCart className="w-5 h-5" />
                View Categories
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/18 bg-white text-[0f2f21] px-8 py-2.5 rounded-xl font-bold transition-all hover:bg-white/80 text-base">
                <Phone className="w-5 h-5" />
                Speak with the Team
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-5 grid-cols-3 sm:grid-cols-3 max-w-3xl border-t border-white/12 pt-8">
              {[
                { value: "₦80", label: "Entry pricing from" },
                { value: "7 Days", label: "Support availability" },
                { value: "Nationwide", label: "Delivery coverage" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/6 px-2 py-2">
                  <p className="text-md font-bold text-white">{s.value}</p>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MULTIPLE FLASH DEALS SLIDER ===== */}
      {activeFlashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-black/5">
            {/* Red Banner Header */}
            <div className="bg-red-600 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <Zap className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="font-bold text-lg md:text-2xl tracking-tight">Flash Sales</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium">Time Left:</span>
                <SliderCountdown targetDate={sliderEndTime} />
              </div>
              <Link href="#shop-categories" className="text-sm md:text-base font-medium hover:text-white/80 flex items-center gap-1">
                See All <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
            {/* Mobile Countdown Row */}
            <div className="md:hidden bg-[#CC1300] text-white px-4 py-1.5 flex items-center justify-center gap-2 text-xs">
              <span className="font-medium">Time Left:</span>
              <SliderCountdown targetDate={sliderEndTime} isMobile={true} />
            </div>

            {/* Products Horizontal List */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide p-4 gap-4 md:gap-6">
              {activeFlashDeals.map((deal, idx) => {
                const product = products.find(p => p.id === deal.productId);
                if (!product) return null;

                return (
                  <div
                    key={deal.id || idx}
                    className="shrink-0 w-[140px] md:w-[200px] snap-start group relative flex flex-col cursor-pointer transition-transform hover:-translate-y-1"
                    onClick={() => handleOrderConfirm(product)}
                  >
                    <div className="relative aspect-square mb-3 bg-white rounded-xl overflow-hidden shrink-0 border border-black/5 flex items-center justify-center">
                      <SafeImage
                        src={deal.imageUrl || product.img}
                        alt={deal.title || product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                      {deal.discount && (
                        <div className="absolute top-0 right-0 bg-orange-50 text-orange-500 font-medium text-xs px-1.5 py-0.5 rounded-xl">
                          {deal.discount.startsWith('-') ? deal.discount : `-${deal.discount}`}
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm text-foreground/80 font-medium line-clamp-1 mb-1" title={product.name}>{product.name}</h3>
                    <div className="font-black text-lg text-foreground mb-0.5">
                      {deal.flashPrice ? `₦${Number(deal.flashPrice).toLocaleString()}` : product.price}
                    </div>
                    {deal.flashPrice && (
                      <div className="text-xs text-foreground/40 line-through mb-2">₦{Number(product.rawPrice).toLocaleString()}</div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== SINGLE FLASH DEAL BANNER ===== */}
      {initialFlashDeal && (() => {
        const dealProduct = products.find(p => p.id === initialFlashDeal.productId);
        return (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight">{initialFlashDeal.title}</h2>
              <div className="flex items-center gap-1.5 ml-auto text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <HeroCountdown targetDate={initialFlashDeal.endTime} />
              </div>
            </div>

            {/* Deal Card */}
            <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="relative w-full md:w-[280px] h-[200px] md:h-[240px] bg-zinc-50 shrink-0 overflow-hidden group">
                  {initialFlashDeal.imageUrl ? (
                    <SafeImage
                      src={initialFlashDeal.imageUrl}
                      alt={initialFlashDeal.subtitle || "Flash deal"}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : dealProduct?.img ? (
                    <SafeImage
                      src={dealProduct.img}
                      alt={dealProduct.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-leaf/5 to-deep-green/5 flex items-center justify-center">
                      <Package className="w-16 h-16 text-leaf/20" />
                    </div>
                  )}
                  {/* Discount Badge */}
                  {initialFlashDeal.discount && (
                    <div className="absolute top-4 left-4 bg-leaf text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-sm">
                      {initialFlashDeal.discount}
                    </div>
                  )}
                </div>

                {/* Deal Info */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-leaf uppercase tracking-widest mb-1.5">{dealProduct?.category || "Special Offer"}</p>
                  <h3 className="text-xl md:text-2xl font-black text-deep-green leading-snug mb-2">
                    {initialFlashDeal.subtitle}
                  </h3>
                  <p className="text-foreground/50 text-xs leading-relaxed mb-4 max-w-sm">
                    {dealProduct?.desc || "Premium quality, freshly sourced. Grab this exclusive deal before it expires."}
                  </p>

                  {/* Price */}
                  {dealProduct && (
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-deep-green">
                        {initialFlashDeal.flashPrice ? `₦${Number(initialFlashDeal.flashPrice).toLocaleString()}` : dealProduct.price}
                      </span>
                      {initialFlashDeal.flashPrice && (
                        <span className="text-sm text-foreground/40 line-through">₦{Number(dealProduct.rawPrice).toLocaleString()}</span>
                      )}
                      <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">/ {dealProduct.unit}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex flex-col gap-1.5 mb-5 max-w-xs">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                      <span className="text-red-600">Sold: {initialFlashDeal.stockSold}</span>
                      <span className="text-foreground/30">Total: {initialFlashDeal.stockTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-xl overflow-hidden">
                      <div
                        className="h-full rounded-xl bg-red-600 transition-all duration-1000 shadow-sm"
                        style={{ width: `${Math.min(Math.max((initialFlashDeal.stockSold / (initialFlashDeal.stockTotal || 100)) * 100, 5), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (dealProduct) handleOrderConfirm(dealProduct);
                      }}
                      className="bg-leaf hover:bg-leaf-dark text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 group/btn"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[10px] text-foreground/30 font-medium hidden sm:block">Delivery available Nationwide & Internationally</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}
      {/* ===== PARTNER AD BANNER ===== */}
      {initialPartnerAds && initialPartnerAds.length > 0 && (
        <PartnerAdSection
          initialPartnerAds={initialPartnerAds}
          handleAdOrderConfirm={handleAdOrderConfirm}
        />
      )}


      {/* ===== PRODUCT GRID BY CATEGORY - VERTICAL SECTIONS ===== */}
      <section id="shop-categories" className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-1 scroll-mt-32">
        <div className="py-8 mb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight">Shop by Category</h2>
            </div>
          </div>

          <div className="space-y-24">
            {filters.map((catName) => {
              // Determine which subcategories belong to this section
              let subCats: string[] = [];
              if (catName === "Farming") subCats = ["fingerlings", "juveniles", "farming"];
              else if (catName === "Consumption") subCats = ["table-size", "smoked", "consumption"];
              else if (catName === "Breeding") subCats = ["broodstock", "breeding"];
              else subCats = [catName.toLowerCase()];

              // Group the available products by their exact subcategory
              const groups: Record<string, typeof products> = {};
              subCats.forEach(sc => groups[sc] = []);
              
              products.forEach(p => {
                const pCat = p.category.toLowerCase();
                if (subCats.includes(pCat)) {
                  groups[pCat].push(p);
                }
              });

              // Interleave the products to create a balanced mix (1010 pattern)
              const catItems: typeof products = [];
              let added = true;
              let i = 0;
              while (catItems.length < 4 && added) {
                added = false;
                for (const sc of subCats) {
                  if (catItems.length >= 4) break;
                  if (groups[sc] && groups[sc][i]) {
                    catItems.push(groups[sc][i]);
                    added = true;
                  }
                }
                i++;
              }
              if (catItems.length === 0) return null;

              return (
                <div key={catName} className="group/section">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl md:text-3xl font-medium text-black tracking-tight">{catName}</h3>
                    </div>
                    <Link
                      href={`/category/${toCategorySlug(catName)}`}
                      className="bg-deep-green text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-[13px] hover:bg-deep-green/90 transition-all shadow-sm group"
                    >
                      More {catName} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {catItems.map((product, idx) => renderProductCard(product, idx))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT GRID BY TYPE - VERTICAL SECTIONS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 mb-14">
        <div className="py-4 sm:py-8">

          {/* Vertical Categories */}
          <div className="space-y-24">
            {typeFilters.filter(f => f !== "All Fish").map((type) => {
              const typeItems = products.filter(p => {
                const pCat = p.category.toLowerCase();
                const tLower = type.toLowerCase();
                if (tLower === "fingerlings") return pCat === "fingerlings";
                if (tLower === "juvenile") return pCat === "juveniles" || pCat === "juvenile";
                if (tLower === "broodstock") return pCat === "broodstock";
                if (tLower === "table size") return pCat === "table-size" || pCat === "table size";
                if (tLower === "smoked") return pCat === "smoked";
                return pCat === tLower || p.category === type;
              }).slice(0, 4);

              if (typeItems.length === 0) return null;

              return (
                <div key={type} className="group/section">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl md:text-4xl font-medium text-black tracking-tight">{type}</h3>
                    </div>
                    <Link
                      href={`/category/${toCategorySlug(type)}`}
                      className="bg-deep-green text-white px-2 py-2 rounded-full flex items-center gap-2 font-bold text-[10px] truncate hover:bg-deep-green/90 transition-all shadow-sm group"
                    >
                      More {type} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3">
                    {typeItems.map((product, idx) => renderProductCard(product, idx))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-leaf text-white px-10 py-3 rounded-xl font-black transition-all text-sm tracking-widest uppercase hover:bg-leaf-dark active:scale-95"
            >
              Explore Full Catalog <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GROWTH STAGES / SELECTION GUIDE ===== */}
      <section className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 mb-22">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 pb-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight leading-[0.9]">
              From Hatchery to Harvest
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-sm text-sm leading-relaxed">
            Technical specifications for each growth stage, ensuring you select the right fit for your specific farming objectives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 rounded-xl overflow-hidden">
          {initialGrowthStages.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className={`relative group p-8 lg:p-12 bg-white flex flex-col ${idx !== 2 ? "md:border-r border-gray-100" : ""} hover:bg-gray-50/50 transition-colors duration-500`}
            >

              {/* Title & Description */}
              <div className="mb-10">
                <h3 className="text-2xl font-black text-deep-green uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                  "{item.description}"
                </p>
              </div>

              {/* Image Container - Rectangular & Sleek */}
              <div className="relative aspect-[5/3] w-full mb-10 overflow-hidden rounded-xl border border-black/5 bg-gray-50">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Specifications - Grid Layout */}
              <div className="mt-auto space-y-6">
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Average Size</span>
                    <span className="text-xl font-black text-deep-green tracking-tight">{item.size}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Standard Age</span>
                    <span className="text-xl font-black text-deep-green tracking-tight">{item.age}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href={item.link}>
                    <button
                      className="inline-flex items-center justify-center gap-2 w-full bg-deep-green text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-[#0f2f21] shadow-sm active:scale-95 group/btn cursor-pointer"
                    >
                      Order {item.title}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRICE CATALOGUE ===== */}
      {catalogItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Header Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <h2 className="text-3xl md:text-5xl font-black text-deep-green tracking-tighter leading-[0.9] mb-8">
                Transparent <br />
                <span className="text-leaf">Pricing.</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm">
                We provide honest market rates for our premium stock. No hidden fees, just pure value for your investment.
              </p>

              <div className="mt-12 hidden lg:block">
                <div className="p-6 bg-surface-alt rounded-2xl border border-border">
                  <p className="text-xs font-bold text-deep-green mb-2">Need a custom quote?</p>
                  <p className="text-xs text-muted leading-relaxed mb-4">For bulk orders or specific growth requirements, contact our sales team directly.</p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-leaf hover:underline">Contact Us &rarr;</button>
                </div>
              </div>
            </div>

            {/* Grid Column */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {catalogItems.map((item, idx) => {
                  const slug = toCategorySlug(item.name);
                  return (
                    <Link
                      key={idx}
                      href={`/book-order/?cat=${slug}`}
                      className="block group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full"
                      >
                        {/* Image Section */}
                        <div className="relative h-56 md:h-80 w-full overflow-hidden bg-gray-50">
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100">
                            <p className="text-[10px] font-black text-deep-green uppercase tracking-widest">{item.unit}</p>
                          </div>
                        </div>

                        <div className="p-4 md:p-8">
                          <h3 className="text-sm md:text-xl font-black text-gray-900 tracking-tight mb-4 line-clamp-1">{item.name}</h3>

                          <div className="flex items-end justify-between pt-4 md:pt-6 border-t border-gray-50">
                            <div>
                              <p className="text-[7px] md:text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Standard Rate</p>
                              <p className="text-sm md:text-2xl font-black text-leaf tracking-tighter">{item.priceRange}</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-alt border border-border flex items-center justify-center group-hover:bg-leaf group-hover:border-leaf transition-all shrink-0">
                              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-deep-green group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-[#18231d] py-20 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">Why buyers stay with CCB Farms</h2>
            <p className="text-white/60 text-base max-w-2xl mx-auto font-medium">
              A mature supply operation is about consistency, handling discipline, and responsive service at every order size.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Healthy & Disease-Free", desc: "Strict bio-security controls ensure robust health and zero disease in every batch.", icon: Shield },
              { title: "Consistent Quality", desc: "Guaranteed uniform sizes and excellent feeding response across all categories.", icon: CheckCircle },
              { title: "Reliable Supply", desc: "Consistent supply and timely delivery within Lagos, Nationwide & Internationally to your doorstep.", icon: Truck },
              { title: "Competitive Pricing", desc: "Premium quality at the most competitive prices for maximum value.", icon: Tag },
              { title: "Hygienic Processing", desc: "Professional packaging for both live and smoked catfish products.", icon: Leaf },
              { title: "Expert Support", desc: "Technical guidance and professional support for maximum yield and success.", icon: Users },
            ].map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white/[0.04] border border-white/10 p-7 rounded-xl hover:bg-white/[0.06] hover:border-white/16 transition-all"
              >
                <div className="w-12 h-12 bg-white/8 rounded-xl flex items-center justify-center mb-5 border border-white/10">
                  <Icon className="w-6 h-6 text-[#9cc4a7]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight">A clear ordering process</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Browse & Select", desc: "Choose from Fingerlings, Juveniles, Table-size, Smoked, or Broodstock.", icon: Search },
            { step: "02", title: "Place Your Order", desc: "Order online or WhatsApp us at 09093009400 for bulk inquiries.", icon: ShoppingCart },
            { step: "03", title: "We Prepare It", desc: "Your order is carefully packaged with hygiene and precision.", icon: Package },
            { step: "04", title: "Global Delivery", desc: "Express delivery across Lagos, Nationwide & Internationally — your choice.", icon: Truck },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-black/10 to-transparent -z-10" />
              )}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white border border-black/6 p-7 rounded-xl hover:border-black/12 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 bg-deep-green/8 rounded-xl flex items-center justify-center group-hover:bg-deep-green transition-colors">
                    <item.icon className="w-5 h-5 text-deep-green group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-black text-gray-200">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS (Centered Slider) ===== */}
      {initialTestimonials.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="text-center mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight">Hear What People Say About Us</h2>
          </div>

          <div className="relative">
            <TestimonialSlider testimonials={initialTestimonials} />
          </div>
        </section>
      )}

      {/* ===== SERVING FARMERS & FAMILIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gray-50 rounded-xl p-8 md:p-16 border border-gray-100 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight mb-8">
                Serving Farmers &<br />Families Alike
              </h2>
              <div className="space-y-6">
                {[
                  { title: "For Farmers & Retailers", desc: "From small-scale farmers to large commercial operations — we supply fish that meet your exact needs.", icon: Users },
                  { title: "For Families & Restaurants", desc: "Hygienically handled catfish delivered straight to your home or kitchen for a premium dining experience.", icon: ShoppingBag },
                ].map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                      <Icon className="w-6 h-6 text-leaf" />
                    </div>
                    <div>
                      <h4 className="font-bold text-deep-green text-base mb-1">{title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border-4 border-white">
              <Image src="/happyFamily.png" alt="Happy Family eating at a dining table" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HEALTH BENEFITS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24" id="health-benefits">
        <div className="bg-white rounded-xl p-8 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-sm border-8 border-white group">
                <Image
                  src="/assets/bgImages/tablesize.png"
                  alt="Healthy Catfish"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm w-fit border border-gray-100">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-8 h-8 bg-leaf rounded-xl flex items-center justify-center text-white">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <h4 className="font-black text-deep-green tracking-tight text-sm">Superfood Choice</h4>
                    </div>
                    <p className="text-gray-500 text-[9px] font-black leading-none uppercase tracking-[0.15em] ml-11">
                      Protein • Omega-3 • B12
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Textual Content */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight mb-8">
                The Health Benefits of<br />
                <span className="text-leaf">Eating Catfish</span>
              </h2>

              <p className="text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
                Catfish is more than just a tasty meal—it&apos;s a nutritional powerhouse. High in protein yet low in calories, it provides essential fatty acids and vitamins that are vital for your longevity and daily energy.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  {
                    title: "Heart Health",
                    desc: "Excellent source of Omega-3 fatty acids that lower blood pressure and protect against heart disease.",
                    icon: Activity,
                    color: "text-red-600",
                    bgColor: "bg-red-50"
                  },
                  {
                    title: "Regulates Sugar",
                    desc: "An ideal protein source for managing Type 2 Diabetes by helping to maintain stable blood sugar levels.",
                    icon: Zap,
                    color: "text-amber-500",
                    bgColor: "bg-amber-50"
                  },
                  {
                    title: "Joint Care",
                    desc: "Natural anti-inflammatory properties help reduce joint pain, stiffness, and chronic inflammation.",
                    icon: Shield,
                    color: "text-blue-500",
                    bgColor: "bg-blue-50"
                  },
                  {
                    title: "Liver Vitality",
                    desc: "Supplies crucial B-vitamins and minerals that support liver detoxification and overall metabolic health.",
                    icon: Brain,
                    color: "text-leaf",
                    bgColor: "bg-leaf/10"
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 shrink-0 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-deep-green text-sm mb-1">{item.title}</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-[#1a231d] rounded-xl p-10 md:p-16 relative overflow-hidden text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">Stay informed without the noise</h2>
            <p className="text-white/60 text-base mb-8 font-medium">
              Get periodic pricing updates, product availability, and useful farm notes in a more measured cadence.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}
            >
              <input
                required
                type="email"
                placeholder="Enter your email address"
                className="flex-grow bg-white/8 border border-white/12 focus:border-[#87a08e] rounded-xl px-5 py-3.5 outline-none font-medium text-white placeholder-white/40 text-sm transition-all"
              />
              <button
                type="submit"
                className="bg-[#2c5b43] hover:bg-[#214734] text-white px-7 py-3.5 rounded-xl font-bold uppercase tracking-wide transition-all active:scale-95 shadow-sm text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/40 text-xs mt-4 font-medium">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#dfe6dc] rounded-xl p-10 md:p-20 text-center relative overflow-hidden border border-black/6">
          <div className="absolute inset-0 bg-[url('/hero.png')] opacity-[0.05] bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green tracking-tight mb-6">
              Ready to place an order?
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
              We can help you choose the right size, quantity, and delivery arrangement for your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-order" className="bg-deep-green text-white hover:bg-[#0f2f21] px-8 py-4 rounded-xl font-black text-base transition-all shadow-sm text-center tracking-wide">
                Start Order
              </Link>
              <Link href="/contact" className="bg-white/70 hover:bg-white text-deep-green border border-black/8 px-8 py-4 rounded-xl font-bold text-base transition-all text-center tracking-wide">
                Talk to the Team
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-10 text-gray-600 font-bold text-sm">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> 09093009400</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lagos, Nationwide & Int'l</span>
              <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Nationwide & Global Delivery</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
