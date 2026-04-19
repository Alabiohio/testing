import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Official Categories",
    description: "Explore our premium catfish categories. From healthy fingerlings to delicious smoked catfish - order online for nationwide delivery.",
    openGraph: {
        title: "Official Categories | CCB Farms",
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
