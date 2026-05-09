"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  unoptimized?: boolean;
  sizes?: string;
}

export default function SafeImage({ src, alt, className, width, height, fill, unoptimized, sizes }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-100 ${className}`}>
        <ShoppingBag className="w-10 h-10 text-leaf/10" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-leaf/20 mt-4">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
      unoptimized={unoptimized || (typeof src === 'string' && src.startsWith('/'))}
      className={className}
      onError={() => setError(true)}
    />
  );
}
