"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
    try {
        await db.insert(orders).values({
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
            deliveryOption: data.deliveryOption,
            notes: data.notes || null,
        });

        revalidatePath("/booked-order");
        return { success: true };
    } catch (err: any) {
        console.error("Failed to create order:", err);
        return { success: false, error: err.message || "Failed to place your order" };
    }
}
