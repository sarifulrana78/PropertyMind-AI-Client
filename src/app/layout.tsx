import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: {
    default: "PropertyMind AI — Intelligent Real Estate Platform",
    template: "%s | PropertyMind AI",
  },
  description: "Discover, analyze, and invest in properties with AI-powered insights. PropertyMind AI combines cutting-edge artificial intelligence with comprehensive real estate data to help you make smarter property decisions.",
  keywords: ["real estate", "AI", "property search", "investment", "market analysis", "PropertyMind"],
  authors: [{ name: "PropertyMind AI" }],
  openGraph: {
    title: "PropertyMind AI — Intelligent Real Estate Platform",
    description: "AI-powered real estate intelligence platform",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
