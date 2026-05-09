import { db } from "@/lib/db";
import { products as productsTable, flashDeals as flashDealsTable, type Product } from "@/lib/db/schema";
import { and, eq, gte, desc, inArray } from "drizzle-orm";
import { resolveCategoryName } from "@/lib/category-slugs";
import { type ProductCardProps } from "@/components/ProductCard";

export async function getMappedProducts(category?: string): Promise<ProductCardProps[]> {
    try {
        const normalizedCategory = category?.trim().toLowerCase();
        const resolvedCategoryName = normalizedCategory
            ? resolveCategoryName(normalizedCategory, await getUniqueCategories()) || category
            : undefined;

        const dbProducts = resolvedCategoryName
            ? await db.select().from(productsTable).where(eq(productsTable.category, resolvedCategoryName)).orderBy(desc(productsTable.createdAt))
            : await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));

        // Fetch active flash deals
        const deals = await db
            .select()
            .from(flashDealsTable)
            .where(and(eq(flashDealsTable.isActive, true), gte(flashDealsTable.endTime, new Date())))
            .orderBy(desc(flashDealsTable.createdAt));

        // Map products
        return dbProducts.map((p: Product) => {
            // Find if there's an active flash deal for this product
            const productDeal = deals.find(d => d.productId === p.id);

            let displayPrice = p.price ? `₦${p.price.toLocaleString()}` : (p.price_range || "Contact for price");
            let discountedFrom = undefined;

            if (productDeal && productDeal.flashPrice) {
                discountedFrom = displayPrice;
                displayPrice = productDeal.flashPrice.startsWith('₦') ? productDeal.flashPrice : `₦${productDeal.flashPrice}`;
            }

            return {
                id: p.id,
                name: p.name,
                desc: p.description || "",
                img: p.imageUrl || null,
                price: displayPrice,
                priceRange: p.price_range || "",
                discountedFrom: discountedFrom,
                unit: p.unit,
                category: p.category,
                tags: [] as string[],
                rating: 4.9,
                reviews: 10,
                badge: productDeal ? "Flash Deal" : (p.available ? "In Stock" : "Out of Stock"),
                badgeColor: productDeal ? "bg-red-500" : (p.available ? "bg-leaf" : "bg-gray-400"),
                rawPrice: p.price ?? null,
                rawPriceRange: p.price_range ?? null,
            };
        });
    } catch (error) {
        console.error("Failed to fetch and map products:", error);
        return [];
    }
}

export async function getMappedProductsByCategoryNames(categoryNames: string[]): Promise<ProductCardProps[]> {
    try {
        const normalizedCategoryNames = Array.from(new Set(categoryNames.filter(Boolean)));

        if (normalizedCategoryNames.length === 0) {
            return [];
        }

        const dbProducts = await db
            .select()
            .from(productsTable)
            .where(inArray(productsTable.category, normalizedCategoryNames))
            .orderBy(desc(productsTable.createdAt));

        const deals = await db
            .select()
            .from(flashDealsTable)
            .where(and(eq(flashDealsTable.isActive, true), gte(flashDealsTable.endTime, new Date())))
            .orderBy(desc(flashDealsTable.createdAt));

        return dbProducts.map((p: Product) => {
            const productDeal = deals.find(d => d.productId === p.id);

            let displayPrice = p.price ? `₦${p.price.toLocaleString()}` : (p.price_range || "Contact for price");
            let discountedFrom = undefined;

            if (productDeal && productDeal.flashPrice) {
                discountedFrom = displayPrice;
                displayPrice = productDeal.flashPrice.startsWith('₦') ? productDeal.flashPrice : `₦${productDeal.flashPrice}`;
            }

            return {
                id: p.id,
                name: p.name,
                desc: p.description || "",
                img: p.imageUrl || null,
                price: displayPrice,
                priceRange: p.price_range || "",
                discountedFrom,
                unit: p.unit,
                category: p.category,
                tags: [] as string[],
                rating: 4.9,
                reviews: 10,
                badge: productDeal ? "Flash Deal" : (p.available ? "In Stock" : "Out of Stock"),
                badgeColor: productDeal ? "bg-red-500" : (p.available ? "bg-leaf" : "bg-gray-400"),
                rawPrice: p.price ?? null,
                rawPriceRange: p.price_range ?? null,
            };
        });
    } catch (error) {
        console.error("Failed to fetch mapped products for category names:", {
            categoryNames,
            error,
        });
        return [];
    }
}

export async function getUniqueCategories() {
    try {
        const allProducts = await db.select({ category: productsTable.category }).from(productsTable);
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
        return uniqueCategories.filter(Boolean);
    } catch (err) {
        console.error("Error fetching unique categories:", err);
        return [];
    }
}
