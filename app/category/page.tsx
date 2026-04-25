import React from "react";
import { db } from "@/lib/db";
import { priceCatalog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import CategoryClient from "@/components/CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoryListingPage() {
    let initialPriceCatalog: any[] = [];
    
    try {
        initialPriceCatalog = await db
            .select()
            .from(priceCatalog)
            .orderBy(priceCatalog.orderIndex);
    } catch (error) {
        console.error("Failed to fetch price catalog:", error);
    }

    return <CategoryClient initialPriceCatalog={initialPriceCatalog} />;
}
