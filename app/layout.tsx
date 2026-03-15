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
    default: "Packisher — Technology & Ventures",
    template: "%s | Packisher",
  },
  description:
    "Digital products for small businesses and property ventures in Kenya. We build websites, apps, and digital tools. Based in Canada with operations in Kenya.",
  keywords: [
    "Packisher",
    "technology services Kenya",
    "web development Kamloops",
    "property management Kenya",
    "land for sale Kenya",
    "Kenyan diaspora property",
    "M-Pesa integration",
    "Google Workspace Kenya",
  ],
  metadataBase: new URL("https://packisher.com"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "Packisher — Technology & Ventures",
    description:
      "Digital products for small businesses and property ventures in Kenya. We build websites, apps, and digital tools. Based in Canada with operations in Kenya.",
    url: "https://packisher.com",
    siteName: "Packisher Technology Services",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Technology Services" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Packisher — Technology & Ventures",
    description:
      "Digital products for small businesses and property ventures in Kenya. We build websites, apps, and digital tools. Based in Canada with operations in Kenya.",
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
  name: "Packisher Technology Services",
  url: "https://packisher.com",
  logo: "https://packisher.com/logo.png",
  description:
    "Digital products for small businesses and property ventures in Kenya and Canada.",
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
