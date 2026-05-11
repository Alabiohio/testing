"use server";

import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { ContactNotificationEmail } from "@/components/emails/ContactNotificationEmail";

import { headers } from "next/headers";
import { z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email address").max(255),
    subject: z.string().min(2, "Subject is too short").max(200),
    message: z.string().min(10, "Message is too short").max(5000),
});

// Simple in-memory rate limit map (resets on server restart)
const rateLimitMap = new Map<string, number>();

export async function createContact(data: any) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;
    
    if (now - lastRequest < 60000) { // 1-minute cooldown
        return { success: false, error: "Too many messages. Please try again in a minute." };
    }
    rateLimitMap.set(ip, now);

    const result = ContactSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.issues?.[0]?.message || "Invalid contact data" };
    }

    const validatedData = result.data;

    try {
        await db.insert(contacts).values({
            name: validatedData.name,
            email: validatedData.email,
            subject: validatedData.subject,
            message: validatedData.message,
        });

        // Send confirmation email to the user
        try {
            await resend.emails.send({
                from: 'CCB Farms <info@notify.ccb.farm>',
                to: validatedData.email,
                subject: `We've received your message: ${validatedData.subject}`,
                react: <ContactNotificationEmail name={validatedData.name} subject={validatedData.subject} message={validatedData.message} />,
            });
        } catch (emailErr) {
            console.error("Failed to send contact confirmation email:", emailErr);
        }

        // Send internal notification to staff
        try {
            await resend.emails.send({
                from: 'CCB Farms System <info@ccb.farm>',
                to: 'info@ccb.farm',
                subject: `New Contact Form Submission: ${validatedData.subject}`,
                text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nSubject: ${validatedData.subject}\nMessage: ${validatedData.message}`,
            });
        } catch (staffEmailErr) {
            console.error("Failed to send staff notification email:", staffEmailErr);
        }

        revalidatePath("/contact");
        return { success: true };
    } catch (err: any) {
        console.error("Failed to save contact message:", err);
        return { success: false, error: "Failed to send your message. Please try again later." };
    }
}
