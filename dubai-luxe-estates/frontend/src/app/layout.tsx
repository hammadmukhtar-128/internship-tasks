import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Lahore Real Estate | Homes for Sale & Rent in Lahore",
    template: "%s | Lahore Real Estate",
  },
  description:
    "Discover homes, apartments, villas, plots, and commercial spaces across Lahore's prime communities including DHA Lahore, Bahria Town, Gulberg, and Johar Town.",
  keywords: [
    "Lahore real estate",
    "properties in Lahore",
    "DHA Lahore homes",
    "Bahria Town Lahore",
    "Gulberg apartments",
    "house for sale Lahore",
  ],
  openGraph: {
    title: "Lahore Real Estate | Homes for Sale & Rent in Lahore",
    description: "Find verified Lahore homes, apartments, villas, and investment properties across the city’s most desirable neighbourhoods.",
    url: "http://localhost:3000",
    siteName: "Lahore Real Estate",
    images: ["/images/img1.jpg"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lahore Real Estate | Homes for Sale & Rent in Lahore",
    description: "Find verified Lahore homes, apartments, villas, and investment properties across the city’s most desirable neighbourhoods.",
    images: ["/images/img1.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </body>
    </html>
  );
}
