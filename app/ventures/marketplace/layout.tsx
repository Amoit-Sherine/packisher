import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Marketplace | Packisher Ventures",
  description:
    "Browse verified land listings in Kenya — Nairobi, Kajiado, Kilifi, and beyond. Title-verified plots with on-the-ground support for buyers in Kenya and the diaspora.",
  keywords: [
    "land for sale Kenya",
    "buy land Nairobi",
    "plots for sale Kitengela",
    "land sale Malindi",
    "diaspora land investment Kenya",
    "Packisher Ventures listings",
    "title deed Kenya",
    "buy land diaspora",
  ],
  openGraph: {
    title: "Land Marketplace | Packisher Ventures",
    description:
      "Browse verified land listings in Kenya — Nairobi, Kajiado, Kilifi, and beyond. Title-verified plots with on-the-ground support for buyers in Kenya and the diaspora.",
    url: "https://packisher.com/ventures/marketplace",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Land Marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Land Marketplace | Packisher Ventures",
    description:
      "Browse verified land listings in Kenya — Nairobi, Kajiado, Kilifi, and beyond. Title-verified plots with on-the-ground support for buyers in Kenya and the diaspora.",
  },
  alternates: {
    canonical: "https://packisher.com/ventures/marketplace",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
