"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import Image from "next/image";

export const formatPriceRange = (range: string | null) => {
  if (!range) return "";
  if (range.includes("₦") || !/[\d]/.test(range)) return range;

  // Handle ranges like "1,000 - 24,000" or single values like "1,000"
  return range.split(/(\s*[-–]\s*)/).map(part => {
    const trimmed = part.trim();
    const numericOnly = trimmed.replace(/,/g, '');
    if (/^\d+$/.test(numericOnly)) {
      return `₦${Number(numericOnly).toLocaleString()}`;
    }
    return part;
  }).join("");
};

export const SafeImage = ({ src, alt, className, width, height, fill, unoptimized }: { src: string | null | undefined, alt: string, className?: string, width?: number, height?: number, fill?: boolean, unoptimized?: boolean }) => {
  const [error, ReactSetError] = React.useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-100 ${className}`}>
        <ShoppingBag className="w-10 h-10 text-leaf/10" />
        </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      unoptimized={unoptimized}
      onError={() => ReactSetError(true)}
      sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
    />
  );
};

export interface ProductCardProps {
  id: string;
  name: string;
  desc: string;
  img: string | null;
  price: string;
  priceRange: string;
  discountedFrom?: string;
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

interface ProductCardComponentProps {
  product: ProductCardProps;
  index: number;
  onOrder: (product: ProductCardProps) => void;
  layout?: boolean;
}

const ProductCard = ({ product, index, onOrder, layout = true }: ProductCardComponentProps) => {
  return (
    <motion.div
      layout={layout}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.08 }}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 shrink-0">
        <SafeImage
          src={product.img}
          alt={product.name}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10`}>
            {product.badge}
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discountedFrom && (() => {
          const currentPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10);
          const originalPrice = parseInt(product.discountedFrom.replace(/[^\d]/g, ''), 10);
          if (!isNaN(currentPrice) && !isNaN(originalPrice) && originalPrice > 0) {
            const percent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
            if (percent > 0) {
              return (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                  -{percent}%
                </div>
              );
            }
          }
          return null;
        })()}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1 tracking-tight line-clamp-1">
            {product.name}
          </h4>
          {product.desc && (
            <p className="text-[11px] sm:text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
              {product.desc}
            </p>
          )}
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base sm:text-xl font-black text-gray-900 truncate">
                {product.price}
              </p>
              {product.discountedFrom && (
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium line-through">
                  {product.discountedFrom}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              {product.priceRange && (
                <p className="text-[11px] sm:text-[11px] text-text1 font-bold tracking-tight line-clamp-1">
                   {formatPriceRange(product.priceRange)}
                </p>
              )}
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                per {product.unit}
              </span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onOrder(product);
            }}
            className="flex items-center justify-center shrink-0 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-leaf text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-leaf/20 active:scale-95 cursor-pointer"
            title="Order Now"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5">Order</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
