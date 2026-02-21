# CCB Farms - Database Implementation Guide
**Topic:** Supabase Schema & Integration for Orders and Inquiries
**Date:** February 21, 2026

---

## 1. Chosen Technology: Supabase
For the current Next.js stack, **Supabase** is the recommended database solution. It provides a PostgreSQL database, built-in Authentication, and easy-to-use Client SDKs that work seamlessly with Server Actions.

---

## 2. Database Schema (PostgreSQL)

### 2.1. `orders` Table
Stores all product orders from the `/booked-order` page.

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Product Details
  category TEXT NOT NULL, -- e.g., 'fingerlings', 'smoked'
  sub_category TEXT,       -- e.g., 'Medium Fingerlings (10–20g)'
  quantity TEXT NOT NULL,  -- e.g., '1000 pieces'
  
  -- Delivery Details
  delivery_option TEXT NOT NULL, -- 'Pickup', 'Home Delivery', etc.
  street_address TEXT,
  city TEXT,
  state TEXT DEFAULT 'Lagos',
  
  -- Metadata
  notes TEXT,
  status TEXT DEFAULT 'pending' -- 'pending', 'confirmed', 'delivered', 'cancelled'
);
```

### 2.2. `inquiries` Table
Stores contact messages from the `/contact` page.

```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL, -- 'Product Inquiry', 'Training', etc.
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false
);
```

### 2.3. `products` Table (Optional - for Dynamic Pricing)
If you decide to manage pricing via the database instead of hardcoded objects.

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL, -- 'pieces', 'kg'
  base_price_min DECIMAL,
  base_price_max DECIMAL,
  is_available BOOLEAN DEFAULT true
);
```

---

## 3. Implementation Steps

### Step 1: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 2: Initialize Client (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Server Action Integration (`app/actions.ts`)
Example for the Booked-Order form:

```typescript
'use server'
import { supabase } from '@/lib/supabase';

export async function submitOrderAction(formData: any) {
    const { data, error } = await supabase
        .from('orders')
        .insert([
            {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: formData.email,
                category: formData.category,
                sub_category: formData.subCategory,
                quantity: formData.quantity,
                delivery_option: formData.deliveryOption,
                street_address: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                notes: formData.notes
            }
        ]);

    if (error) throw new Error(error.message);
    return data;
}
```

---

## 4. Security & Roles
1.  **Row Level Security (RLS):** 
    - Enable RLS on both tables.
    - Setup a policy to allow `anon` roles to **INSERT** only (so public users can submit forms).
    - Setup a policy to allow `authenticated` roles (Admin) to **SELECT/UPDATE** (so you can view/manage orders in a dashboard later).

## 5. Summary of Benefits
*   **Persistent Storage:** No more relying on simple alerts; every order is logged.
*   **Scale Ready:** Easily add an Admin Dashboard in Phase 4 to manage order statuses.
*   **Reliability:** PostgreSQL is robust and handles complex relationships (like linking users to orders) if needed in the future.
