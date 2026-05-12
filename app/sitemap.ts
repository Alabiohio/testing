import { MetadataRoute } from "next";
import { getUniqueCategories } from "@/lib/products";
import { toCategorySlug } from "@/lib/category-slugs";

const BASE_URL = "https://ccb.farm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/category`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/book-order`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/training`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/refund`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Dynamic category pages
    const groupedSlugs = ["farming", "consumption", "breeding"];

    let categorySlugs: string[] = [];
    try {
        const categories = await getUniqueCategories();
        categorySlugs = categories.map((cat) => toCategorySlug(cat));
    } catch {
        // Fallback if DB is unavailable during build
        categorySlugs = ["fingerlings", "juveniles", "table-size", "smoked", "broodstock"];
    }

    const allCategorySlugs = [...new Set([...categorySlugs, ...groupedSlugs])];

    const categoryPages: MetadataRoute.Sitemap = allCategorySlugs.map((slug) => ({
        url: `${BASE_URL}/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...categoryPages];
}
