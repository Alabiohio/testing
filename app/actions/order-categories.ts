"use server";

import { db } from "@/lib/db";
import { orderCategories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getOrderCategories() {
    try {
        const categories = await db.select().from(orderCategories).orderBy(asc(orderCategories.orderIndex));
        
        // Transform the array into a Record to match the existing format if needed,
        // or just return the array. The current code uses a Record.
        const categoryMap: Record<string, any> = {};
        categories.forEach(cat => {
            categoryMap[cat.slug] = {
                name: cat.name,
                unit: cat.unit,
                image: cat.image,
                options: cat.options
            };
        });
        
        return { success: true, categories: categoryMap, categoryList: categories };
    } catch (err: any) {
        console.error("Failed to fetch order categories:", err);
        return { success: false, error: err.message };
    }
}
