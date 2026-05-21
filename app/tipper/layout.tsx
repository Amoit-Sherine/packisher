import type { Metadata } from "next";

const TIPPER_TITLE = "Tipper Truck Hire Western Kenya | Sand, Ballast & Murram Delivery | Packisher";
const TIPPER_DESCRIPTION =
  "Book a tipper truck for sand, ballast, murram and hardcore delivery across Western Kenya and Busia County. Book online, pay via Mpesa, delivered to your site.";

export const metadata: Metadata = {
  title: TIPPER_TITLE,
  description: TIPPER_DESCRIPTION,
  keywords: [
    "tipper truck hire Kenya",
    "tipper truck Western Kenya",
    "sand delivery Busia County",
    "ballast delivery Western Kenya",
    "murram delivery Kenya",
    "construction material delivery Kenya",
    "construction materials Busia County",
    "Mpesa truck booking",
    "Packisher Tipper",
  ],
  openGraph: {
    title: TIPPER_TITLE,
    description: TIPPER_DESCRIPTION,
    url: "https://packisher.com/tipper",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/packisher-logo-light.svg", alt: "Packisher Tipper | Construction Material Delivery, Western Kenya" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TIPPER_TITLE,
    description: TIPPER_DESCRIPTION,
  },
  alternates: { canonical: "https://packisher.com/tipper" },
};

export default function TipperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
