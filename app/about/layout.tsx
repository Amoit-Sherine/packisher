import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Packisher",
  description:
    "Kenyan founded. Canada based. Operating on the ground in Nairobi and Western Kenya. Packisher builds logistics infrastructure for both markets.",
  keywords: [
    "about Packisher",
    "Packisher founders",
    "Kenya Canada logistics",
    "Nairobi delivery company",
    "Western Kenya logistics",
    "Packisher Run",
    "Packisher Haul",
  ],
  openGraph: {
    title: "About | Packisher",
    description:
      "Kenyan founded. Canada based. Operating on the ground in Nairobi and Western Kenya.",
    url: "https://packisher.com/about",
    type: "website",
    images: [{ url: "/packisher-logo-light.svg", alt: "About Packisher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Packisher",
    description: "Kenyan founded. Canada based. Operating on the ground in Nairobi and Western Kenya.",
  },
  alternates: {
    canonical: "https://packisher.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
