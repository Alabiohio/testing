import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Cart",
    description: "Review and manage the items in your CCB Farms shopping cart before securely proceeding to checkout.",
};

export default function CartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
