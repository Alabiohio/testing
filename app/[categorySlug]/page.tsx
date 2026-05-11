import { redirect, notFound } from "next/navigation";
import { getUniqueCategories } from "@/lib/products";
import { resolveCategoryName, toCategorySlug } from "@/lib/category-slugs";

const groupedCategorySlugs: Record<string, string[]> = {
    farming: ["fingerlings", "juveniles"],
    consumption: ["table-size", "smoked"],
    breeding: ["broodstock"],
};

export default async function LegacyCategoryRedirect({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    const slug = categorySlug.toLowerCase();

    // Check if it's a grouped slug
    if (groupedCategorySlugs[slug]) {
        redirect(`/category/${slug}`);
    }

    // Check if it's a single category slug
    const categories = await getUniqueCategories();
    const resolvedCategoryName = resolveCategoryName(slug, categories);

    if (resolvedCategoryName) {
        redirect(`/category/${slug}`);
    }

    // If not a category or group, return 404
    notFound();
}
