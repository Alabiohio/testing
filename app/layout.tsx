import type { Metadata } from "next";
import { Geist_Mono, Bree_Serif, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { CartProvider } from "@/lib/cart-context";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const breeSerif = Bree_Serif({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ccb.farm'),
  title: {
    default: "CCB Farms - Your Trusted Catfish Supply Partner",
    template: "%s | CCB Farms"
  },
  description: "CCB Farms is a dependable catfish supply partner for households, retailers, and commercial buyers. Quality Fingerlings, Juveniles, Table-size, Smoked Catfish & aquaculture training.",
  keywords: ["catfish", "fish farming", "Nigeria agriculture", "juveniles", "fingerlings", "smoked fish", "farming training"],
  authors: [{ name: "CCB Farms" }],
  creator: "CCB Farms",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ccb.farm",
    siteName: "CCB Farms",
    title: "CCB Farms - Your Trusted Catfish Supply Partner",
    description: "CCB Farms is a dependable catfish supply partner for households, retailers, and commercial buyers. Quality Fingerlings, Juveniles, Table-size & Smoked Catfish.",
    images: [
      {
        url: "/ccbLg.png", // Using the logo as a fallback OG image
        width: 1200,
        height: 630,
        alt: "CCB Farms Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CCB Farms - Quality Catfish from Farm to Table",
    description: "CCB Farms is a dependable catfish supply partner. Quality Fingerlings, Juveniles, Table-size & Smoked Catfish with nationwide delivery.",
    images: ["/ccb.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { SavedProvider } from "@/lib/saved-context";
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${breeSerif.variable} ${sourceSans.variable} antialiased`}
      >
        <CartProvider>
          <SavedProvider>
            <Toaster position="bottom-right" richColors closeButton />
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </SavedProvider>
        </CartProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-K373FYJ2ZB"} />
      </body>
    </html>
  );
}

