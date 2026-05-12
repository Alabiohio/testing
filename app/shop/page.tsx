import { Metadata } from "next";
import ShopClient from "@/components/ShopClient";
import { getMappedProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Shop Premium Catfish",
    description: "Browse our full collection of premium aquaculture products. Quality Fingerlings, Juveniles, Table-size, and Smoked Catfish for sustainable farming.",
    openGraph: {
        title: "Shop Premium Catfish | CCB Farms",
        description: "Browse our full collection of premium catfish products. Fingerlings, Juveniles, Table-size, and Smoked Catfish.",
        images: ["/ccbLg.png"],
    },
};

export default async function ShopPage() {
    const products = await getMappedProducts({ limit: 20 });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                <ShopClient products={products as any} />
            </div>
        </div>
    );
}
