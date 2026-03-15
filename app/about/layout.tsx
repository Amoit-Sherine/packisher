import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Packisher",
  description:
    "Packisher is a technology and ventures company operating between Canada and Kenya. We build digital products for small businesses and manage property and land in Nairobi.",
  keywords: [
    "about Packisher",
    "Packisher founders",
    "Kamloops tech company",
    "Nairobi tech agency",
    "Kenya Canada startup",
    "remote-first agency Africa",
  ],
  openGraph: {
    title: "About | Packisher",
    description:
      "Packisher is a technology and ventures company operating between Canada and Kenya. We build digital products for small businesses and manage property and land in Nairobi.",
    url: "https://packisher.com/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Packisher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Packisher",
    description:
      "Packisher is a technology and ventures company operating between Canada and Kenya. We build digital products for small businesses and manage property and land in Nairobi.",
  },
  alternates: {
    canonical: "https://packisher.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
