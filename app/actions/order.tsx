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
                await resend.emails.send({
                    from: 'CCB Farms <order@notify.ccb.farm>',
                    to: data.email,
                    subject: 'Order Confirmation - CCB Farms',
                    react: <OrderConfirmationEmail orderData={data} />,
                });
            } catch (emailErr) {
                console.error("Failed to send customer confirmation email:", emailErr);
            }
        }

        // Send admin notification
        try {
            await resend.emails.send({
                from: 'CCB Farms System <system@notify.ccb.farm>',
                to: 'info@ccb.farm', // Replace with actual admin email
                subject: `NEW ORDER: ${data.name} - ₦${data.totalAmount.toLocaleString()}`,
                text: `
                    New order received from ${data.name}
                    
                    Customer Details:
                    - Name: ${data.name}
                    - Phone: ${data.phone}
                    - Email: ${data.email || 'Not provided'}
                    - Delivery: ${data.deliveryOption}
                    - Location: ${data.city}, ${data.state}, ${data.country}
                    
                    Order Total: ₦${data.totalAmount.toLocaleString()}
                    
                    Notes: ${data.notes || 'None'}
                    
                    View details in the dashboard.
                `.trim().replace(/^\s+/gm, ''),
            });
        } catch (adminEmailErr) {
            console.error("Failed to send admin notification email:", adminEmailErr);
        }

        revalidatePath("/booked-order");
        return { success: true, orderId: newOrder.id };
    } catch (err: any) {
        console.error("Failed to create order:", err);
        return { success: false, error: err.message || "Failed to place your order" };
    }
}
