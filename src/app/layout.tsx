import "./globals.css";
import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import { useEffect } from "react";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import Analytics from "./components/Analytics";
import { Suspense } from "react";

// Arabic font
const amiri = Amiri({
    weight: ["400", "700"],
    subsets: ["arabic"],
    variable: "--font-amiri",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Mufko Quran Chat",
    description: "Get answers to your questions about the Quran",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="islamic">
            <body
                className={`${inter.variable} ${amiri.variable} font-sans min-h-screen islamic-pattern`}
            >
                {children}
                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>
            </body>
        </html>
    );
}
