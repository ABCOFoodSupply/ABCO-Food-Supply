import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ABCO Food Supply (AFS) | Quality Food Supply Across Saudi Arabia",
  description:
    "Distributor of Imported & Locally Manufactured Food Products Across the Kingdom of Saudi Arabia. Rice, Meat, Seafood, Dairy, Oils, and Food Ingredients in Jubail, Riyadh, and GCC.",
  keywords: [
    "ABCO Food Supply",
    "AFS Saudi Arabia",
    "Food distributor Jubail",
    "Saudi food supply",
    "B2B food trading",
    "Halal meat supplier KSA",
    "HORECA food supply",
  ],
  authors: [{ name: "ABCO Food Supply" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-800`}>
        {children}
        <Toaster position="top-right" richColors closeButton expand={false} />
      </body>
    </html>
  );
}
