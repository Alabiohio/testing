import type { Metadata } from "next";
import SuccessPageClient from "./success-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been successfully placed. Our team will contact you within 24 hours to finalize delivery.",
  robots: { index: false, follow: true },
};

export default function SuccessPage() {
  return <SuccessPageClient />;
}
