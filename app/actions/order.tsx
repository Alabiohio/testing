"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";

export async function createOrder(data: any) {
    try {
        const [newOrder] = await db.insert(orders).values({
            name: data.name,
            email: data.email || null,
            phone: data.phone,
            streetAddress: data.streetAddress || null,
            city: data.city || null,
            state: data.state || null,
            category: data.category || null,
            subCategory: data.subCategory || null,
            quantity: data.quantity || null,
            totalAmount: data.totalAmount || null,
            items: data.items ? JSON.stringify(data.items) : null,
            imageUrl: data.items && data.items.length > 0 ? data.items[0].imageUrl : null,
            deliveryOption: data.deliveryOption,
            country: data.country || null,
            postalCode: data.postalCode || null,
            notes: data.notes || null,
        }).returning();

        // Send confirmation email if client email is provided
        if (data.email) {
            try {
                const emailResponse = await resend.emails.send({
                    from: 'CCB Farms <order@notify.ccb.farm>',
                    to: data.email,
                    subject: 'Order Confirmation - CCB Farms',
                    react: <OrderConfirmationEmail orderData={data} />,
                });
                
                if (emailResponse.error) {
                    console.error("Resend API Error (Order):", emailResponse.error);
                } else {
                    console.log("Order confirmation email sent successfully:", emailResponse.data?.id);
                }
            } catch (emailErr) {
                console.error("Failed to send confirmation email (Exception):", emailErr);
            }
        }

        revalidatePath("/booked-order");
        return { success: true, orderId: newOrder.id };
    } catch (err: any) {
        console.error("Failed to create order:", err);
        return { success: false, error: err.message || "Failed to place your order" };
    }
}
