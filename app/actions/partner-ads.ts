"use server";

import { db } from "@/lib/db";
import { partnerAds } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { safeQuery } from "@/lib/db/safe-query";

export async function getActivePartnerAds() {
  const result = await safeQuery(
    () => db
      .select()
      .from(partnerAds)
      .where(eq(partnerAds.isActive, true))
      .orderBy(desc(partnerAds.createdAt)),
    { context: "partner ads", fallbackData: [] }
  );

  return result.data ?? [];
}
