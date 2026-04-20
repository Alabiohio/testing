import HomeClient from "@/components/HomeClient";
import { db } from "@/lib/db";
import { products as productsTable, type Product } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let dbProducts: Product[] = [];
  try {
    dbProducts = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
  } catch (error) {
    console.error("Failed to fetch products from database:", error);
  }

  // Map DB products to the format expected by HomeClient
  // If DB is empty, we can provide some defaults or the static ones
  const mappedProducts = dbProducts.length > 0 ? dbProducts.map((p: Product) => ({
    id: p.id,
    name: p.name,
    desc: p.description || "",
    img: p.imageUrl || "/assets/bgImages/fingerlings.png", // fallback
    price: p.price ? `₦${p.price.toLocaleString()}` : (p.price_range || "Contact for price"),
    originalPrice: p.price_range || "",
    unit: p.unit,
    category: p.category,
    tags: [] as string[],
    rating: 4.9, // Default rating
    reviews: 10, // Default reviews
    badge: p.available ? "In Stock" : "Out of Stock",
    badgeColor: p.available ? "bg-leaf" : "bg-gray-400",
    rawPrice: p.price ?? null,
    rawPriceRange: p.price_range ?? null,
  })) : [
    {
      id: "fingerlings",
      name: "Fingerlings",
      desc: "Strong, healthy fingerlings with high survival rates—ideal for new ponds.",
      img: "/assets/bgImages/fingerlings.png",
      price: "₦80",
      originalPrice: "₦120",
      unit: "piece",
      category: "Farming",
      tags: ["Disease-free", "Fast-growing", "Carefully sorted"],
      rating: 4.9,
      reviews: 128,
      badge: "Best Seller",
      badgeColor: "bg-amber-500",
      rawPrice: 80,
      rawPriceRange: "₦80 – ₦150",
    },
    {
      id: "juveniles",
      name: "Juveniles",
      desc: "Well-developed juveniles ready for rapid growth and smooth transition.",
      img: "/assets/bgImages/juveniles.png",
      price: "₦300",
      originalPrice: "₦420",
      unit: "piece",
      category: "Farming",
      tags: ["Uniform sizes", "High feed response", "Reduced grow-out"],
      rating: 4.8,
      reviews: 94,
      badge: "Popular",
      badgeColor: "bg-blue-500",
      rawPrice: 300,
      rawPriceRange: "₦300 – ₦700",
    },
    {
      id: "table-size",
      name: "Fresh Table-Size",
      desc: "Freshly harvested, hygienically handled catfish for home & restaurants.",
      img: "/assets/bgImages/tablesize.png",
      price: "₦1,500",
      originalPrice: "₦2,000",
      unit: "kg",
      category: "Consumption",
      tags: ["Same-day harvest", "0.5kg–2kg+", "Meaty & Nutritious"],
      rating: 4.9,
      reviews: 215,
      badge: "Flash Deal",
      badgeColor: "bg-red-500",
      rawPrice: 1500,
      rawPriceRange: "₦1,500 – ₦3,500",
    },
    {
      id: "smoked",
      name: "Smoked Catfish",
      desc: "Richly smoked catfish with long shelf life and irresistible flavor.",
      img: "/assets/bgImages/smoked.png",
      price: "₦4,000",
      originalPrice: "₦5,500",
      unit: "kg",
      category: "Consumption",
      tags: ["No preservatives", "Properly smoked", "Export quality"],
      rating: 4.7,
      reviews: 77,
      badge: "Premium",
      badgeColor: "bg-deep-green",
      rawPrice: 4000,
      rawPriceRange: "₦4,000 – ₦8,000",
    },
    {
      id: "broodstock",
      name: "Broodstock",
      desc: "High-quality broodstock selected for breeding and hatchery use.",
      img: "/assets/bgImages/broodstock.png",
      price: "₦4,000",
      originalPrice: "₦6,000",
      unit: "fish",
      category: "Breeding",
      tags: ["Proven genetics", "High fertility", "Expertly selected"],
      rating: 5.0,
      reviews: 42,
      badge: "Expert Pick",
      badgeColor: "bg-purple-600",
      rawPrice: 4000,
      rawPriceRange: "₦4,000 – ₦10,000",
    },
  ];

  return <HomeClient initialProducts={mappedProducts} />;
}
