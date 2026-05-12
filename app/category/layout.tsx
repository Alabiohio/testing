import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catfish Categories & Pricing",
    description: "Explore our premium catfish categories with detailed pricing. From healthy fingerlings to delicious smoked catfish - order online for nationwide delivery.",
    openGraph: {
        title: "Catfish Categories & Pricing | CCB Farms",
        description: "Explore our catfish categories - Fingerlings, Juveniles, Table-size, and Smoked Catfish.",
        images: ["/assets/bgImages/tablesize.png"],
    },
};

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
