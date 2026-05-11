"use server";

import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";

const SubscriberSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  consent: z.string().refine((val) => val === "on", {
    message: "You must agree to the privacy policy",
  }),
});

// Simple in-memory rate limit map (resets on server restart)
const rateLimitMap = new Map<string, number>();

export async function subscribeToNewsletter(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip) || 0;
  
  if (now - lastRequest < 60000) { // 1-minute cooldown for newsletters
    return { success: false, error: "Too many attempts. Please try again in a minute." };
  }
  rateLimitMap.set(ip, now);

  const email = formData.get("email") as string;
  const consent = formData.get("consent") as string;
  const result = SubscriberSchema.safeParse({ email, consent });

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || "Invalid email" };
  }

  try {
    // Check if already exists
    const existing = await db.select().from(subscribers).where(eq(subscribers.email, result.data.email)).limit(1);
    
    if (existing.length > 0) {
        if (!existing[0].isActive) {
            // Re-activate if they were inactive
            await db.update(subscribers)
                .set({ isActive: true, updatedAt: new Date() })
                .where(eq(subscribers.email, result.data.email));
            return { success: true, message: "Welcome back! Your subscription has been reactivated." };
        }
        return { success: true, message: "You're already subscribed! Thanks for staying with us." };
    }

    await db.insert(subscribers).values({
      email: result.data.email,
      consented: true,
    });

    return { success: true, message: "Thanks for subscribing to our newsletter!" };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again later." };
  }
}
