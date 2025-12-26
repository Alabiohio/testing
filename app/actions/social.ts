"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function addCommentAction({
    postSlug,
    userName,
    userAvatar,
    comment,
}: {
    postSlug: string;
    userName: string;
    userAvatar: string | null;
    comment: string;
}) {
    const { userId } = await auth();
    console.log("Server Action: addCommentAction called. UserID:", userId);

    if (!userId) {
        console.error("Server Action: No userId found.");
        throw new Error("Unauthorized");
    }

    console.log("Server Action: Attempting insert to 'comments' table for:", { postSlug, userName });

    const { data, error } = await supabaseAdmin.from("comments").insert([
        {
            post_slug: postSlug,
            user_name: userName,
            user_id: userId,
            user_avatar: userAvatar,
            comment,
            is_approved: true, // Auto-approve for verified users
        },
    ]).select(); // .select() is important to return the data!

    if (error) {
        console.error("Server Action: Supabase Insert Error:", error);
        throw new Error("Failed to add comment: " + error.message);
    }

    console.log("Server Action: Insert successful:", data);
    return data;
}

export async function addReactionAction({
    postSlug,
    reaction,
}: {
    postSlug: string;
    reaction: string;
}) {
    const { userId } = await auth();
    // Allow reaction even if not logged in? Current UI logic allows it via anonymity,
    // but without auth() we can't reliably get stable ID unless passed from client.
    // For now, let's enforce Auth for consistent behavior, OR rely on client passing ID
    // if we trust it (less secure).
    // Given the previous code tried to use "anonUserId" from session storage,
    // we should ideally allow anon reactions if that's the desired feature.
    // BUT, `auth().userId` is null for anon.

    // Let's stick to AUTHENTICATED users for now to prevent spam, unless requested pattern changes.
    // The previous code had a fallback for anonymous ID.
    // To support anonymous reactions securely, we'd need to trust the client-provided ID
    // or generate a session based one.

    // DECISION: Enforce Auth for now as it's cleaner with Clerk.
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin.from("reactions").insert([
        {
            post_slug: postSlug,
            user_id: userId,
            reaction,
        },
    ]);

    if (error) {
        console.error("Error adding reaction:", error);
        return null;
    }

    return data;
}

export async function removeReactionAction({
    postSlug,
    reaction,
}: {
    postSlug: string;
    reaction: string;
}) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin
        .from("reactions")
        .delete()
        .eq("post_slug", postSlug)
        .eq("user_id", userId)
        .eq("reaction", reaction)
        .select();

    if (error) {
        console.error("Error removing reaction:", error);
        return null; // Don't throw, just return null so UI can handle
    }

    return data;
}

export async function deleteCommentAction(commentId: number) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Secure delete: Only delete if the ID matches AND the user_id matches the logged-in user
    const { data, error } = await supabaseAdmin
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId)
        .select();

    if (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }

    if (data.length === 0) {
        // This means no row was deleted, likely because user_id didn't match (not owner)
    }

    return data;
}
