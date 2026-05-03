import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DotGrid from "@/components/DotGrid";
import TextMagnifier from "@/components/TextMagnifier";
import BackgroundLens from "@/components/BackgroundLens";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Packisher — Logistics across Kenya",
    template: "%s | Packisher",
  },
  description:
    "Parcel delivery across Nairobi and construction material logistics across Western Kenya. Packisher Run and Packisher Haul. Pay via Mpesa.",
  keywords: [
    "Packisher",
    "delivery Nairobi",
    "parcel delivery Kenya",
    "ballast delivery Western Kenya",
    "sand delivery Busia",
    "murram delivery Kenya",
    "Packisher Run",
    "Packisher Haul",
    "Mpesa delivery",
    "tipper truck Kenya",
  ],
  metadataBase: new URL("https://packisher.com"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "Packisher — Logistics across Kenya",
    description:
      "Parcel delivery across Nairobi and construction material logistics across Western Kenya. Packisher Run and Packisher Haul. Pay via Mpesa.",
    url: "https://packisher.com",
    siteName: "Packisher",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Logistics" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Packisher — Logistics across Kenya",
    description:
      "Parcel delivery across Nairobi and construction material logistics across Western Kenya.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://packisher.com",
  },
  icons: {
    icon: "/packisher-favicon.svg",
    shortcut: "/packisher-favicon.svg",
    apple: "/packisher-favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Packisher",
  url: "https://packisher.com",
  logo: "https://packisher.com/logo.png",
  description:
    "Parcel delivery across Nairobi and construction material logistics across Western Kenya.",
  sameAs: [
    "https://www.linkedin.com/company/packisher/",
    "https://www.instagram.com/packisher/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@packisher.com",
    availableLanguage: "English",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <DotGrid />
        <BackgroundLens />
        <TextMagnifier />
        <Nav />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
