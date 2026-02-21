import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book Your Order",
    description: "Ready to stock your ponds or buy fresh catfish? Place your order now with CCB Farms for Fingerlings, Juveniles, Table-size, or Smoked catfish.",
    openGraph: {
        title: "Book Your Order | CCB Farms",
        description: "Secure your premium catfish supply by booking an order today.",
        images: ["/assets/bgImages/fingerlings.png"],
    },
};

export default function BookedOrderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
