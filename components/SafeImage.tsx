"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  unoptimized?: boolean;
}

export default function SafeImage({ src, alt, className, width, height, fill, unoptimized }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-100 ${className}`}>
        <ShoppingBag className="w-8 h-8 text-leaf/20" />
        <span className="text-[10px] font-black uppercase tracking-widest text-leaf/20 mt-2">No Image</span>
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
      unoptimized={unoptimized || (typeof src === 'string' && src.startsWith('/'))}
      className={className}
      onError={() => setError(true)}
    />
  );
}
