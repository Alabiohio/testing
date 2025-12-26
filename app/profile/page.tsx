"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import imageCompression from "browser-image-compression";

import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [department, setDepartment] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    // Security states
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                router.push("/sign-in");
                return;
            }
            setUsername(user.username || "");
            setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
            setDepartment((user.publicMetadata?.department as string) || "");
            setYearOfStudy((user.publicMetadata?.yearOfStudy as string) || "");
            setAvatarUrl(user.imageUrl || "");
            setLoading(false);
        }
    }, [isLoaded, user, router]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUpdating(true);
            setMessage(null);

            if (!user) throw new Error("User not authenticated");
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image");
            }

            const file = event.target.files[0];

            // 1. Clerk handles image uploads easily through user.setProfileImage
            await user.setProfileImage({ file });

            // 2. Wait a moment for Clerk to process and provide the new image URL
            await user.reload();
            setAvatarUrl(user.imageUrl);

            // 3. Sync with Supabase immediately to capture new avatar_url
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    fullName,
                    department,
                    yearOfStudy,
                }),
            });

            if (!res.ok) {
                console.error("Supabase sync failed after avatar upload");
            }

            setMessage({ type: "success", text: "Profile picture updated!" });
        } catch (error: any) {
            console.error("Upload error:", error);
            setMessage({ type: "error", text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    fullName,
                    department,
                    yearOfStudy,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update profile");
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });
            await user?.reload();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        setUpdating(true);
        setMessage(null);
        try {
            if (user?.passwordEnabled) {
                await user.updatePassword({
                    currentPassword,
                    newPassword,
                });
            } else {
                // For users without a password (OAuth), we create one
                // Clerk's updatePassword works without currentPassword if passwordEnabled is false
                await user?.updatePassword({
                    newPassword,
                });
            }
            setMessage({ type: "success", text: user?.passwordEnabled ? "Password updated successfully!" : "Password created successfully!" });
            setShowPasswordForm(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.");
        if (!confirmed) return;

        setUpdating(true);
        try {
            // 1. Clean up Supabase data
            await supabase.from("profiles").delete().eq("id", user?.id);

            // 2. Delete from Clerk
            await user?.delete();

            router.push("/");
        } catch (error: any) {
            setMessage({ type: "error", text: "Failed to delete account: " + error.message });
            setUpdating(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Profile Settings</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                        {/* ... avatar code ... */}
                        <div className="absolute -bottom-12 left-8">
                            <label className="relative block group cursor-pointer" title="Change profile picture">
                                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                    <div className="w-full h-full rounded-[1.25rem] bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400 overflow-hidden relative">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    setAvatarUrl(""); // Fallback to initials
                                                }}
                                            />
                                        ) : (
                                            username?.charAt(0).toUpperCase() || user?.primaryEmailAddress?.emailAddress.charAt(0).toUpperCase()
                                        )}
                                        {/* Upload Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={uploadAvatar}
                                    disabled={updating}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="pt-16 pb-12 px-8">
                        <div className="mb-10 flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public profile and preferences.</p>
                            </div>
                            <button
                                onClick={() => signOut(() => router.push("/"))}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                                <span>Sign Out</span>
                            </button>
                        </div>

                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
                                }`}>
                                <span className="text-xl">{message.type === "success" ? "✅" : "❌"}</span>
                                <p className="font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ... previous form fields ... */}
                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="johndoe"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                {/* Department */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Department</label>
                                    <input
                                        type="text"
                                        list="departments"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="e.g. Computer Engineering"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                    <datalist id="departments">
                                        <option value="Accounting">Accounting</option>
                                        <option value="Agricultural Economics">Agricultural Economics</option>
                                        <option value="Agricultural Engineering">Agricultural Engineering</option>
                                        <option value="Anatomy">Anatomy</option>
                                        <option value="Animal Science">Animal Science</option>
                                        <option value="Architecture">Architecture</option>
                                        <option value="Agricultural Science Education and Fine and Applied Arts Education">Agricultural Science Education and Fine and Applied Arts Education</option>
                                        <option value="Aquaculture and Fisheries Management">Aquaculture and Fisheries Management</option>
                                        <option value="Banking and Finance">Banking and Finance</option>
                                        <option value="Biochemistry">Biochemistry</option>
                                        <option value="Building">Building</option>
                                        <option value="Business Administration">Business Administration</option>
                                        <option value="Business Education">Business Education</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Computer Engineering">Computer Engineering</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Crop Science">Crop Science</option>
                                        <option value="Curriculum and Instructional Technology">Curriculum and Instructional Technology</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Dentistry">Dentistry</option>
                                        <option value="Economics">Economics</option>
                                        <option value="Educational Management">Educational Management</option>
                                        <option value="Educational Psychology">Educational Psychology</option>
                                        <option value="Electrical/Electronic Engineering">Electrical/Electronic Engineering</option>
                                        <option value="English and Literature">English and Literature</option>
                                        <option value="Entrepreneurship">Entrepreneurship</option>
                                        <option value="Estate Management">Estate Management</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Fine and Applied Arts">Fine and Applied Arts</option>
                                        <option value="Fisheries">Fisheries</option>
                                        <option value="Food Science and Nutrition">Food Science and Nutrition</option>
                                        <option value="Foriegn Languages">Foriegn Languages</option>
                                        <option value="Forestry and Wildlife">Forestry and Wildlife</option>
                                        <option value="Forest Resources and Wildlife Management">Forest Resources and Wildlife Management</option>
                                        <option value="Geography and Regional Planning">Geography and Regional Planning</option>
                                        <option value="Geography and Disaster Risk Management">Geography and Disaster Risk Management</option>
                                        <option value="Geology">Geology</option>
                                        <option value="Geomatics">Geomatics</option>
                                        <option value="Health Safety and Environmental Education">Health Safety and Environmental Education</option>
                                        <option value="History and International Studies">History and International Studies</option>
                                        <option value="Home Economics, Hospitality and Tourism Education">Home Economics, Hospitality and Tourism Education</option>
                                        <option value="Human Kinetics and Sports Science">Human Kinetics and Sports Science</option>
                                        <option value="Human Resource Management">Human Resource Management</option>
                                        <option value="Industrial Engineering">Industrial Engineering</option>
                                        <option value="Industrial and Technical Education">Industrial and Technical Education</option>
                                        <option value="Information and Communication Technology">Information and Communication Technology</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Law">Law</option>
                                        <option value="Library and Information Science">Library and Information Science</option>
                                        <option value="Linguistics">Linguistics</option>
                                        <option value="Mass Communication">Mass Communication</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Marine Engineering">Marine Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Materials & Metallurgical Engineering">Materials & Metallurgical Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                                        <option value="Medical Biochemistry">Medical Biochemistry</option>
                                        <option value="Medical Laboratory Science">Medical Laboratory Science</option>
                                        <option value="Medicine and Surgery">Medicine and Surgery</option>
                                        <option value="Microbiology">Microbiology</option>
                                        <option value="Nursing Science">Nursing Science</option>
                                        <option value="Optometry">Optometry</option>
                                        <option value="Peace Studies and Conflict Resolution">Peace Studies and Conflict Resolution</option>
                                        <option value="Petroleum Engineering">Petroleum Engineering</option>
                                        <option value="Pharmacy">Pharmacy</option>
                                        <option value="Philosophy">Philosophy</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Physiology">Physiology</option>
                                        <option value="Physiotherapy">Physiotherapy</option>
                                        <option value="Plant Biology and Biotechnology">Plant Biology and Biotechnology</option>
                                        <option value="Political Science">Political Science</option>
                                        <option value="Production Engineering">Production Engineering</option>
                                        <option value="Psychology">Psychology</option>
                                        <option value="Public Administration">Public Administration</option>
                                        <option value="Quantity Surveying">Quantity Surveying</option>
                                        <option value="Radiography">Radiography</option>
                                        <option value="Religions">Religions</option>
                                        <option value="Social Work">Social Work</option>
                                        <option value="Sociology and Anthropology">Sociology and Anthropology</option>
                                        <option value="Soil Science">Soil Science</option>
                                        <option value="Software Engineering">Software Engineering</option>
                                        <option value="Statistics">Statistics</option>
                                        <option value="Structural Engineering">Structural Engineering</option>
                                        <option value="Surveying & Geoinformatics">Surveying & Geoinformatics</option>
                                        <option value="Theatre Arts">Theatre Arts</option>
                                        <option value="Veterinary Medicine">Veterinary Medicine</option>
                                        <option value="Zoology">Zoology</option>
                                    </datalist>
                                </div>

                                {/* Year of Study */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Year of Study</label>
                                    <select
                                        value={yearOfStudy}
                                        onChange={(e) => setYearOfStudy(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="100L">100 Level</option>
                                        <option value="200L">200 Level</option>
                                        <option value="300L">300 Level</option>
                                        <option value="400L">400 Level</option>
                                        <option value="500L">500 Level</option>
                                        <option value="600L">600 Level</option>
                                        <option value="Graduate">Graduate</option>
                                    </select>
                                </div>
                            </div>

                            {/* Email (Readonly) */}
                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    Email Address <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded uppercase font-bold">Account Root</span>
                                </label>
                                <input
                                    type="email"
                                    value={user?.primaryEmailAddress?.emailAddress}
                                    disabled
                                    className="w-full px-5 py-3.5 bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                                />
                            </div>

                            <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Your information is used for public attribution on comments and posts.
                                </p>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className={`w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {updating ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and protection.</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-white"
                            >
                                {showPasswordForm ? "Cancel" : (user?.passwordEnabled ? "Change Password" : "Set Password")}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <form onSubmit={handleChangePassword} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className={`grid grid-cols-1 ${user?.passwordEnabled ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                                    {user?.passwordEnabled && (
                                        <input
                                            type="password"
                                            placeholder="Current Password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                            required
                                        />
                                    )}
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    {user?.passwordEnabled ? "Update Password" : "Create Password"}
                                </button>
                                {user?.passwordEnabled && (
                                    <div className="mt-2 text-right">
                                        <Link
                                            href="/sign-in?redirect_url=/profile"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Forgot your current password? Reset via email
                                        </Link>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/30 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/50 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider">Danger Zone</h2>
                            <p className="text-sm text-red-500/70 dark:text-red-400/60 font-medium">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={updating}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 whitespace-nowrap"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
