import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catfish Farming Training",
    description: "Join our expert-led agricultural training programs at CCB Farms. Master the art of catfish farming with hands-on experience and professional guidance.",
    openGraph: {
        title: "Catfish Farming Training | CCB Farms",
        description: "Expert-led catfish farming training and workshops at CCB Farms.",
        images: ["/ccbLg.png"],
    },
};

export default function TrainingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

