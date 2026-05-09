import HomeClient from "@/components/HomeClient";
import { db } from "@/lib/db";
import { flashDeals as flashDealsTable, flashSaleSettings as settingsTable, testimonials as testimonialsTable, priceCatalog as priceCatalogTable, growthStages as growthStagesTable } from "@/lib/db/schema";
import { desc, and, eq, gte, asc } from "drizzle-orm";
import { getActivePartnerAds } from "@/app/actions/partner-ads";
import { getMappedProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const mappedProducts = await getMappedProducts();

  // Fetch flash deal specific info for the hero/sliders
  let initialFlashDeal: any = null;
  let sliderFlashDeals: any[] = [];

  try {
    const deals = await db
      .select()
      .from(flashDealsTable)
      .where(and(eq(flashDealsTable.isActive, true), gte(flashDealsTable.endTime, new Date())))
      .orderBy(desc(flashDealsTable.createdAt));

    initialFlashDeal = deals.find(d => d.isHero) || null;
    sliderFlashDeals = initialFlashDeal 
      ? deals.filter(d => d.id !== initialFlashDeal.id)
      : deals;
  } catch (error) {
    console.error("Failed to fetch flash deals:", error);
  }

  let globalSettings: any = null;
  try {
    [globalSettings] = await db.select().from(settingsTable).limit(1);
  } catch (error) {
    console.error("Failed to fetch flash settings:", error);
  }

  let initialTestimonials: any[] = [];
  try {
    initialTestimonials = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isActive, true))
      .orderBy(desc(testimonialsTable.createdAt));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
  }

  let initialPriceCatalog: any[] = [];
  try {
    initialPriceCatalog = await db
      .select()
      .from(priceCatalogTable)
      .orderBy(asc(priceCatalogTable.orderIndex));
  } catch (error) {
    console.error("Failed to fetch price catalog:", error);
  }

  const initialPartnerAds = await getActivePartnerAds();
  
  let initialGrowthStages: any[] = [];
  try {
    initialGrowthStages = await db
      .select()
      .from(growthStagesTable)
      .orderBy(asc(growthStagesTable.orderIndex));
  } catch (error) {
    console.error("Failed to fetch growth stages:", error);
  }

  return <HomeClient 
    initialProducts={mappedProducts} 
    initialFlashDeal={initialFlashDeal as any} 
    activeFlashDeals={sliderFlashDeals as any}
    globalSettings={globalSettings}
    initialTestimonials={initialTestimonials}
    initialPriceCatalog={initialPriceCatalog}
    initialPartnerAds={initialPartnerAds}
    initialGrowthStages={initialGrowthStages}
  />;
}
