import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Packisher",
  description:
    "Get in touch with Packisher. For truck bookings use the Haul page. For everything else, reach us by email, Instagram, or LinkedIn.",
  keywords: [
    "contact Packisher",
    "Packisher email",
    "Packisher support",
    "logistics Kenya contact",
  ],
  openGraph: {
    title: "Contact | Packisher",
    description: "Get in touch with Packisher. For truck bookings use the Haul page.",
    url: "https://packisher.com/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Packisher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Packisher",
    description: "Get in touch with Packisher.",
  },
  alternates: {
    canonical: "https://packisher.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
