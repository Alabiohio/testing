import type { Metadata } from "next";
import CheckoutPageClient from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your catfish order checkout. Enter delivery details and confirm your purchase securely.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
