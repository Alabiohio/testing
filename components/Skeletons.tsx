import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-2xl p-4 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-xl mb-4" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-6 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export function FlashDealSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-black/5 animate-pulse">
      <div className="bg-gray-200 h-16 w-full" />
      <div className="flex gap-4 p-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="shrink-0 w-[140px] md:w-[200px]">
            <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
            <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-5 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="w-full py-12 animate-pulse text-center">
      <div className="h-8 bg-gray-100 rounded-lg w-3/4 mx-auto mb-8" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/6 mx-auto" />
    </div>
  );
}

export function PartnerAdsSkeleton() {
  return (
    <div className="w-full mb-8 mt-14 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 mb-8">
         <div className="h-10 bg-gray-100 rounded w-1/4 mb-4" />
         <div className="flex gap-6">
            <div className="aspect-[3/4] bg-gray-100 rounded-xl w-[220px]" />
            <div className="aspect-video bg-gray-100 rounded-xl flex-1" />
         </div>
      </div>
    </div>
  );
}

export function PriceCatalogSkeleton() {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
           <div key={i} className="h-24 bg-gray-100 rounded-xl border border-black/5" />
        ))}
     </div>
  );
}
