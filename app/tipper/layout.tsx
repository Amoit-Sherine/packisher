import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packisher Tipper — Construction Materials, Western Kenya",
  description:
    "Sand, ballast, murram, and hardcore delivered to your construction site across Western Kenya. Book online, confirm with Mpesa, we handle the rest.",
  keywords: [
    "ballast delivery Western Kenya",
    "sand delivery Busia",
    "murram delivery Kenya",
    "construction materials Busia County",
    "tipper truck hire Kenya",
    "Packisher Tipper",
    "Mpesa truck booking",
  ],
  openGraph: {
    title: "Packisher Tipper — Construction Materials, Western Kenya",
    description: "Sand, ballast, murram, and hardcore delivered to your construction site. Book online, pay via Mpesa.",
    url: "https://packisher.com/tipper",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Tipper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packisher Tipper — Construction Materials, Western Kenya",
    description: "Sand, ballast, murram, and hardcore delivered to your site. Book online, pay via Mpesa.",
  },
  alternates: { canonical: "https://packisher.com/tipper" },
};

export default function TipperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
