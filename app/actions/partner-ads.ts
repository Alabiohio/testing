"use server";

import { db } from "@/lib/db";
import { partnerAds } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getActivePartnerAds() {
  try {
    return await db
      .select()
      .from(partnerAds)
      .where(eq(partnerAds.isActive, true))
      .orderBy(desc(partnerAds.createdAt));
  } catch (err) {
    console.error("Error fetching partner ads:", err);
    return [];
  }
}
