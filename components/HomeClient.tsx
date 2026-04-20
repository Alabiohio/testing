"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, ShoppingCart, ChevronRight, ChevronDown,
  Shield, Truck, Clock, Star, ArrowRight, CheckCircle,
  Zap, Tag, Phone, MapPin, Users, Leaf, Package, Heart, Activity, Brain
} from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import { useCart } from "@/lib/cart-context";

// Countdown Timer Hook
function useCountdown(targetHours: number) {
  const [time, setTime] = useState({ h: targetHours, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: targetHours, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [targetHours]);
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

export default function HomeClient({ initialProducts }: { initialProducts: ProductProps[] }) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTypeFilter, setActiveTypeFilter] = useState("All Fish");
  const countdown = useCountdown(11);
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

  const filters = ["All", "Farming", "Consumption", "Breeding"];
  const typeFilters = ["All Fish", "Fingerlings", "Juvenile", "Broodstock", "Table Size", "Smoked"];

  const filteredByCategory = products.filter(p => activeFilter === "All" || p.category === activeFilter);

  const filteredByType = products.filter(p => {
    if (activeTypeFilter === "All Fish") return true;

    const searchString = `${p.name} ${p.id} ${p.category} ${p.desc}`.toLowerCase();

    if (activeTypeFilter === "Fingerlings") return searchString.includes("fingerling");
    if (activeTypeFilter === "Juvenile") return searchString.includes("juvenil");
    if (activeTypeFilter === "Broodstock") return searchString.includes("broodstock");
    if (activeTypeFilter === "Table Size") return searchString.includes("table size") || searchString.includes("table-size") || searchString.includes("table_size");
    if (activeTypeFilter === "Smoked") return searchString.includes("smoke");
    return false;
  });

  const renderProductCard = (product: ProductProps, idx: number) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.08 }}
      className="product-card-glow group bg-white  rounded-2xl overflow-hidden border border-gray-100  shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 ">
        <Image
          src={product.img || "/hero.png"}
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
        {/* Discount */}
        {product.originalPrice && product.originalPrice !== product.price && (
          <div className="absolute top-3 right-3 bg-white  text-red-500 text-[10px] font-black px-2.5 py-1.5 rounded-full border border-red-100  shadow-sm">
            -{Math.round((1 - parseInt(product.price.replace(/[^0-9]/g, '')) / parseInt(product.originalPrice.replace(/[^0-9]/g, ''))) * 100)}%
          </div>
        )}
        {/* Wishlist */}
        <button className="absolute bottom-3 right-3 p-2 bg-white  rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 text-gray-400 border border-gray-100 ">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 '}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-500 ">{product.rating} ({product.reviews})</span>
        </div>

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
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 ">
          <div>
            <p className="text-base sm:text-xl font-black text-gray-900 ">{product.price}</p>
            <div className="flex items-center gap-2">
              {product.originalPrice && <p className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">{product.originalPrice}</p>}
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">per {product.unit}</span>
            </div>
          </div>
          <button
            onClick={() => handleOrderConfirm(product)}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white p-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const testimonials = [
    {
      name: "Adeola Okafor",
      role: "Commercial Fish Farmer, Lagos",
      review: "CCB Farms has been my top supplier for 3 years. The fingerlings are always healthy and the survival rate is outstanding — consistently above 95%.",
      rating: 5,
      img: null,
      initials: "AO",
    },
    {
      name: "Blessing Nwosu",
      role: "Restaurant Owner, Abuja",
      review: "I order the table-size catfish every week. Freshness is guaranteed and delivery is always on time. My customers love the quality.",
      rating: 5,
      img: null,
      initials: "BN",
    },
    {
      name: "Emeka Taiwo",
      role: "Fish Retailer, Ogun State",
      review: "The smoked catfish is excellent — rich flavor, long shelf life. I resell them and my customers keep coming back. Highly recommended!",
      rating: 5,
      img: null,
      initials: "ET",
    },
  ];

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
      {/* Background Grid */}
      <div className="absolute top-0 left-0 w-full h-[900px] bg-[radial-gradient(#bbf7d0_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_60%,transparent_100%)] opacity-30  -z-10" />
      <div className="absolute top-0 right-0 w-full h-[700px] bg-gradient-to-b from-leaf/5 to-transparent -z-10" />

      {/* ===== HERO ===== */}
      <section className="w-full mb-20 relative heroDiv pt-10 lg:pt-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div
            className="relative group cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
          >
            <div className="w-full h-10 pl-14 pr-6 rounded-xl border-2 border-gray-200  focus-within:border-leaf bg-white  shadow-sm hover:shadow-md transition-all flex items-center">
              <span className="text-gray-400  text-sm font-medium">Search for catfish, fingerlings...</span>
            </div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-leaf" />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100  px-2.5 py-1 rounded-lg uppercase tracking-widest border border-gray-200 ">⌘K</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >


              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] text-deep-green ">
                Premium Catfish<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-deep-green">Direct from Farm</span>
              </h1>

              <p className="text-md text-gray-500  mb-8 max-w-lg leading-relaxed font-medium">
                Healthy. Fresh. Responsibly Raised. — Supplying high-quality catfish across all growth stages to farmers, retailers, restaurants & households nationwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/category" className="inline-flex items-center justify-center gap-2.5 bg-leaf hover:bg-leaf-dark text-white px-8 py-2 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-leaf/30 active:scale-95 tracking-wide">
                  <ShoppingCart className="w-5 h-5" />
                  Explore Categories
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200  hover:border-leaf text-gray-700  px-8 py-2 rounded-xl font-bold transition-all hover:bg-leaf/5 text-base">
                  <Phone className="w-5 h-5 text-leaf" />
                  Talk to an Expert
                </Link>
              </div>

              {/* Trust Proof */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex -space-x-3">
                  {['AO', 'BN', 'ET', 'FK'].map((init, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full border-2 border-white  bg-gradient-to-br from-leaf to-deep-green flex items-center justify-center text-white text-[10px] font-black`}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    <span className="font-black text-sm text-gray-700  ml-1">4.9</span>
                  </div>
                  <p className="text-xs text-gray-500  font-medium">Trusted by 500+ farmers & buyers</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-100  pt-8">
                {[
                  { value: "500+", label: "Happy Customers" },
                  { value: "100%", label: "Organic Feed" },
                  { value: "24h", label: "Farm to Table" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-leaf">{s.value}</p>
                    <p className="text-xs font-bold text-gray-400  uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-square relative rounded-[48px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] border-4 border-white  group">
                <video
                  src="/assets/bgVid/hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-deep-green/30 to-transparent" />

                {/* Floating Price Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white  p-5 rounded-2xl shadow-xl border border-gray-100  animate-bounce-slow">
                  <p className="text-leaf font-black text-2xl leading-none">₦80<span className="text-sm font-bold text-gray-400">/pc</span></p>
                  <p className="text-gray-500  text-xs font-bold uppercase tracking-widest mt-1">From Fingerlings</p>
                </div>

                {/* Floating Rating */}
                <div className="absolute -top-4 -right-4 bg-white  px-4 py-3 rounded-2xl shadow-xl border border-gray-100  flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-gray-800 ">4.9/5</span>
                </div>
              </div>

              {/* Shadow outline */}
              <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full border-2 border-leaf/15 rounded-[48px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", sub: "On orders above ₦50,000" },
            { icon: Shield, title: "Quality Assured", sub: "100% disease-free fish" },
            { icon: Clock, title: "48h Fulfilment", sub: "Nationwide express delivery" },
            { icon: Phone, title: "Expert Support", sub: "Call/WhatsApp 09093009400" },
          ].map(({ icon: Icon, title, sub }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white  border border-gray-100  rounded-2xl px-5 py-4 shadow-sm hover:border-leaf/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-leaf" />
              </div>
              <div>
                <p className="font-bold text-gray-800  text-sm">{title}</p>
                <p className="text-xs text-gray-400  font-medium">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FLASH DEAL BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 opacity-10 bg-[url('/hero.png')] bg-cover bg-center" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-200 font-black text-sm uppercase tracking-widest">Flash Sale — Today Only</span>
              </div>
              <h2 className="text-white font-black text-3xl md:text-4xl mb-2">Up to 30% Off<br />Fresh Table-Size Catfish</h2>
              <p className="text-white/80 font-medium">Freshly harvested. Hygienic. Same-day delivery available.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {/* Countdown */}
              <div className="text-center">
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-2">Ends in</p>
                <div className="flex items-center gap-2">
                  {[
                    { val: countdown.h, label: 'h' },
                    { val: countdown.m, label: 'm' },
                    { val: countdown.s, label: 's' },
                  ].map(({ val, label }, i) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[52px] text-center border border-white/20">
                        <p className="text-white font-black text-2xl leading-none">{pad(val)}</p>
                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider">{label}</p>
                      </div>
                      {i < 2 && <span className="text-white/60 font-black text-xl">:</span>}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  const product = products.find(p => p.name.includes('Table-Size')) || {
                    id: "table-size",
                    name: "Fresh Table-Size",
                    desc: "",
                    img: "",
                    price: "",
                    originalPrice: "",
                    unit: "kg",
                    category: "Consumption",
                    tags: [],
                    rating: 5,
                    reviews: 0,
                    badge: "",
                    badgeColor: "",
                    rawPrice: null,
                    rawPriceRange: null
                  };
                  handleOrderConfirm(product);
                }}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-50 transition-all hover:-translate-y-0.5 shadow-lg active:scale-95 whitespace-nowrap uppercase tracking-wide"
              >
                Grab Deal →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT GRID BY CATEGORY ===== */}
      <section id="shop-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="section-label mb-3">
              <Package className="w-3.5 h-3.5" />
              Our Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-deep-green  tracking-tight">Our Shop</h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`category-pill ${activeFilter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredByCategory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredByCategory.map((product, idx) => renderProductCard(product, idx))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-deep-green mb-2">No Items Available</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  We currently don't have items in the <span className="font-bold text-leaf">{activeFilter}</span> category matching your filters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== PRODUCT GRID BY TYPE ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="py-2 sm:py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="section-label mb-3">
                <Leaf className="w-3.5 h-3.5" />
                Fish Varieties
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-deep-green  tracking-tight">Shop by Fish Type</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {typeFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveTypeFilter(f)}
                className={`category-pill bg-white/60 hover:bg-white ${activeTypeFilter === f ? 'active !bg-leaf' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredByType.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredByType.map((product, idx) => renderProductCard(product, idx))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 bg-white/50 text-leaf/30 rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-deep-green mb-2">Variety Not Found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    No <span className="font-bold text-leaf">{activeTypeFilter}</span> matches found with your current budget or availability settings.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/category"
              className="inline-flex items-center gap-2.5 border-2 border-leaf/20 text-leaf hover:bg-leaf hover:text-white hover:border-leaf px-8 py-4 rounded-xl font-bold transition-all text-sm tracking-wide shadow-sm hover:shadow-lg hover:shadow-leaf/20"
            >
              Browse All categories <ChevronRight className="w-4 h-4" />
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
              className="relative group p-8 sm:p-12 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 text-center flex flex-col items-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-leaf/5 rounded-bl-[100px] -z-0" />

              {/* Image Container */}
              <div className="relative w-48 h-48 mb-10">
                <div className="absolute inset-0 bg-leaf/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl z-10">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                </div>

                {/* Title Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-deep-green text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-xl z-20 whitespace-nowrap">
                  {item.title}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-6 relative z-10 w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-[2px] bg-leaf/20" />
                    <span className="text-leaf font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-leaf/5 rounded-full border border-leaf/10">Technical Specs</span>
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

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 italic font-bold text-[11px] text-gray-500">
                  "{item.desc}"
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      const product = products.find(p => p.name.includes(item.title)) || {
                        id: item.link.split("=")[1] || item.title,
                        name: item.title,
                        desc: item.desc,
                        img: item.img,
                        price: "Contant",
                        originalPrice: "",
                        unit: item.title === "Broodstock" ? "fish" : "piece",
                        category: "Farming",
                        tags: [],
                        rating: 5,
                        reviews: 0,
                        badge: "",
                        badgeColor: "",
                        rawPrice: null,
                        rawPriceRange: null
                      };
                      handleOrderConfirm(product);
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 group/btn cursor-pointer"
                  >
                    Order {item.title}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
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
            From Hatchery to Harvest — <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-deep-green">We&apos;ve Got You Covered</span>
          </p>
        </motion.div>
      </section>

      {/* ===== ABOUT + VALUES ===== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image 
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden border-4 border-white  shadow-2xl">
              <Image src="/event.png" alt="Our Farm" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-leaf text-white p-7 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-black mb-0.5">3+ Yrs</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Premium Supply</p>
            </div>
          </div>
*/}
          {/* Text */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl lg:text-4xl font-black text-deep-green  mb-6 leading-tight">
              Quality, Consistency &<br />
              <span className="text-leaf">Customer Satisfaction</span>
            </h2>
            <p className="text-base text-gray-500  mb-6 leading-relaxed font-medium">
              We are a trusted catfish supplier committed to quality, consistency, and customer satisfaction. Our fish are raised under controlled conditions with proper feeding, clean water systems, and expert handling to ensure fast growth, high survival rates, and excellent taste.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: "Hygienic Bio-Security", sub: "Rigorous disease-control standards.", icon: Shield },
                { title: "Expert Support", sub: "Professional guidance for farmers.", icon: Users },
                { title: "Organic Feed Only", sub: "No hormones. No chemicals.", icon: Leaf },
                { title: "Timely Delivery", sub: "Fast, reliable nationwide logistics.", icon: Truck },
              ].map(({ title, sub, icon: Icon }) => (
                <div key={title} className="flex items-start gap-3 p-4 bg-gray-50  rounded-xl border border-gray-100 ">
                  <div className="w-9 h-9 rounded-xl bg-leaf/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-leaf" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800  text-sm mb-0.5">{title}</h4>
                    <p className="text-xs text-gray-400  font-medium">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/category" className="inline-flex items-center gap-2.5 bg-leaf hover:bg-leaf-dark text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-leaf/25 active:scale-95 tracking-wide">
              Shop Our Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRICE CATALOGUE ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="section-label mx-auto w-fit mb-4">
            <Tag className="w-3.5 h-3.5" />
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-deep-green  tracking-tight">Transparent Pricing</h2>
          <p className="text-gray-500  mt-3 text-base font-medium max-w-xl mx-auto">
            Competitive, honest pricing for all our premium catfish categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Fingerlings",
              range: "₦80 – ₦150",
              unit: "piece",
              desc: "Healthy start for commercial farming.",
              img: "/assets/bgImages/fingerlings.png",
              id: "fingerlings",
              badge: "Farming"
            },
            {
              name: "Juvenile Catfish",
              range: "₦300 – ₦700",
              unit: "piece",
              desc: "Fast growth and high feed response.",
              img: "/assets/bgImages/juveniles.png",
              id: "juveniles",
              badge: "Farming"
            },
            {
              name: "Broodstock",
              range: "₦4,000 – ₦10,000",
              unit: "fish",
              desc: "Elite genetics for professional hatcheries.",
              img: "/assets/bgImages/broodstock.png",
              id: "broodstock",
              badge: "Breeding"
            },
            {
              name: "Fresh Table-Size",
              range: "₦1,500 – ₦3,500",
              unit: "kg",
              desc: "Hygienically handled for home & retail.",
              img: "/assets/bgImages/tablesize.png",
              id: "table-size",
              badge: "Consumption"
            },
            {
              name: "Smoked Catfish",
              range: "₦4,000 – ₦8,000",
              unit: "kg",
              desc: "Premium flavor with long shelf life.",
              img: "/assets/bgImages/smoked.png",
              id: "smoked",
              badge: "Premium"
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white border border-gray-100 hover:border-amber-500/30 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden relative"
            >
              {/* Image Circle */}
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 bg-leaf/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-lg overflow-hidden">
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                {/* Badge */}
                <span className="absolute -top-1 -right-1 text-[8px] font-black uppercase tracking-widest text-white bg-deep-green px-2 py-1 rounded-full shadow-md z-20">
                  {item.badge}
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-amber-500 transition-colors">{item.name}</h3>
                <p className="text-xs font-semibold text-gray-400 mb-4 line-clamp-2">{item.desc}</p>
              </div>

              <div className="w-full pt-4 border-t border-gray-50 mt-auto">
                <div className="mb-4">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Standard Range</p>
                  <p className="text-2xl font-black text-leaf tracking-tight">
                    {item.range}
                    <span className="text-[10px] font-bold text-gray-400 ml-1">/ {item.unit}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const product = products.find(p => p.id === item.id) || {
                      id: item.id,
                      name: item.name,
                      desc: item.desc,
                      img: item.img,
                      price: "",
                      originalPrice: "",
                      unit: item.unit,
                      category: item.badge,
                      tags: [],
                      rating: 5,
                      reviews: 0,
                      badge: "",
                      badgeColor: "",
                      rawPrice: null,
                      rawPriceRange: null
                    };
                    handleOrderConfirm(product);
                  }}
                  className="w-full bg-gray-50 hover:bg-amber-500 text-gray-700 hover:text-white py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 border border-gray-100 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 group/btn"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-deep-green py-20 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(white_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-leaf/20 text-leaf border border-leaf/30 rounded-full text-xs font-black uppercase tracking-widest mb-5">Why CCB Farms</div>
            <h2 className="text-white text-3xl lg:text-4xl font-black mb-4 tracking-tight">The CCB Farms Advantage</h2>
            <p className="text-white/60 text-base max-w-xl mx-auto font-medium">
              We supply catfish you can trust — delivered with reliability and expert care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Healthy & Disease-Free", desc: "Strict bio-security controls ensure robust health and zero disease in every batch.", icon: Shield },
              { title: "Consistent Quality", desc: "Guaranteed uniform sizes and excellent feeding response across all categories.", icon: CheckCircle },
              { title: "Reliable Supply", desc: "Consistent supply and timely nationwide delivery to your farm or home.", icon: Truck },
              { title: "Competitive Pricing", desc: "Premium quality at the most competitive prices for maximum value.", icon: Tag },
              { title: "Hygienic Processing", desc: "Professional packaging for both live and smoked catfish products.", icon: Leaf },
              { title: "Expert Support", desc: "Technical guidance and professional support for maximum yield and success.", icon: Users },
            ].map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-7 rounded-2xl hover:bg-white/8 hover:border-leaf/30 transition-all"
              >
                <div className="w-12 h-12 bg-leaf/20 rounded-xl flex items-center justify-center mb-5 border border-leaf/20">
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
          <div className="section-label mx-auto w-fit mb-4">The Process</div>
          <h2 className="text-3xl md:text-4xl font-black text-deep-green  tracking-tight">Order in 4 Easy Steps</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Browse & Select", desc: "Choose from Fingerlings, Juveniles, Table-size, Smoked, or Broodstock.", icon: Search },
            { step: "02", title: "Place Your Order", desc: "Order online or WhatsApp us at 09093009400 for bulk inquiries.", icon: ShoppingCart },
            { step: "03", title: "We Prepare It", desc: "Your order is carefully packaged with hygiene and precision.", icon: Package },
            { step: "04", title: "Fast Delivery", desc: "Nationwide express delivery or farm pickup — your choice.", icon: Truck },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-[2px] bg-gradient-to-r from-leaf/20 to-transparent -z-10" />
              )}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white  border border-gray-100  p-7 rounded-2xl hover:border-leaf/30 hover:shadow-lg hover:shadow-leaf/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 bg-leaf/10 rounded-xl flex items-center justify-center group-hover:bg-leaf transition-colors">
                    <item.icon className="w-5 h-5 text-leaf group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-black text-gray-100 ">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900  mb-2">{item.title}</h3>
                <p className="text-gray-400  text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <div className="section-label mx-auto w-fit mb-4">
            <Star className="w-3.5 h-3.5 fill-current" />
            Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-deep-green  tracking-tight">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="font-black text-gray-800  text-lg">4.9 / 5</span>
            <span className="text-sm text-gray-400 font-medium">— 500+ verified buyers</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white  border border-gray-100  rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-leaf/20 transition-all"
            >
              <div className="flex items-center gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600  text-sm leading-relaxed font-medium mb-6 italic">"{t.review}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-gray-50 ">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-leaf to-deep-green flex items-center justify-center text-white text-xs font-black shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800  text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400  font-medium">{t.role}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-leaf ml-auto shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SERVING FARMERS & FAMILIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-leaf/8 to-leaf/4   rounded-3xl p-8 md:p-16 border border-leaf/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-leaf/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-deep-green  mb-8 tracking-tight">
                Serving Farmers &<br />Families Alike
              </h2>
              <div className="space-y-6">
                {[
                  { title: "For Farmers & Retailers", desc: "From small-scale farmers to large commercial operations — we supply fish that meet your exact needs.", icon: Users },
                  { title: "For Families & Restaurants", desc: "Hygienically handled catfish delivered straight to your home or kitchen for a premium dining experience.", icon: ShoppingBag },
                ].map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white  shadow-md flex items-center justify-center shrink-0 border border-gray-100 ">
                      <Icon className="w-6 h-6 text-leaf" />
                    </div>
                    <div>
                      <h4 className="font-bold text-deep-green  text-base mb-1">{title}</h4>
                      <p className="text-gray-500  text-sm leading-relaxed font-medium">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ">
              <Image src="/diary.png" alt="Happy Farmers" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY / EVENTS ===== 
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="section-label mb-3">Updates</div>
            <h2 className="text-3xl font-black text-deep-green  tracking-tight">Events & Diary</h2>
          </div>
        </div>
        <div className="relative">
          <div
            ref={galleryRef}
            className="flex gap-5 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth"
            onScroll={(e) => {
              const target = e.currentTarget;
              const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth);
              setActiveGalleryIndex(Math.round(progress * (galleryImages.length - 1)));
            }}
          >
            {galleryImages.map((item, idx) => (
              <div
                key={idx}
                id={`gallery-item-${idx}`}
                className="flex-shrink-0 w-[85vw] md:w-[440px] aspect-[4/3] rounded-2xl relative overflow-hidden group snap-start border border-gray-100  shadow-sm"
              >
                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-leaf font-bold text-xs uppercase tracking-widest">{item.type}</span>
                  <h3 className="text-lg font-black text-white mt-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          
 
          <div className="flex justify-center gap-2 mt-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to item ${i + 1}`}
                onClick={() => {
                  const item = document.getElementById(`gallery-item-${i}`);
                  if (galleryRef.current && item) {
                    galleryRef.current.scrollTo({ left: item.offsetLeft - galleryRef.current.offsetLeft, behavior: 'smooth' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-400 ${i === activeGalleryIndex ? 'bg-leaf w-8' : 'bg-gray-200  w-1.5 hover:bg-leaf/40'}`}
              />
            ))}
          </div>
        </div>
      </section>
*/}

      {/* ===== HEALTH BENEFITS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24" id="health-benefits">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-leaf/5 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-leaf/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-0" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <Image
                  src="/assets/bgImages/tablesize.png"
                  alt="Healthy Catfish"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-deep-green/40 to-transparent flex items-end p-8">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-leaf rounded-xl flex items-center justify-center text-white">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <h4 className="font-black text-deep-green tracking-tight">Superfood Choice</h4>
                    </div>
                    <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
                      High Protein • Omega-3 • Vitamin B12
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating Stat */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-amber-500 text-white p-6 rounded-3xl shadow-xl z-20 border-4 border-white hidden md:block"
              >
                <p className="text-3xl font-black mb-0.5">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-90">Nutritional Density</p>
              </motion.div>
            </motion.div>

            {/* Textual Content */}
            <div>
              <div className="section-label mb-6">
                <Heart className="w-3.5 h-3.5 fill-leaf text-leaf" />
                Health & Wellness
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-deep-green mb-8 tracking-tight leading-tight">
                The Health Benefits of<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf to-deep-green">Eating Catfish</span>
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
                    color: "text-red-500",
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
                    <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 shrink-0 ${item.bgColor} rounded-xl flex items-center justify-center shadow-inner`}>
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
        <div className="bg-deep-green rounded-3xl p-10 md:p-16 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] [background-size:200%_200%]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-leaf/20 text-leaf border border-leaf/30 rounded-full text-xs font-black uppercase tracking-widest mb-5">Stay Updated</div>
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
                className="flex-grow bg-white/10 border-2 border-white/10 focus:border-leaf rounded-xl px-5 py-3.5 outline-none font-medium text-white placeholder-white/40 text-sm transition-all"
              />
              <button
                type="submit"
                className="bg-leaf hover:bg-leaf-dark text-white px-7 py-3.5 rounded-xl font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl shadow-leaf/25 text-sm whitespace-nowrap"
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
        <div className="bg-gradient-to-br from-leaf to-leaf-dark rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
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
              <Link href="/book-order" className="bg-white text-leaf hover:bg-gray-50 px-8 py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20 text-center tracking-wide">
                Place Order Now
              </Link>
              <Link href="/contact" className="bg-white/15 hover:bg-white/25 text-white border-2 border-white/25 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 text-center tracking-wide">
                Talk to an Expert
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-10 text-white/60 font-bold text-sm">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> 09093009400</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ogun State & Lagos</span>
              <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Nationwide Delivery</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
