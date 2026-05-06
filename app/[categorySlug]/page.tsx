import { db } from "@/lib/db";
import { products as productsTable, type Product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import { Metadata } from "next";
import CategoryProductClient from "@/components/CategoryProductClient";

// Use a force-dynamic to ensure fresh data from DB
export const dynamic = 'force-dynamic';

const titleMap: Record<string, string> = {
    "fingerlings": "Fingerlings",
    "juveniles": "Juveniles",
    "table-size": "Fresh Table-Size",
    "smoked": "Smoked Catfish",
    "broodstock": "Broodstock"
};

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
    const { categorySlug } = await params;
    const slug = categorySlug.toLowerCase();
    const title = titleMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");
    
    return {
        title: `${title} | CCB Farms`,
        description: `Premium quality ${title.toLowerCase()} from CCB Farms. Health-guaranteed and high-yield strains available for order.`,
    };
}

export default async function CategoryProductPage({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    const slug = categorySlug.toLowerCase();
    
    // Valid categories to prevent matching random strings
    const validCategories = ["fingerlings", "juveniles", "table-size", "smoked", "broodstock"];
    
    if (!validCategories.includes(slug)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f4f5f1]">
                <div className="bg-white p-12 rounded-md shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-deep-green mb-4">Category Not Found</h1>
                    <p className="text-gray-500 mb-8 italic">Sorry, the category "{slug}" doesn't exist or has been moved.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-4 rounded-md font-bold transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    let products: Product[] = [];
    try {
        products = await db.select().from(productsTable).where(eq(productsTable.category, slug));
    } catch (error) {
        console.error("DB error:", error);
    }

    const displayTitle = titleMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                    <Link href="/" className="hover:text-deep-green transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/shop" className="hover:text-deep-green transition-colors">Shop</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-deep-green">{displayTitle}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-black text-deep-green tracking-tighter leading-none mb-4">
                           {displayTitle}
                        </h1>
                        <p className="text-md text-gray-500 max-w-xl font-medium leading-relaxed">
                            Discover our top-tier {displayTitle.toLowerCase()} collection. {slug === 'fingerlings' || slug === 'juveniles' ? 'Health-guaranteed, fast-growing strains optimized for high survival rates.' : 'Hygienically handled and processed for maximum quality.'}
                        </p>
                    </div>
                </div>

                <CategoryProductClient 
                    products={products} 
                    displayTitle={displayTitle} 
                />
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    return [
        { categorySlug: "fingerlings" },
        { categorySlug: "juveniles" },
        { categorySlug: "table-size" },
        { categorySlug: "smoked" },
        { categorySlug: "broodstock" },
    ];
}
