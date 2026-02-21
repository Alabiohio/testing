import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with CCB Farms for inquiries, orders, or training opportunities. We are located in Ogun State and serve customers nationwide.",
    openGraph: {
        title: "Contact Us | CCB Farms",
        description: "Reach out to CCB Farms for all your catfish and agricultural needs.",
        images: ["/ccbLogo.png"],
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
