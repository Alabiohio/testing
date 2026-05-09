import { Metadata } from "next";
import ShopClient from "@/components/ShopClient";
import { getMappedProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Shop | CCB Farms",
    description: "Browse our full collection of premium aquaculture products, from fingerlings to smoked catfish.",
};

export default async function ShopPage() {
    const products = await getMappedProducts();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <ShopClient products={products as any} />
            </div>
        </div>
    );
}
