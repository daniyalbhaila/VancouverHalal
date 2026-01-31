import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import { Providers } from "@/components/Providers";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: "italic" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Vancouver Halal Restaurants",
  description: "The ultimate guide to the best Halal food in Vancouver, BC. Find top-rated restaurants, browse menus, and discover open spots near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen font-sans antialiased transition-colors",
        "bg-[var(--bg-base)] text-[var(--text-primary)]",
        manrope.variable,
        newsreader.variable
      )}>
        <Providers>
          {/* Liquid Glass Header */}
          <header className={cn(
            "fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-center",
            "bg-[var(--glass-bg)] backdrop-blur-2xl shadow-lg",
            "border-b border-[var(--glass-border)]",
            "transform-gpu transition-colors"
          )}>
            <h1 className="text-sm font-bold tracking-tight">Vancouver Halal Restaurants</h1>
          </header>

          <main className="pt-14 pb-28">
            {children}
          </main>

          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
