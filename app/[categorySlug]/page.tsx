import { redirect } from "next/navigation";

export default async function LegacyCategoryRedirect({ params }: { params: Promise<{ categorySlug: string }> }) {
    const { categorySlug } = await params;
    redirect(`/category/${categorySlug.toLowerCase()}`);
}
