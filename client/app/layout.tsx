import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React, { Suspense } from "react";
import AnalyticsTracker from "./components/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nextronics — Electronics & Tech Store | Computer, Audio, Smartphones & Accessories",
  description: "Shop electronics at Nextronics. Computers & laptops, planar audio headphones, 5G smartphones, smartwatches, cameras, and accessories.",
  keywords: ["electronics", "laptops", "audio", "smartphones", "watches", "nextronics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* <Header /> */}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
