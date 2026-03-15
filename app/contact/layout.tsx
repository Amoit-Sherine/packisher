import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Packisher",
  description:
    "Get in touch with Packisher. We respond within one business day. Reach us by email, Instagram, or LinkedIn.",
  keywords: [
    "contact Packisher",
    "Packisher email",
    "book consultation Kenya",
    "hire web developer Kenya",
    "tech support Kenya",
  ],
  openGraph: {
    title: "Contact | Packisher",
    description:
      "Get in touch with Packisher. We respond within one business day. Reach us by email, Instagram, or LinkedIn.",
    url: "https://packisher.com/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Packisher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Packisher",
    description:
      "Get in touch with Packisher. We respond within one business day. Reach us by email, Instagram, or LinkedIn.",
  },
  alternates: {
    canonical: "https://packisher.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
