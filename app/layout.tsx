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
        "min-h-screen bg-zinc-50 font-sans antialiased",
        manrope.variable,
        newsreader.variable
      )}>
        <Providers>
          {/* Simple Header */}
          <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50 flex items-center justify-center">
            <h1 className="text-sm font-bold tracking-tight text-zinc-900">Vancouver Halal Restaurants</h1>
          </header>

          <main className="pt-14 pb-20">
            {children}
          </main>

          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
