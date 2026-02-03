import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: "italic" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Halal Maps - Vancouver",
  description: "The ultimate guide to the best Halal food in Vancouver, BC. Find top-rated restaurants, browse menus, and discover open spots near you with Halal Maps.",
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
          <main className="pb-28">
            {children}
          </main>

          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </Providers>

        <Script id="userjot-sdk" strategy="afterInteractive">
          {"window.$ujq=window.$ujq||[];window.uj=window.uj||new Proxy({},{get:(_,p)=>(...a)=>window.$ujq.push([p,...a])});document.head.appendChild(Object.assign(document.createElement('script'),{src:'https://cdn.userjot.com/sdk/v2/uj.js',type:'module',async:!0}));"}
        </Script>
        <Script id="userjot-init" strategy="afterInteractive">
          {"window.uj.init('cml71pv5f004y0jny5coy5dmf',{widget:true,position:'right',theme:'auto',trigger:'custom'});"}
        </Script>
      </body>
    </html>
  );
}
