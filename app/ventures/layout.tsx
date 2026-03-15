import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventures | Packisher",
  description:
    "Packisher Ventures manages residential property in Nairobi and lists verified land for sale across Kenya, with diaspora support from Canada.",
  keywords: [
    "land for sale Kenya",
    "property management Nairobi",
    "buy land Kenya diaspora",
    "construction Kenya",
    "Packisher Ventures",
    "Kenya real estate",
    "Nairobi rentals",
  ],
  openGraph: {
    title: "Ventures | Packisher",
    description:
      "Packisher Ventures manages residential property in Nairobi and lists verified land for sale across Kenya, with diaspora support from Canada.",
    url: "https://packisher.com/ventures",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Ventures" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ventures | Packisher",
    description:
      "Packisher Ventures manages residential property in Nairobi and lists verified land for sale across Kenya, with diaspora support from Canada.",
  },
  alternates: {
    canonical: "https://packisher.com/ventures",
  },
};

export default function VenturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
