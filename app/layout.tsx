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

const ROOT_TITLE =
  "Packisher | Tipper Truck Hire Western Kenya";
const ROOT_DESCRIPTION =
  "Tipper truck hire for sand, ballast, murram and construction material delivery across Western Kenya. Book online, pay via Mpesa.";

export const metadata: Metadata = {
  title: {
    default: ROOT_TITLE,
    template: "%s | Packisher",
  },
  description: ROOT_DESCRIPTION,
  keywords: [
    "courier services Nairobi",
    "parcel delivery Nairobi",
    "same day delivery Nairobi Kenya",
    "last mile delivery Nairobi",
    "errand services Nairobi",
    "tipper truck hire Kenya",
    "tipper truck Western Kenya",
    "sand delivery Busia County",
    "ballast delivery Western Kenya",
    "murram delivery Kenya",
    "construction material delivery Kenya",
    "Mpesa delivery booking Kenya",
    "courier app Nairobi",
  ],
  metadataBase: new URL("https://packisher.com"),
  robots: { index: true, follow: true },
  openGraph: {
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    url: "https://packisher.com",
    siteName: "Packisher",
    images: [{ url: "/packisher-logo-light.svg", alt: "Packisher | Tipper Truck Services in Kenya" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: ["/packisher-logo-light.svg"],
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
  "@type": "LocalBusiness",
  name: "Packisher",
  description:
    "Courier and parcel delivery services in Nairobi. Tipper truck hire across Western Kenya.",
  url: "https://packisher.com",
  logo: "https://packisher.com/packisher-logo-light.svg",
  areaServed: [
    { "@type": "City", name: "Nairobi" },
    { "@type": "AdministrativeArea", name: "Western Kenya" },
    { "@type": "Country", name: "Kenya" },
  ],
  serviceType: [
    "Courier Service",
    "Parcel Delivery",
    "Last Mile Delivery",
    "Errand Service",
    "Tipper Truck Hire",
    "Construction Material Delivery",
  ],
  paymentAccepted: "Mpesa",
  currenciesAccepted: "KES",
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
