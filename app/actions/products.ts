"use server";

import { getMappedProducts, getMappedProductsByCategoryNames } from "@/lib/products";
import { type ProductCardProps } from "@/components/ProductCard";

/**
 * Server Action to fetch paginated products for the Shop page.
 */
export async function fetchMoreProductsAction(offset: number, limit: number = 20) {
    try {
        const products = await getMappedProducts({ limit, offset });
        return { success: true, products };
    } catch (error) {
        console.error("Error in fetchMoreProductsAction:", error);
        return { success: false, products: [], error: "Failed to fetch products" };
    }
}

/**
 * Server Action to fetch paginated products for a specific category.
 */
export async function fetchMoreCategoryProductsAction(
    categoryNames: string[], 
    offset: number, 
    limit: number = 20
) {
    try {
        const products = await getMappedProductsByCategoryNames(categoryNames, { limit, offset });
        return { success: true, products };
    } catch (error) {
        console.error("Error in fetchMoreCategoryProductsAction:", error);
        return { success: false, products: [], error: "Failed to fetch products" };
    }
}
