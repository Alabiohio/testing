"use server";

import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createContact(data: { name: string; email: string; subject: string; message: string }) {
    try {
        await db.insert(contacts).values({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        });

        revalidatePath("/contact");
        return { success: true };
    } catch (err: any) {
        console.error("Failed to save contact message:", err);
        return { success: false, error: err.message || "Failed to send your message" };
    }
}
