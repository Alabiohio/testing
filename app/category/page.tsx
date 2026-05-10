import React, { Suspense } from "react";
import { db } from "@/lib/db";
import { priceCatalog } from "@/lib/db/schema";
import CategoryClient from "@/components/CategoryClient";
import { safeQuery } from "@/lib/db/safe-query";
import { PriceCatalogSkeleton } from "@/components/Skeletons";

export const revalidate = 60;

export default async function CategoryListingPage() {
    return (
        <Suspense fallback={<CategoryLoadingSkeleton />}>
            <CategoryContent />
        </Suspense>
    );
}

function CategoryLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="h-10 bg-gray-100 rounded w-1/4 mb-12 animate-pulse" />
                <PriceCatalogSkeleton />
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-gray-50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}

async function CategoryContent() {
    const result = await safeQuery(
        () => db
            .select()
            .from(priceCatalog)
            .orderBy(priceCatalog.orderIndex),
        { context: "category price catalog", fallbackData: [] }
    );

    return <CategoryClient initialPriceCatalog={result.data ?? []} />;
}
