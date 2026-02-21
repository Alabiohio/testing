# CCB Farms - Project Documentation
**Date: February 21, 2026**

---

## 1. Project Overview
**CCB Farms** is a premium, responsive web application designed for a catfish farming and sales business. It serves as a digital storefront and resource hub for both fish farmers (B2B) and individual consumers (B2C).

The primary goal of the site is to streamline the ordering process for high-quality catfish at various growth stages and to provide training resources for aspiring farmers.

---

## 2. Technical Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS & Tailwind CSS (version 4)
- **Animations:** Framer Motion (for premium micro-interactions)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Language:** TypeScript

---

## 3. Site Structure & Features

### 3.1. Navigation
The site features a responsive, premium Navbar with:
- Desktop: Hover effects and active link indicators.
- Mobile: A sliding menu with glassmorphism and smooth animations.
- Theme Toggle: Support for Light and Dark modes.

### 3.2. Home Page (/)
- **Hero Section:** High-impact call to action with a focus on quality and reliability.
- **About Us:** Introduction to the brand's commitment to excellence.
- **Categories Preview:** Visual summary of available products.
- **How It Works:** A 4-step guide (Choose -> Order -> Process -> Deliver).
- **Why Choose Us:** Highlights (Healthy fish, affordable pricing, expert support).

### 3.3. Category Page (/category)
A catalog of catfish products categorized by growth stage and use:
- **Fingerlings & Juveniles:** For farmers starting or restocking ponds.
- **Fresh Table-Size Catfish:** For consumption and retail.
- **Smoked Catfish:** Processed fish for long shelf life.
- **Broodstock:** High-fertility fish for breeding.

### 3.4. Booked Order (/booked-order)
A comprehensive dynamic order form that includes:
- **Category Selection:** Users can select specific sizes and quantities.
- **Dynamic Pricing Display:** Contextual information about price ranges.
- **Delivery Options:** Pickup, Home Delivery, or Farm-to-Farm transfer.
- **Customer Information:** Secure form capturing contact details.
- **Validation:** Handles state updates and prevents infinite loops (recently optimized).

### 3.5. Training Page (/training)
A dedicated space for educational content, providing guidance on catfish farming best practices and technical support for new farmers.

### 3.6. Contact Us (/contact)
Multiple contact channels including:
- Integrated WhatsApp and Phone links.
- Physical location details (Ogun and Lagos).
- Contact form for inquiries.

---

## 4. Design & Branding
- **Color Palette:** Curated shades of leaf green, deep green, reddish brown, and charcoal black.
- **Aesthetics:** Focus on "Rich Aesthetics" with:
  - Glassmorphism effects in menus.
  - Smooth transitions between pages and sections.
  - Responsive layouts tailored for all screen sizes.
- **Typography:** Modern, clean sans-serif fonts for readability.

---

## 5. SEO & Social Media
The application is fully optimized for search engines and social sharing:
- **Meta Tags:** Each page has customized `title` and `description` tags.
- **Open Graph (OG):** Configured for Facebook, Twitter (X), and LinkedIn with preview images.
- **Semantic HTML:** Proper use of heading tags and interactive elements.

---

## 6. Current Status & Achievements
✅ **UI/UX:** Premium design implemented and verified across all pages.
✅ **Performance:** Optimized pages and main app components for speed.
✅ **SEO:** Global and route-specific metadata configured.

