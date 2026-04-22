"use server";

import { db } from "@/lib/db";
import { flashDeals } from "@/lib/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export async function getActiveFlashDeal() {
  try {
    const [deal] = await db
      .select()
      .from(flashDeals)
      .where(and(eq(flashDeals.isActive, true), gte(flashDeals.endTime, new Date())))
      .orderBy(desc(flashDeals.createdAt))
      .limit(1);
    
    return deal;
  } catch (error) {
    console.error("Error fetching active flash deal:", error);
    return null;
  }
}
