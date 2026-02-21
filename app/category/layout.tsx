import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catfish Categories",
    description: "Explore our range of premium catfish, from Fingerlings and Juveniles to Table-size and Smoked catfish. Quality aquaculture products for farmers and consumers.",
    openGraph: {
        title: "Catfish Categories | CCB Farms",
        description: "Quality Fingerlings, Juveniles, Table-size, and Smoked Catfish at CCB Farms.",
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
