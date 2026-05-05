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
import { getPriceCatalog } from "@/app/actions/price-catalog";
import { PriceCatalogItem } from "@/lib/db/schema";






// Countdown Timer Hook
function useCountdown(targetDate?: Date | string) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return { h: 11, m: 59, s: 59 };
      const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
      const difference = target.getTime() - new Date().getTime();
      if (difference <= 0) return { h: 0, m: 0, s: 0 };
      return {
        h: Math.floor((difference / (1000 * 60 * 60))),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
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

interface ProductProps {
  id: string;
  name: string;
  desc: string;
  img: string;
  price: string;
  originalPrice: string;
  unit: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
  rawPrice: number | null;
  rawPriceRange: string | null;
}

const AdContent = ({ ad, handleAdOrderConfirm }: { ad: any, handleAdOrderConfirm: (ad: any) => void }) => {
  if (ad.hasLink === false) {
    return (
      <div className="block rounded-sm overflow-hidden">
        <Image
          src={ad.imageUrl}
          alt={ad.title || "Special offer from our partner"}
          width={1200}
          height={600}
          className="w-full h-[100px] md:h-[240px] object-contain"
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
          className="block rounded-sm overflow-hidden cursor-pointer group transition-all"
        >
          <Image
            src={ad.imageUrl}
            alt={ad.title || "Special offer from our partner"}
            width={800}
            height={400}
            className="w-full h-[120px] md:h-[180px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
          />
        </Link>
      ) : (
        <div
          onClick={() => handleAdOrderConfirm(ad)}
          className="block rounded-sm overflow-hidden cursor-pointer group transition-all"
        >
          <Image
            src={ad.imageUrl}
            alt={ad.title || "Special offer from our partner"}
            width={800}
            height={400}
            className="w-full h-[120px] md:h-[180px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}
    </>
  );
};

const SliderCountdown = ({ targetDate, isMobile }: { targetDate: Date | string | null, isMobile?: boolean }) => {
  const time = useCountdown(targetDate || undefined);
  return (
    <div className={`flex items-center gap-1 font-bold ${!isMobile ? 'text-xl' : ''} tabular-nums`} suppressHydrationWarning>
      <span>{pad(time.h)}h</span>
      <span>:</span>
      <span>{pad(time.m)}m</span>
      <span>:</span>
      <span>{pad(time.s)}s</span>
    </div>
  );
};

const HeroCountdown = ({ targetDate }: { targetDate: Date | string | null }) => {
  const time = useCountdown(targetDate || undefined);
  return (
    <div className="flex items-center gap-2 ml-1 font-black text-deep-green tabular-nums" suppressHydrationWarning>
      <div className="flex items-center gap-1">
        <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-sm text-[11px]">{pad(time.h)}</span>
        <span className="text-[9px] text-foreground/30 font-bold lowercase">h</span>
      </div>
      <span className="text-foreground/10">:</span>
      <div className="flex items-center gap-1">
        <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-sm text-[11px]">{pad(time.m)}</span>
        <span className="text-[9px] text-foreground/30 font-bold lowercase">m</span>
      </div>
      <span className="text-foreground/10">:</span>
      <div className="flex items-center gap-1">
        <span className="bg-deep-green text-white px-1.5 py-0.5 rounded-sm text-[11px]">{pad(time.s)}</span>
        <span className="text-[9px] text-foreground/30 font-bold lowercase">s</span>
      </div>
    </div>
  );
};

const PartnerAdSection = ({ initialPartnerAds, handleAdOrderConfirm }: { initialPartnerAds: any[], handleAdOrderConfirm: (ad: any) => void }) => {
  if (!initialPartnerAds || initialPartnerAds.length === 0) return null;

  // Reverse the order so the last item shows first
  const reversedAds = [...initialPartnerAds].reverse();

  return (
    <section className="bg-transparent mb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-deep-green tracking-tight uppercase">Featured Products</h2>
          <div className="flex-1 h-px bg-gray-100" />
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
                  <div className="relative bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden p-2">
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
  initialPartnerAds = []
}: {
  initialProducts: ProductProps[],
  initialFlashDeal?: any,
  activeFlashDeals?: any[],
  globalSettings?: any,
  initialTestimonials?: any[],
  initialPriceCatalog?: PriceCatalogItem[],
  initialPartnerAds?: any[]
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
  const typeFilters = ["All Fish", "Fingerlings", "Juvenile", "Broodstock", "Table Size", "Smoked"];

  // Filtered lists for vertical sections are computed inline to avoid redundant state management

  const renderProductCard = (product: ProductProps, idx: number) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.08 }}
      className="group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 ">
        <Image
          src={product.img || "/assets/bgImages/fingerlings.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md`}>
            {product.badge}
          </div>
        )}


      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        {/* Rating */}


        {/* Name */}
        <h3 className="font-black text-base sm:text-lg text-gray-900  mb-1 tracking-tight truncate sm:whitespace-normal">{product.name}</h3>
        <p className="text-[11px] sm:text-sm text-gray-500  font-medium mb-2 line-clamp-2">{product.desc}</p>

        {/* Category Badge */}
        <div className="mb-3">
          <Link
            href={`/${product.category}`}
            className="inline-block text-[10px] font-black bg-leaf/10 text-leaf hover:bg-leaf hover:text-white px-3 py-1.5 rounded-full uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md active:scale-90"
          >
            {product.category}
          </Link>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between border-t border-gray-50 ">
          <div>
            <p className="text-base sm:text-xl font-black text-gray-900 ">{product.price}</p>
            <div className="flex items-center gap-2">
              {product.originalPrice && <p className="text-[10px] sm:text-xs text-gray-400 font-medium">₦{product.originalPrice}</p>}
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">per {product.unit}</span>
            </div>
          </div>
          <button
            onClick={() => handleOrderConfirm(product)}
            className="flex items-center justify-center gap-1.5 bg-leaf text-white p-2 sm:px-4 sm:py-2.5 rounded-sm font-bold text-sm transition-all hover:shadow-lg hover:shadow-leaf/20 active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </motion.div>
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
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Search Bar */}
        <div id="hero-search-bar" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-18 mb-12 relative z-10">
          <div
            className="relative group cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
          >
            <div className="w-full h-10 pl-14 pr-6 rounded-sm border-2 border-white/20 focus-within:border-leaf bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center">
              <span className="text-gray-400 text-sm font-medium">Search for catfish, fingerlings...</span>
            </div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf" />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-sm uppercase tracking-widest border border-gray-200">⌘K</span>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 style={{ fontFamily: "var(--belanosima-font), sans-serif" }} className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-white">
              Premium Catfish<br />
              <span className="text-leaf">Direct from Farm</span>
            </h1>

            <p className="text-md text-white/80 mb-5 max-w-xl leading-relaxed font-medium">
              Healthy. Fresh. Responsibly Raised. — Supplying high-quality catfish across all growth stages to farmers, retailers, restaurants & households within Lagos, Nationwide and Internationally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/category" className="inline-flex items-center justify-center gap-2.5 bg-leaf hover:bg-leaf-dark text-white px-8 py-2.5 rounded-sm font-bold text-base transition-all hover:-translate-y-0.5 shadow-sm active:scale-95 tracking-wide">
                <ShoppingCart className="w-5 h-5" />
                Explore Categories
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white hover:text-white text-black px-8 py-2.5 rounded-sm font-bold transition-all hover:bg-leaf text-base">
                <Phone className="w-5 h-5 text-black hover:text:white" />
                Talk to an Expert
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 lg:gap-12 border-t border-white/15 pt-8">
              {[
                { value: "₦80", label: "From / Piece" },
                { value: "100%", label: "Organic Feed" },
                { value: "24h", label: "Farm to Table" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-leaf">{s.value}</p>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MULTIPLE FLASH DEALS SLIDER ===== */}
      {activeFlashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-sm overflow-hidden shadow-sm border border-black/5">
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
                    <div className="relative aspect-square mb-3 bg-white rounded-sm overflow-hidden shrink-0 border border-black/5 flex items-center justify-center">
                      <Image
                        src={deal.imageUrl || product.img}
                        alt={deal.title || product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                      {deal.discount && (
                        <div className="absolute top-0 right-0 bg-orange-50 text-orange-500 font-medium text-xs px-1.5 py-0.5 rounded-sm">
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
              <h2 className="text-lg font-black text-deep-green uppercase tracking-tight">{initialFlashDeal.title}</h2>
              <div className="flex items-center gap-1.5 ml-auto text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                <span>Ends in</span>
                <HeroCountdown targetDate={initialFlashDeal.endTime} />
              </div>
            </div>

            {/* Deal Card */}
            <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="relative w-full md:w-[280px] h-[200px] md:h-[240px] bg-zinc-50 shrink-0 overflow-hidden group">
                  {initialFlashDeal.imageUrl ? (
                    <Image
                      src={initialFlashDeal.imageUrl}
                      alt={initialFlashDeal.subtitle || "Flash deal"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : dealProduct?.img ? (
                    <Image
                      src={dealProduct.img}
                      alt={dealProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-leaf/5 to-deep-green/5 flex items-center justify-center">
                      <Package className="w-16 h-16 text-leaf/20" />
                    </div>
                  )}
                  {/* Discount Badge */}
                  {initialFlashDeal.discount && (
                    <div className="absolute top-4 left-4 bg-leaf text-white px-3 py-1.5 rounded-sm font-black text-sm shadow-sm">
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
                    <div className="h-1.5 w-full bg-black/5 rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm bg-red-600 transition-all duration-1000 shadow-sm"
                        style={{ width: `${Math.min(Math.max((initialFlashDeal.stockSold / (initialFlashDeal.stockTotal || 100)) * 100, 5), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (dealProduct) handleOrderConfirm(dealProduct);
                      }}
                      className="bg-leaf hover:bg-leaf-dark text-white px-6 py-2.5 rounded-sm font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 group/btn"
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
      <section id="shop-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32 mb-1">
        <div className="py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-deep-green tracking-tight">Shop by Category</h2>
            </div>
          </div>

          <div className="space-y-20">
            {filters.map((catName) => {
              const catItems = products.filter(p => {
                const pCat = p.category.toLowerCase();
                if (catName === "Farming") return ["fingerlings", "juveniles", "farming"].includes(pCat);
                if (catName === "Consumption") return ["table-size", "smoked", "consumption"].includes(pCat);
                if (catName === "Breeding") return ["broodstock", "breeding"].includes(pCat);
                return p.category === catName;
              }).slice(0, 2);
              if (catItems.length === 0) return null;

              return (
                <div key={catName} className="group/section">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl md:text-3xl font-black text-deep-green tracking-tight">{catName}</h3>
                    </div>
                    <Link
                      href={`/category/${catName.toLowerCase()}`}
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-1">
        <div className="py-4 sm:py-8">

          {/* Vertical Categories */}
          <div className="space-y-24">
            {typeFilters.filter(f => f !== "All Fish").map((type) => {
              const typeItems = products.filter(p => {
                const pCat = p.category.toLowerCase();
                if (type === "Fingerlings") return pCat === "fingerlings";
                if (type === "Juvenile") return pCat === "juveniles" || pCat === "juvenile";
                if (type === "Broodstock") return pCat === "broodstock";
                if (type === "Table Size") return pCat === "table-size" || pCat === "table size";
                if (type === "Smoked") return pCat === "smoked";
                return false;
              }).slice(0, 2);

              if (typeItems.length === 0) return null;

              return (
                <div key={type} className="group/section">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl md:text-4xl font-black text-deep-green tracking-tight">{type}</h3>
                    </div>
                    <Link
                      href={`/${type === "Juvenile" ? "juveniles" : type === "Table Size" ? "table-size" : type.toLowerCase()}`}
                      className="bg-deep-green text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-bold text-[13px] hover:bg-deep-green/90 transition-all shadow-sm group"
                    >
                      More {type} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {typeItems.map((product, idx) => renderProductCard(product, idx))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-leaf text-white px-10 py-3 rounded-sm font-black transition-all text-sm tracking-widest uppercase hover:bg-leaf-dark active:scale-95"
            >
              Explore Full Catalog <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GROWTH STAGES / SELECTION GUIDE ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-deep-green tracking-tight mb-4">From Hatchery to Harvest</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Technical specifications for each growth stage, ensuring you select the right fit for your farming objectives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Fingerlings",
              size: "2–5 cm",
              age: "1–2 weeks",
              desc: "Healthy Start, High Survival",
              img: "/assets/bgImages/fingerlings.png",
              color: "leaf",
              link: "/book-order?cat=fingerlings"
            },
            {
              title: "Juveniles",
              size: "5–15 cm",
              age: "3–6 weeks",
              desc: "Fast Growth, Uniform Quality",
              img: "/assets/bgImages/juveniles.png",
              color: "leaf",
              link: "/book-order?cat=juveniles"
            },
            {
              title: "Broodstock",
              size: "30 cm+",
              age: "6+ months",
              desc: "Breeding Stock, Strong Genetics",
              img: "/assets/bgImages/broodstock.png",
              color: "leaf",
              link: "/book-order?cat=broodstock"
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              className="relative group p-8 sm:p-12 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-700 text-center flex flex-col items-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 -z-0" />

              {/* Image Container */}
              <div className="relative w-48 h-48 mb-10">
                <div className="absolute inset-0 bg-leaf/10 rounded-full scale-110 group-hover:scale-105 transition-transform duration-700" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm z-10">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                </div>

                {/* Title Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-deep-green text-white px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.25em] shadow-sm z-20 whitespace-nowrap">
                  {item.title}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-6 relative z-10 w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-[2px] bg-leaf/20" />
                    <span className="text-leaf font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-leaf/5 rounded-sm border border-leaf/10">Technical Specs</span>
                    <div className="w-8 h-[2px] bg-leaf/20" />
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Size</span>
                      <span className="text-2xl font-black text-deep-green tracking-tight">{item.size}</span>
                    </div>
                    <div className="flex flex-col pt-2 border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Age</span>
                      <span className="text-2xl font-black text-deep-green tracking-tight">{item.age}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-sm p-4 border border-gray-100 italic font-bold text-[11px] text-gray-500">
                  "{item.desc}"
                </div>

                <div className="pt-4">
                  <Link href={item.link}>
                    <button
                      className="inline-flex items-center justify-center gap-2 w-full bg-leaf text-white py-2.5 rounded-sm font-black text-sm transition-all hover:bg-leaf-dark shadow-sm active:scale-95 group/btn cursor-pointer"
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

        {/* Footer Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg md:text-2xl font-black text-deep-green tracking-tight italic">
            From Hatchery to Harvest — We&apos;ve Got You Covered
          </p>
        </motion.div>
      </section>

      {/* ===== ABOUT + VALUES ===== */}
      <section id="about" className="bg-gray-50 py-24 mb-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-deep-green mb-8 leading-[1.05] tracking-tight">
              Quality, Consistency &<br />
              <span className="text-leaf">Customer Satisfaction</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium max-w-2xl mx-auto">
              A trusted catfish supplier raising fish under controlled conditions with expert handling, proper feeding, and clean water systems for the highest standards.
            </p>
          </div>

          {/* 4 Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-16">
            {[
              { title: "Hygienic Bio-Security", sub: "Rigorous disease-control standards for every batch.", icon: Shield },
              { title: "Expert Support", sub: "Professional guidance at every growth stage.", icon: Users },
              { title: "Organic Feed Only", sub: "Zero hormones or chemicals. Pure nutrition.", icon: Leaf },
              { title: "Timely Delivery", sub: "Reliable Nationwide & International logistics you can count on.", icon: Truck },
            ].map(({ title, sub, icon: Icon }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className="group bg-white border border-gray-100 rounded-sm p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-leaf/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-sm bg-leaf/10 border border-leaf/20 flex items-center justify-center group-hover:bg-leaf group-hover:text-white transition-colors duration-500">
                    <Icon className="w-5 h-5 text-leaf group-hover:text-white" />
                  </div>
                </div>
                <h4 className="font-black text-gray-900 text-base lg:text-lg mb-3 tracking-tight leading-snug">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar: Stats + CTA */}
          <div className="bg-deep-green rounded-sm p-6 lg:p-4 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
            {/* Stats */}
            <div className="flex items-center gap-6 lg:gap-10 flex-wrap justify-center lg:justify-start">
              {[
                { val: "100%", label: "Organic Feed", highlight: true },
                { val: "24/7", label: "Expert Support" },
                { val: "48h", label: "Delivery Time" },
              ].map(({ val, label, highlight }, i) => (
                <div key={label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-8 bg-white/15 hidden lg:block" />}
                  <div className="text-center lg:text-left px-2">
                    <p className={`text-2xl font-black ${highlight ? 'text-leaf' : 'text-white'} mb-0.5 tracking-tight`}>{val}</p>
                    <p className="text-[9px] font-bold text-white/35 uppercase tracking-[0.2em]">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/category"
              className="inline-flex items-center gap-3 bg-leaf hover:bg-leaf-dark text-white px-8 py-4 rounded-sm font-black text-sm transition-all hover:shadow-sm active:scale-95 group shrink-0"
            >
              Shop Our Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRICE CATALOGUE ===== */}
      {catalogItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-black text-deep-green tracking-tight leading-tight">
                Transparent & <br />
                <span className="text-leaf">Competitive Pricing</span>
              </h2>
              <p className="text-gray-500 mt-4 text-lg font-medium leading-relaxed">
                We provide honest market rates for our premium stock. No hidden fees, just pure value for your investment.
              </p>
            </div>
            <div className="hidden lg:block shrink-0 pb-2">
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-sm border border-gray-100">
                <div className="px-6 py-4 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Updated</p>
                  <p className="text-sm font-black text-deep-green">Daily 8:00 AM</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="px-6 py-4 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-leaf" />
                    <p className="text-sm font-black text-leaf">Live Catalog</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {catalogItems.map((item, idx) => {
              const accentClasses = "bg-leaf/5 border-leaf/10 text-leaf";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-white border border-gray-100 p-0 rounded-sm md:rounded-sm shadow-sm hover:shadow-lg transition-all duration-700 overflow-hidden cursor-pointer`}
                >

                  {/* Image Section */}
                  {item.imageUrl ? (
                    <div className="relative h-32 md:h-48 w-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="px-6 md:px-10 pt-6 md:pt-10">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-sm ${accentClasses} border flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <Tag className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                  )}


                  <div className="px-6 md:px-10 pb-6 md:pb-10 pt-3 md:pt-3 relative z-10">
                    <h3 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                    <p className="text-[10px] md:text-sm font-medium text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>


                    <div className="pt-4 md:pt-8 border-t border-gray-50">
                      <p className="text-[8px] md:text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] md:tracking-[0.25em] mb-1 md:mb-3">Price Range</p>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-sm md:text-xl font-black text-deep-green tracking-tighter">{item.priceRange}</span>
                        <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">/ {item.unit}</span>
                      </div>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-deep-green py-20 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(white_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-white text-3xl lg:text-4xl font-black mb-4 tracking-tight">The CCB Farms Advantage</h2>
            <p className="text-white/60 text-base max-w-xl mx-auto font-medium">
              We supply catfish you can trust — delivered with reliability and expert care.
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
                whileHover={{ y: -6 }}
                className="bg-white/5 border border-white/10 p-7 rounded-sm hover:bg-white/10 hover:border-leaf/30 transition-all"
              >
                <div className="w-12 h-12 bg-leaf/20 rounded-sm flex items-center justify-center mb-5 border border-leaf/20">
                  <Icon className="w-6 h-6 text-leaf" />
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
          <h2 className="text-3xl md:text-4xl font-black text-deep-green tracking-tight">Order in 4 Easy Steps</h2>
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
                <div className="hidden lg:block absolute top-10 left-full w-full h-[2px] bg-gradient-to-r from-leaf/20 to-transparent -z-10" />
              )}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 p-7 rounded-sm hover:border-leaf/30 hover:shadow-lg hover:shadow-leaf/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 bg-leaf/10 rounded-sm flex items-center justify-center group-hover:bg-leaf transition-colors">
                    <item.icon className="w-5 h-5 text-leaf group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-black text-gray-100">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {initialTestimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-green tracking-tight">What Our Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {initialTestimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-100 rounded-sm p-7 shadow-sm hover:shadow-md hover:border-leaf/20 transition-all"
              >
                <p className="text-gray-600 text-sm leading-relaxed font-medium mb-6 italic">"{t.review}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-leaf to-deep-green flex items-center justify-center text-white text-xs font-black shrink-0">
                    {t.initials || (t.name?.split(' ').map((n: any) => n[0]).join('') || 'U')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ===== SERVING FARMERS & FAMILIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gray-50 rounded-sm p-8 md:p-16 border border-gray-100 relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-deep-green mb-8 tracking-tight">
                Serving Farmers &<br />Families Alike
              </h2>
              <div className="space-y-6">
                {[
                  { title: "For Farmers & Retailers", desc: "From small-scale farmers to large commercial operations — we supply fish that meet your exact needs.", icon: Users },
                  { title: "For Families & Restaurants", desc: "Hygienically handled catfish delivered straight to your home or kitchen for a premium dining experience.", icon: ShoppingBag },
                ].map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-12 h-12 rounded-sm bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
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
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-sm border-4 border-white">
              <Image src="/happyFamily.png" alt="Happy Family eating at a dining table" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HEALTH BENEFITS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24" id="health-benefits">
        <div className="bg-white rounded-sm p-8 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm border-8 border-white group">
                <Image
                  src="/assets/bgImages/tablesize.png"
                  alt="Healthy Catfish"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white p-4 rounded-sm shadow-sm w-fit border border-gray-100">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-8 h-8 bg-leaf rounded-sm flex items-center justify-center text-white">
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
              <h2 className="text-3xl md:text-5xl font-black text-deep-green mb-8 tracking-tight leading-tight">
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
                    <div className="flex gap-4 p-4 rounded-sm hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 shrink-0 ${item.bgColor} rounded-sm flex items-center justify-center`}>
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
        <div className="bg-deep-green rounded-sm p-10 md:p-16 relative overflow-hidden text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Get Exclusive Offers</h2>
            <p className="text-white/60 text-base mb-8 font-medium">
              Weekly price updates, farming tips, and exclusive deals straight to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}
            >
              <input
                required
                type="email"
                placeholder="Enter your email address"
                className="flex-grow bg-white/10 border-2 border-white/10 focus:border-leaf rounded-sm px-5 py-3.5 outline-none font-medium text-white placeholder-white/40 text-sm transition-all"
              />
              <button
                type="submit"
                className="bg-leaf hover:bg-leaf-dark text-white px-7 py-3.5 rounded-sm font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm text-sm whitespace-nowrap"
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
        <div className="bg-gradient-to-br from-leaf to-leaf-dark rounded-sm p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero.png')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white">
              Ready to Order<br />
              <span className="text-white/80">Premium Catfish?</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
              Place your order today or speak with our team for the best recommendation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-order" className="bg-white text-leaf hover:bg-gray-50 px-8 py-4 rounded-sm font-black text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20 text-center tracking-wide">
                Place Order Now
              </Link>
              <Link href="/contact" className="bg-white/15 hover:bg-white/25 text-white border-2 border-white/25 px-8 py-4 rounded-sm font-bold text-base transition-all hover:-translate-y-0.5 text-center tracking-wide">
                Talk to an Expert
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-10 text-white/60 font-bold text-sm">
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
