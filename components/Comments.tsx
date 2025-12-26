"use client";

import { useEffect, useState } from "react";
import { getComments, Comment } from "@/lib/comments";
import { useUser } from "@clerk/nextjs";
import { addCommentAction, deleteCommentAction } from "@/app/actions/social";

export default function CommentsSection({ postSlug }: { postSlug: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const { user, isLoaded } = useUser();
    const [userName, setUserName] = useState("");
    const [newComment, setNewComment] = useState("");

    const getAvatarUrl = (user: any) => {
        return user?.imageUrl || user?.profileImageUrl;
    };

    useEffect(() => {
        if (user) {
            setUserName(user.username || user.firstName || user.emailAddresses[0].emailAddress.split('@')[0] || "");
        }
    }, [user]);

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        const data = await getComments(postSlug);
        setComments(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName || !newComment) return;

        try {
            await addCommentAction({
                postSlug,
                userName,
                userAvatar: getAvatarUrl(user),
                comment: newComment,
            });
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="mt-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">💬</span>
                Comments
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {!user ? (
                        <input
                            type="text"
                            placeholder="Your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                            required
                        />
                    ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-xl">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                {getAvatarUrl(user) ? (
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    userName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Commenting as <span className="font-bold text-blue-600 dark:text-blue-400">{userName}</span>
                            </span>
                        </div>
                    )}
                    <textarea
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-4 py-3 text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                        rows={4}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                    Post Comment
                </button>
            </form>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {comments.map((c) => (
                            <li key={c.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md group relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm overflow-hidden">
                                            {c.user_avatar ? (
                                                <img
                                                    src={c.user_avatar}
                                                    alt={c.user_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                c.user_name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        {c.user_name}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-md">
                                            {new Date(c.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                        {/* Delete Button */}
                                        {user && user.id === c.user_id && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this comment?")) {
                                                        try {
                                                            await deleteCommentAction(c.id);
                                                            setComments(prev => prev.filter(item => item.id !== c.id));
                                                        } catch (err) {
                                                            alert("Failed to delete comment");
                                                        }
                                                    }
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-all"
                                                title="Delete comment"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10">
                                    {c.comment}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
