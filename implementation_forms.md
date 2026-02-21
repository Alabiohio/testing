# CCB Farms - Form Implementation Guide
**Topic:** Handling Contact and Booked-Order Forms
**Date:** February 21, 2026

---

## 1. Introduction
This document outlines the current structure and the recommended implementation path for the two primary data-entry points on the CCB Farms website: the **Contact Form** and the **Booked Order Form**.

---

## 2. Current State Analysis

### 2.1. Contact Form (`/app/contact/page.tsx`)
- **Type:** Client-side React form.
- **State Management:** Local component state (planned for integration).
- **Validation:** Basic HTML5 `required` attributes.
- **Behavior:** Currently triggers a generic browser `alert("Message Sent!")`.

### 2.2. Booked Order Form (`/app/booked-order/page.tsx`)
- **Type:** Complex dynamic client-side form.
- **State Management:** Controlled inputs using `useState`.
- **Dynamic Logic:** 
  - Sub-categories update based on the main category selection.
  - Units (pieces, kg, fish) switch contextually based on the product.
  - Pre-selection supported via `?cat=category-id` URL parameters.
- **Behavior:** Currently triggers `alert("Thank you! Your order has been placed successfully...")`.

---

## 3. Recommended Implementation Strategy

To transition from mock submissions to a production-ready system, we recommend using **Next.js Server Actions** or a dedicated **API Route**.

### 3.1. Handling Submissions via Server Actions
Server Actions are the most efficient way to handle form data in Next.js 14+.

#### Step 1: Create an Action File (`app/actions.ts`)
```typescript
'use server'

export async function submitOrder(formData: FormData) {
    const rawFormData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        category: formData.get('category'),
        // ... capture other fields
    }

    // Process logic:
    // 1. Save to Database (e.g., Supabase)
    // 2. Send email notification (e.g., via Resend)
    // 3. Send WhatsApp notification
}
```

#### Step 2: Integrate into Components
Update the `handleSubmit` functions to call these server actions.

### 3.2. Data Storage (Supabase)
For a premium experience, orders should be logged in a database:
- **Table: `orders`** (id, customer_name, phone, product, quantity, delivery_type, status)
- **Table: `inquiries`** (id, name, email, subject, message, created_at)

---

## 4. Specific Form Logic Breakdown

### 4.1. Booked-Order Form Enhancements
- **Pricing Integration:** Currently, the form shows "Prices may vary". In Phase 4, the implementation should pull real-time prices from a `products` table.
- **Delivery Calculation:** Logic should be added to identify if the `state` is Lagos or Ogun to suggest specific pickup points.

### 4.2. Contact Form Enhancements
- **Auto-Responder:** Implement a "Thank you" email that automatically sends to the customer upon submission.
- **Subject Routing:** Different subjects (e.g., "Training") could be routed to specific email addresses or WhatsApp numbers.

---

## 5. Security & Validation
- **Rate Limiting:** Implement a honeypot field or use a library like `arcjet` to prevent spam submissions.
- **Schema Validation:** Use `Zod` to validate the complex `formData` object in the Booked-Order page before processing.

---

## 6. Summary of Next Steps
1.  **Define Schema:** Finalize the SQL schema for orders and inquiries.
2.  **Environment Setup:** Add `RESEND_API_KEY` and `DATABASE_URL` to `.env`.
3.  **Refactor Forms:** Replace `alert()` with `useFormStatus` and `useFormState` for a refined loading/success UI.
