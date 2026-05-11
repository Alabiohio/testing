"use client";

import { useEffect } from "react";
import { ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-white">
            <div className="max-w-2xl w-full text-center space-y-12">
                {/* Minimalist Error Header */}
                <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-400">System Error</span>
                    <h1 className="text-5xl md:text-6xl font-light text-foreground tracking-tight leading-tight">
                        Something Went Wrong
                    </h1>
                </div>

                {/* Subtle Divider */}
                <div className="w-12 h-[1px] bg-black/10 mx-auto" />

                <p className="text-foreground/50 text-lg max-w-md mx-auto leading-relaxed font-light italic">
                    An unexpected internal error has occurred. We have recorded the event and are investigating.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-12 pt-4">
                    <button
                        onClick={() => reset()}
                        className="group flex items-center gap-3 text-red-500 font-bold text-xs uppercase tracking-[0.2em] transition-all hover:opacity-70"
                    >
                        <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                        Try Reloading
                    </button>
                    <Link
                        href="/"
                        className="group flex items-center gap-3 text-foreground/40 font-bold text-xs uppercase tracking-[0.2em] transition-all hover:text-foreground"
                    >
                        Return Home
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Technical Footnote */}
                {error.digest && (
                    <div className="pt-32">
                        <span className="text-[9px] font-mono text-black/20 uppercase tracking-[0.3em]">
                            Trace ID: {error.digest}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
