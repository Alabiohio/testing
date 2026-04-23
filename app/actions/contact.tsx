"use server";

import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { ContactNotificationEmail } from "@/components/emails/ContactNotificationEmail";

export async function createContact(data: { name: string; email: string; subject: string; message: string }) {
    try {
        await db.insert(contacts).values({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        });

        // Send confirmation email to the user
        try {
            const userEmailResponse = await resend.emails.send({
                from: 'CCB Farms <info@notify.ccb.farm>',
                to: data.email,
                subject: `We've received your message: ${data.subject}`,
                react: <ContactNotificationEmail name={data.name} subject={data.subject} message={data.message} />,
            });

            if (userEmailResponse.error) {
                console.error("Resend API Error (User Contact):", userEmailResponse.error);
            } else {
                console.log("User contact confirmation sent:", userEmailResponse.data?.id);
            }
        } catch (emailErr) {
            console.error("Failed to send contact confirmation email (Exception):", emailErr);
        }

        // Optional: Send internal notification to staff
        try {
            const staffEmailResponse = await resend.emails.send({
                from: 'CCB Farms System <info@ccb.farm>',
                to: 'info@ccb.farm',
                subject: `New Contact Form Submission: ${data.subject}`,
                text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`,
            });

            if (staffEmailResponse.error) {
                console.error("Resend API Error (Staff Notification):", staffEmailResponse.error);
            } else {
                console.log("Staff notification sent:", staffEmailResponse.data?.id);
            }
        } catch (staffEmailErr) {
            console.error("Failed to send staff notification email (Exception):", staffEmailErr);
        }

        revalidatePath("/contact");
        return { success: true };
    } catch (err: any) {
        console.error("Failed to save contact message:", err);
        return { success: false, error: err.message || "Failed to send your message" };
    }
}
