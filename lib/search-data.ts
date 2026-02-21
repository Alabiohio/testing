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
        href: "/category#fingerlings",
    },
    {
        id: "juveniles",
        title: "Juveniles",
        description: "Well-developed juveniles ready for rapid growth. Size: 50-300g.",
        category: "Produce",
        href: "/category#juveniles",
    },
    {
        id: "table-size",
        title: "Fresh Table-Size",
        description: "Freshly harvested, hygienically handled catfish. Weight: 0.5kg - 2kg+.",
        category: "Produce",
        href: "/category#table-size",
    },
    {
        id: "smoked",
        title: "Smoked Catfish",
        description: "Richly smoked catfish with long shelf life. No preservatives.",
        category: "Produce",
        href: "/category#smoked",
    },
    {
        id: "broodstock",
        title: "Broodstock",
        description: "High-quality broodstock for breeding. Proven genetics.",
        category: "Produce",
        href: "/category#broodstock",
    },
    {
        id: "hatchery",
        title: "Hatchery Services",
        description: "Professional hatchery services for scalable farm expansion.",
        category: "Produce",
        href: "/category#hatchery",
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
        id: "training-hatchery",
        title: "Advanced Hatchery Operations",
        description: "Master induced breeding, egg incubation, and fingerling management.",
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
        href: "/booked-order",
    },
];
