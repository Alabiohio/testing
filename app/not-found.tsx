import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found. Browse our catfish products or return to the homepage.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-white">
            <div className="max-w-2xl w-full text-center space-y-12">
                {/* Minimalist 404 Header */}
                <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-deep-green/40">Error 404</span>
                    <h1 className="text-5xl md:text-6xl font-light text-foreground tracking-tight leading-tight">
                        Page Not Found
                    </h1>
                </div>

                {/* Subtle Divider */}
                <div className="w-12 h-[1px] bg-black/10 mx-auto" />

                <p className="text-foreground/50 text-lg max-w-md mx-auto leading-relaxed font-light italic">
                    The resource you requested could not be located. It may have been permanently removed or the address was mistyped.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 text-deep-green font-bold text-xs uppercase tracking-[0.2em] transition-all hover:opacity-70"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </Link>
                    <Link
                        href="/shop"
                        className="group flex items-center gap-3 text-foreground/40 font-bold text-xs uppercase tracking-[0.2em] transition-all hover:text-deep-green"
                    >
                        Explore Collection
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Footer Assistance */}
                <div className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-lg mx-auto border-t border-black/[0.03]">
                    <div className="space-y-3">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Need Help?</h4>
                        <Link href="/contact" className="block text-sm text-foreground/60 hover:text-deep-green transition-colors">Contact Support</Link>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-foreground/30">Direct Access</h4>
                        <Link href="/category" className="block text-sm text-foreground/60 hover:text-deep-green transition-colors">View Categories</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
