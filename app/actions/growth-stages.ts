"use server";

import { db } from "@/lib/db";
import { growthStages } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getGrowthStages() {
  try {
    const data = await db.select().from(growthStages).orderBy(asc(growthStages.orderIndex));
    return data;
  } catch (error) {
    console.error("Error fetching growth stages:", error);
    return [];
  }
}
