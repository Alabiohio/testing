'use server';

import { db } from "@/lib/db";
import { priceCatalog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getPriceCatalog() {
  try {
    const data = await db
      .select()
      .from(priceCatalog)
      .orderBy(desc(priceCatalog.createdAt));
    
    return data;
  } catch (error) {
    console.error("Error fetching price catalog:", error);
    return [];
  }
}
