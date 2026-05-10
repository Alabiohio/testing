import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CategoryProductClient from "@/components/CategoryProductClient";
import { getMappedProductsByCategoryNames, getUniqueCategories } from "@/lib/products";
import { getCategoryDisplayName, resolveCategoryName, toCategorySlug } from "@/lib/category-slugs";

export const dynamic = "force-dynamic";

const groupedCategorySlugs: Record<string, string[]> = {
    farming: ["fingerlings", "juveniles"],
    consumption: ["table-size", "smoked"],
    breeding: ["broodstock"],
};

function resolveSlugTargets(slug: string, categoryNames: string[]) {
    const groupedSlugs = groupedCategorySlugs[slug];

    if (groupedSlugs) {
        const resolvedNames = categoryNames.filter((categoryName) => groupedSlugs.includes(toCategorySlug(categoryName)));
        return {
            displayTitle: getCategoryDisplayName(slug),
            resolvedCategoryNames: resolvedNames,
            source: "group",
        };
    }

    const resolvedCategoryName = resolveCategoryName(slug, categoryNames);
    return {
        displayTitle: resolvedCategoryName || getCategoryDisplayName(slug),
        resolvedCategoryNames: resolvedCategoryName ? [resolvedCategoryName] : [],
        source: "single",
    };
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
    const { categorySlug } = await params;
    const slug = categorySlug.toLowerCase();
    const title = getCategoryDisplayName(slug);

    return {
        title: `${title} | CCB Farms`,
        description: `Premium quality ${title.toLowerCase()} from CCB Farms. Health-guaranteed and high-yield strains available for order.`,
    };
}

export default async function CategoryProductPage({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    const slug = categorySlug.toLowerCase();
    const categories = await getUniqueCategories();
    const { displayTitle, resolvedCategoryNames, source } = resolveSlugTargets(slug, categories);

    console.info("[category-route] request", {
        slug,
        source,
        availableCategories: categories,
        resolvedCategoryNames,
    });

    if (resolvedCategoryNames.length === 0) {
        console.warn("[category-route] no matching categories", { slug, availableCategories: categories });

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f4f5f1]">
                <div className="bg-white p-12 rounded-xl shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] border border-black/6 text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-deep-green mb-4">Category Not Found</h1>
                    <p className="text-gray-500 mb-8 italic">Sorry, the category &quot;{slug}&quot; doesn&apos;t exist or has been moved.</p>
                    <Link href="/category" className="inline-flex items-center gap-2 bg-deep-green hover:bg-[#0f2f21] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Categories
                    </Link>
                </div>
            </div>
        );
    }

    const products = await getMappedProductsByCategoryNames(resolvedCategoryNames, { limit: 20 });

    console.info("[category-route] products loaded", {
        slug,
        resolvedCategoryNames,
        productCount: products.length,
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                    <Link href="/" className="hover:text-deep-green transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/category" className="hover:text-deep-green transition-colors">Categories</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-deep-green">{displayTitle}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-black text-deep-green tracking-tighter leading-none mb-4">
                            {displayTitle}
                        </h1>
                        <p className="text-md text-gray-500 max-w-xl font-medium leading-relaxed">
                            Discover our top-tier {displayTitle.toLowerCase()} collection. {slug === "fingerlings" || slug === "juveniles" || slug === "farming" ? "Health-guaranteed, fast-growing strains optimized for high survival rates." : "Hygienically handled and processed for maximum quality."}
                        </p>
                    </div>
                </div>

                <CategoryProductClient 
                    products={products} 
                    displayTitle={displayTitle} 
                    categoryNames={resolvedCategoryNames} 
                />
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const categories = await getUniqueCategories();
    const productCategoryParams = categories.map((cat) => ({
        categorySlug: toCategorySlug(cat),
    }));

    return [
        ...productCategoryParams,
        { categorySlug: "farming" },
        { categorySlug: "consumption" },
        { categorySlug: "breeding" },
    ];
}
