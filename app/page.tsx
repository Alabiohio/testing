import { Suspense } from "react";
import HomeClient from "@/components/HomeClient";
import { db } from "@/lib/db";
import {
  flashDeals as flashDealsTable,
  flashSaleSettings as settingsTable,
  testimonials as testimonialsTable,
  priceCatalog as priceCatalogTable,
  growthStages as growthStagesTable
} from "@/lib/db/schema";
import { desc, and, eq, gte, asc } from "drizzle-orm";
import { getActivePartnerAds } from "@/app/actions/partner-ads";
import { getMappedProducts } from "@/lib/products";
import { safeQuery } from "@/lib/db/safe-query";
import {
  FlashDealSkeleton,
  TestimonialSkeleton,
  PartnerAdsSkeleton,
  ProductSkeleton,
} from "@/components/Skeletons";

export const revalidate = 60;

/**
 * PARALLEL FETCHING ARCHITECTURE:
 * We fetch everything at once by triggering all promises simultaneously.
 * This ensures the total load time is only as long as the slowest single query.
 */
export default async function Home() {
  // Start all fetches IN PARALLEL
  const productsPromise = getMappedProducts({ limit: 40 });

  const dealsPromise = safeQuery(
    () => db.select().from(flashDealsTable)
      .where(and(eq(flashDealsTable.isActive, true), gte(flashDealsTable.endTime, new Date())))
      .orderBy(desc(flashDealsTable.createdAt)),
    { context: "flash deals", fallbackData: [] }
  );

  const settingsPromise = safeQuery(
    () => db.select().from(settingsTable).limit(1),
    { context: "flash settings", fallbackData: [] }
  );

  const testimonialsPromise = safeQuery(
    () => db.select().from(testimonialsTable)
      .where(eq(testimonialsTable.isActive, true))
      .orderBy(desc(testimonialsTable.createdAt)),
    { context: "testimonials", fallbackData: [] }
  );

  const priceCatalogPromise = safeQuery(
    () => db.select().from(priceCatalogTable).orderBy(asc(priceCatalogTable.orderIndex)),
    { context: "price catalog", fallbackData: [] }
  );

  const partnerAdsPromise = getActivePartnerAds();

  const growthStagesPromise = safeQuery(
    () => db.select().from(growthStagesTable).orderBy(asc(growthStagesTable.orderIndex)),
    { context: "growth stages", fallbackData: [] }
  );

  return (
    <main>
      <Suspense fallback={<HomeLoadingShell />}>
        <ResolvedHome
          promises={{
            products: productsPromise,
            deals: dealsPromise,
            settings: settingsPromise,
            testimonials: testimonialsPromise,
            priceCatalog: priceCatalogPromise,
            partnerAds: partnerAdsPromise,
            growthStages: growthStagesPromise
          }}
        />
      </Suspense>
    </main>
  );
}

function HomeLoadingShell() {
  return (
    <div className="animate-pulse">
      <div className="h-[600px] bg-gray-50 w-full mb-12" />
      <div className="max-w-7xl mx-auto px-4 space-y-24">
        <FlashDealSkeleton />
        <PartnerAdsSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductSkeleton /><ProductSkeleton /><ProductSkeleton /><ProductSkeleton />
        </div>
      </div>
    </div>
  );
}

// This component awaits all the parallel promises
async function ResolvedHome({ promises }: { promises: any }) {
  const [
    mappedProducts,
    dealsResult,
    settingsResult,
    testimonialsResult,
    priceCatalogResult,
    initialPartnerAds,
    growthStagesResult
  ] = await Promise.all([
    promises.products,
    promises.deals,
    promises.settings,
    promises.testimonials,
    promises.priceCatalog,
    promises.partnerAds,
    promises.growthStages
  ]);

  let initialFlashDeal: any = null;
  let sliderFlashDeals: any[] = [];

  if (dealsResult.success && dealsResult.data.length > 0) {
    const deals = dealsResult.data;
    initialFlashDeal = deals.find((d: any) => d.isHero) || null;
    sliderFlashDeals = initialFlashDeal
      ? deals.filter((d: any) => d.id !== initialFlashDeal.id)
      : deals;
  }

  const globalSettings = settingsResult.success && settingsResult.data.length > 0
    ? settingsResult.data[0]
    : null;

  return (
    <HomeClient
      initialProducts={mappedProducts}
      initialFlashDeal={initialFlashDeal as any}
      activeFlashDeals={sliderFlashDeals as any}
      globalSettings={globalSettings}
      initialTestimonials={testimonialsResult.data ?? []}
      initialPriceCatalog={priceCatalogResult.data ?? []}
      initialPartnerAds={initialPartnerAds}
      initialGrowthStages={growthStagesResult.data ?? []}
    />
  );
}
