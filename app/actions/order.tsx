"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import { headers } from "next/headers";

import { z } from "zod";

type RawOrderItem = {
    id?: string;
    name?: string | null;
    price?: number | null;
    quantity?: string | number | null;
    unit?: string | null;
    imageUrl?: string | null;
    categoryId?: string;
    subCategory?: string | null;
};

type RawOrderPayload = {
    category?: string | null;
    subCategory?: string | null;
    quantity?: string | number | null;
    totalAmount?: number | string | null;
    items?: RawOrderItem[] | null;
} & Record<string, unknown>;

const CheckoutOrderItemSchema = z.object({
    id: z.string().max(50),
    name: z.string().max(100),
    price: z.number().nonnegative().nullable().optional(),
    quantity: z.number().int().positive(),
    unit: z.string().max(20).optional().nullable(),
    imageUrl: z.string().url().max(500).optional().nullable(),
});

const CustomOrderItemSchema = z.object({
    categoryId: z.string().max(50),
    subCategory: z.string().max(100).optional().nullable(),
    quantity: z.union([
        z.string().min(1).max(50),
        z.number().positive().transform((value) => value.toString()),
    ]),
    name: z.string().max(100).optional().nullable(),
    price: z.number().nonnegative().nullable().optional(),
    unit: z.string().max(20).optional().nullable(),
    imageUrl: z.string().url().max(500).optional().nullable(),
});

const OrderItemSchema = z.union([CheckoutOrderItemSchema, CustomOrderItemSchema]);

const OrderSchema = z.object({
    name: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
    phone: z.string().min(7, "Phone number is too short").max(20),
    streetAddress: z.string().max(255).optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    country: z.string().max(100).optional().nullable(),
    postalCode: z.string().max(20).optional().nullable().or(z.literal("")),
    category: z.string().max(100).optional().nullable(),
    subCategory: z.string().max(100).optional().nullable(),
    quantity: z.string().optional().nullable().or(z.number().transform(n => n.toString())),
    totalAmount: z.preprocess((value) => {
        if (value === undefined || value === null || value === "") {
            return 0;
        }

        if (typeof value === "string") {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : value;
        }

        return value;
    }, z.number().nonnegative()),
    items: z.array(OrderItemSchema).optional().nullable(),
    deliveryOption: z.string().max(50),
    notes: z.string().max(1000).optional().nullable(),
});

function clampText(value: string | null | undefined, max: number) {
    if (!value) {
        return null;
    }

    return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function normalizeOrderPayload(data: unknown) {
    const payload = (data && typeof data === "object")
        ? (data as RawOrderPayload)
        : {};
    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    const fallbackCategory = rawItems
        .map((item) => item.name || item.categoryId)
        .filter(Boolean)
        .join(", ");
    const fallbackSubCategory = rawItems
        .map((item) => item.subCategory)
        .filter(Boolean)
        .join(", ");
    const fallbackQuantity = rawItems
        .map((item) => {
            const quantity = item.quantity;
            const unit = item.unit || "";
            const subCategory = item.subCategory ? ` (${item.subCategory})` : "";

            if (quantity === undefined || quantity === null || quantity === "") {
                return null;
            }

            return `${quantity}${unit}${subCategory}`;
        })
        .filter(Boolean)
        .join("; ");
    const derivedTotalAmount = rawItems.reduce((sum: number, item) => {
        if (typeof item.price !== "number") {
            return sum;
        }

        const quantity = typeof item.quantity === "number"
            ? item.quantity
            : Number(item.quantity);

        return sum + item.price * (Number.isFinite(quantity) ? quantity : 0);
    }, 0);

    return {
        ...payload,
        items: rawItems,
        category: payload.category || fallbackCategory || null,
        subCategory: payload.subCategory || fallbackSubCategory || null,
        quantity: payload.quantity || fallbackQuantity || null,
        totalAmount: payload.totalAmount ?? derivedTotalAmount,
    };
}

// Simple in-memory rate limit map (resets on server restart)
const rateLimitMap = new Map<string, number>();

export async function createOrder(data: unknown) {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;
    
    if (now - lastRequest < 10000) { // 10s cooldown
        return { success: false, error: "Too many requests. Please wait a moment." };
    }
    rateLimitMap.set(ip, now);

    // Standard Validation Approach
    const normalizedData = normalizeOrderPayload(data);
    const result = OrderSchema.safeParse(normalizedData);
    
    if (!result.success) {
        // Safe access to error message
        const errorMessage = result.error.issues?.[0]?.message || "Invalid order data";
        return { success: false, error: errorMessage };
    }

    const validatedData = result.data;

    try {
        const [newOrder] = await db.insert(orders).values({
            name: validatedData.name,
            email: validatedData.email || null,
            phone: validatedData.phone,
            streetAddress: validatedData.streetAddress || null,
            city: validatedData.city || null,
            state: validatedData.state || null,
            category: clampText(validatedData.category, 100),
            subCategory: clampText(validatedData.subCategory, 100),
            quantity: clampText(validatedData.quantity, 100),
            totalAmount: validatedData.totalAmount,
            items: validatedData.items ? JSON.stringify(validatedData.items) : null,
            imageUrl: validatedData.items && validatedData.items.length > 0 ? validatedData.items[0].imageUrl : null,
            deliveryOption: validatedData.deliveryOption,
            country: validatedData.country || null,
            postalCode: validatedData.postalCode || null,
            notes: validatedData.notes || null,
        }).returning();

        // Send confirmation email if client email is provided
        if (validatedData.email) {
            try {
                await resend.emails.send({
                    from: 'CCB Farms <order@notify.ccb.farm>',
                    to: validatedData.email,
                    subject: 'Order Confirmation - CCB Farms',
                    react: <OrderConfirmationEmail orderData={validatedData} />,
                });
            } catch (emailErr) {
                console.error("Failed to send customer confirmation email:", emailErr);
            }
        }

        // Send admin notification
        try {
            await resend.emails.send({
                from: 'CCB Farms System <system@notify.ccb.farm>',
                to: 'info@ccb.farm',
                subject: `NEW ORDER: ${validatedData.name} - ₦${validatedData.totalAmount.toLocaleString()}`,
                text: `
                    New order received from ${validatedData.name}
                    
                    Customer Details:
                    - Name: ${validatedData.name}
                    - Phone: ${validatedData.phone}
                    - Email: ${validatedData.email || 'Not provided'}
                    - Delivery: ${validatedData.deliveryOption}
                    - Location: ${validatedData.city}, ${validatedData.state}, ${validatedData.country}
                    
                    Order Total: ₦${validatedData.totalAmount.toLocaleString()}
                    
                    Notes: ${validatedData.notes || 'None'}
                    
                    View details in the dashboard.
                `.trim().replace(/^\s+/gm, ''),
            });
        } catch (adminEmailErr) {
            console.error("Failed to send admin notification email:", adminEmailErr);
        }

        revalidatePath("/booked-order");
        return { success: true, orderId: newOrder.id };
    } catch (err: unknown) {
        console.error("Failed to create order:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to place your order";
        return { success: false, error: errorMessage };
    }
}
