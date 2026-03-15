import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Packisher",
  description:
    "Digital products and physical ventures built by Packisher — from e-commerce stores and savings apps to property management and construction in Kenya.",
  keywords: [
    "Packisher portfolio",
    "web development Kenya portfolio",
    "e-commerce Kenya",
    "ROSCA savings app",
    "property management Nairobi",
    "construction Kenya",
    "digital products Africa",
  ],
  openGraph: {
    title: "Our Work | Packisher",
    description:
      "Digital products and physical ventures built by Packisher — from e-commerce stores and savings apps to property management and construction in Kenya.",
    url: "https://packisher.com/portfolio",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Packisher",
    description:
      "Digital products and physical ventures built by Packisher — from e-commerce stores and savings apps to property management and construction in Kenya.",
  },
  alternates: {
    canonical: "https://packisher.com/portfolio",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
