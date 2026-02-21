import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CCB Farms - Premium Catfish & Sustainable Agriculture",
    template: "%s | CCB Farms"
  },
  description: "CCB Farms is a leading supplier of premium catfish (Fingerlings, Juveniles, Table-size) and a provider of expert agricultural training. Sustainable excellence in every pond.",
  keywords: ["catfish", "fish farming", "Nigeria agriculture", "juveniles", "fingerlings", "smoked fish", "farming training"],
  authors: [{ name: "CCB Farms" }],
  creator: "CCB Farms",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ccb.farms",
    siteName: "CCB Farms",
    title: "CCB Farms - Premium Catfish & Sustainable Agriculture",
    description: "Quality catfish supply and expert agricultural training. Fingerlings, Juveniles, Table-size, and Smoked Catfish.",
    images: [
      {
        url: "/ccbLogo.png", // Using the logo as a fallback OG image
        width: 1200,
        height: 630,
        alt: "CCB Farms Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CCB Farms - Premium Catfish & Sustainable Agriculture",
    description: "Quality catfish supply and expert agricultural training.",
    images: ["/ccbLogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
