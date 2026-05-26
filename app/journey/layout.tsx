import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journey | Packisher",
  description:
    "The honest record of what Packisher has built, what we have launched, and what is coming next. From technology services to logistics across Kenya.",
  keywords: [
    "Packisher history",
    "Packisher journey",
    "Packisher portfolio",
    "Packisher Run",
    "Packisher Haul",
    "Kenya startup",
    "logistics Kenya",
  ],
  openGraph: {
    title: "The Journey | Packisher",
    description:
      "The honest record of what Packisher has built, launched, and what is coming next.",
    url: "https://packisher.com/journey",
    type: "website",
    images: [{ url: "/packisher-logo-light.svg", alt: "Packisher Journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journey | Packisher",
    description: "The honest record of what Packisher has built and what is coming next.",
  },
  alternates: {
    canonical: "https://packisher.com/journey",
  },
};

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
