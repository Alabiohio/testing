import { db } from "@/lib/db";
import { products as productsTable, type Product } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import ShopClient from "@/components/ShopClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Shop | CCB Farms",
    description: "Browse our full collection of premium aquaculture products, from fingerlings to smoked catfish.",
};

export default async function ShopPage() {
    let products: Product[] = [];
    try {
        products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
    } catch (error) {
        console.error("DB error:", error);
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <ShopClient products={products} />
            </div>
        </div>
    );
}
