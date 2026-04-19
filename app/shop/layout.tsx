import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Official Shop",
    description: "Discover our specialized range of catfish produce. Whether farming, consuming, or breeding, find the perfect solution for your aquaculture needs in our official shop.",
    openGraph: {
        title: "Official Shop | CCB Farms",
        description: "Explore farming, consumption, and breeding categories in our official shop.",
        images: ["/assets/bgImages/juveniles.png"],
    },
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
