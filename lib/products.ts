import { db } from "@/lib/db";
import { products as productsTable, flashDeals as flashDealsTable, type Product } from "@/lib/db/schema";
import { and, eq, gte, desc, inArray } from "drizzle-orm";
import { resolveCategoryName } from "@/lib/category-slugs";
import { type ProductCardProps } from "@/components/ProductCard";
import { safeQuery } from "@/lib/db/safe-query";

// Helper to format price with Naira symbol
function formatNaira(amount: number | null): string {
    if (amount === null || amount === undefined) return "Contact";
    return `₦${amount.toLocaleString()}`;
}

// Helper to map DB product to Card Props
function mapProductToCard(p: Product, deals: any[]): ProductCardProps {
    const deal = deals.find(d => d.productId === p.id);
    const displayPrice = deal 
        ? (deal.flashPrice ? formatNaira(deal.flashPrice) : formatNaira(p.price))
        : formatNaira(p.price);

    return {
        id: p.id,
        name: p.name,
        category: p.category,
        img: p.imageUrl || "/fish-bg.jpg",
        price: displayPrice,
        priceRange: p.price_range || "",
        rawPrice: p.price || 0,
        rawPriceRange: p.price_range || null,
        unit: p.unit,
        badge: !p.available ? "Sold Out" : deal ? deal.discount || "Flash Sale" : "",
        badgeColor: !p.available ? "bg-gray-500" : deal ? "bg-red-500" : "bg-leaf",
        rating: 5,
        reviews: 0,
        tags: [],
        desc: p.description || ""
    };
}

async function getActiveDeals() {
    const dealsResult = await safeQuery(() => 
        db.select().from(flashDealsTable).where(and(eq(flashDealsTable.isActive, true), gte(flashDealsTable.endTime, new Date())))
    );
    return dealsResult.data ?? [];
}

/**
 * Fetches products from the database with support for category filtering,
 * pagination (limit/offset), and graceful error handling via safeQuery.
 */
export async function getMappedProducts(options?: { 
    category?: string; 
    limit?: number; 
    offset?: number;
}): Promise<ProductCardProps[]> {
    const { category, limit = 100, offset = 0 } = options || {};
    
    // Resolve display category name to DB category name if slug is passed
    const resolvedCategoryName = category ? resolveCategoryName(category, await getUniqueCategories()) : null;

    const productsResult = resolvedCategoryName
        ? await safeQuery(() => 
            db.select()
              .from(productsTable)
              .where(eq(productsTable.category, resolvedCategoryName))
              .orderBy(desc(productsTable.createdAt))
              .limit(limit)
              .offset(offset)
          )
        : await safeQuery(() => 
            db.select()
              .from(productsTable)
              .orderBy(desc(productsTable.createdAt))
              .limit(limit)
              .offset(offset)
          );

    const dbProducts = productsResult.data ?? [];
    if (dbProducts.length === 0) return [];

    const deals = await getActiveDeals();
    return dbProducts.map((p: Product) => mapProductToCard(p, deals));
}

/**
 * Fetches products matching any of the provided category names.
 * Supports pagination and returns props ready for ProductCard components.
 */
export async function getMappedProductsByCategoryNames(
    categoryNames: string[], 
    options?: { limit?: number; offset?: number }
): Promise<ProductCardProps[]> {
    if (categoryNames.length === 0) return [];
    
    const { limit = 100, offset = 0 } = options || {};

    const productsResult = await safeQuery(() => 
        db.select()
          .from(productsTable)
          .where(inArray(productsTable.category, categoryNames))
          .orderBy(desc(productsTable.createdAt))
          .limit(limit)
          .offset(offset)
    );

    const dbProducts = productsResult.data ?? [];
    if (dbProducts.length === 0) return [];

    const deals = await getActiveDeals();
    return dbProducts.map((p: Product) => mapProductToCard(p, deals));
}

/**
 * Returns a list of all unique category names present in the products table.
 */
export async function getUniqueCategories(): Promise<string[]> {
    const categoriesResult = await safeQuery(() => 
        db.select({ category: productsTable.category }).from(productsTable)
    );
    const rows = categoriesResult.data ?? [];
    return Array.from(new Set(rows.map(r => r.category)));
}
