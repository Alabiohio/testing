'use server';

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getTestimonials() {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.createdAt));
    
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: "Failed to fetch testimonials" };
  }
}
