import { BookOpen, Award, ShieldCheck, ShoppingBag, Info, Users, Phone, MapPin } from "lucide-react";

export type SearchItem = {
    id: string;
    title: string;
    description: string;
    category: "Produce" | "Training" | "Pages" | "Information";
    href: string;
    icon?: any;
};

export const searchableItems: SearchItem[] = [
    // Produce Categories
    {
        id: "fingerlings",
        title: "Fingerlings",
        description: "Strong, healthy fingerlings with high survival rates. Size: 5-30g.",
        category: "Produce",
        href: "/fingerlings",
    },
    {
        id: "juveniles",
        title: "Juveniles",
        description: "Well-developed juveniles ready for rapid growth. Size: 50-300g.",
        category: "Produce",
        href: "/juveniles",
    },
    {
        id: "table-size",
        title: "Fresh Table-Size",
        description: "Freshly harvested, hygienically handled catfish. Weight: 0.5kg - 2kg+.",
        category: "Produce",
        href: "/table-size",
    },
    {
        id: "smoked",
        title: "Smoked Catfish",
        description: "Richly smoked catfish with long shelf life. No preservatives.",
        category: "Produce",
        href: "/smoked",
    },
    {
        id: "broodstock",
        title: "Broodstock",
        description: "High-quality broodstock for breeding. Proven genetics.",
        category: "Produce",
        href: "/broodstock",
    },


    // Training Modules
    {
        id: "training-basics",
        title: "Catfish Basics for Beginners",
        description: "Introduction to pond construction, water management, and feeding.",
        category: "Training",
        href: "/training",
    },

    {
        id: "training-management",
        title: "Sustainable Farm Management",
        description: "Strategies on organic feed production and disease prevention.",
        category: "Training",
        href: "/training",
    },

    // Pages
    {
        id: "contact",
        title: "Contact Us",
        description: "Get in touch for consultations, orders, or support.",
        category: "Pages",
        href: "/contact",
    },
    {
        id: "order",
        title: "Booked Order",
        description: "Place your order online for any of our products.",
        category: "Pages",
        href: "/book-order",
    },
];
