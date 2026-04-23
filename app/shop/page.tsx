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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-7xl font-black text-deep-green tracking-tighter leading-none mb-6">
                           CCB <span className="text-leaf">Shop</span>
                        </h1>
                    </div>
                </div>

                <ShopClient products={products} />
            </div>
        </div>
    );
}
