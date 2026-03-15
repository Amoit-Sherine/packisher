import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Services | Packisher",
  description:
    "Web development, M-Pesa integration, Google Workspace, booking systems, and custom apps for small businesses in Kenya and Canada.",
  keywords: [
    "web development Kenya",
    "Google Workspace setup Nairobi",
    "M-Pesa integration",
    "WhatsApp Business setup",
    "small business tech Kenya",
    "booking system Kenya",
    "custom app development",
    "Packisher",
  ],
  openGraph: {
    title: "Technology Services | Packisher",
    description:
      "Web development, M-Pesa integration, Google Workspace, booking systems, and custom apps for small businesses in Kenya and Canada.",
    url: "https://packisher.com/services",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Technology Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology Services | Packisher",
    description:
      "Web development, M-Pesa integration, Google Workspace, booking systems, and custom apps for small businesses in Kenya and Canada.",
  },
  alternates: {
    canonical: "https://packisher.com/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
