import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packisher Parcels — Delivery across Nairobi",
  description:
    "Parcel pickup and drop off across Nairobi. Trained riders handle your deliveries, errands, and bus station drops. Pay via Mpesa. Join the waitlist.",
  keywords: [
    "delivery Nairobi",
    "parcel delivery Nairobi",
    "errand service Nairobi",
    "bus station drop Nairobi",
    "Mpesa delivery",
    "Packisher Parcels",
    "last mile delivery Kenya",
  ],
  openGraph: {
    title: "Packisher Parcels — Delivery across Nairobi",
    description: "Parcel pickup and drop off across Nairobi. Trained riders. Pay via Mpesa.",
    url: "https://packisher.com/parcels",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Packisher Parcels" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packisher Parcels — Delivery across Nairobi",
    description: "Parcel pickup and drop off across Nairobi. Trained riders. Pay via Mpesa.",
  },
  alternates: { canonical: "https://packisher.com/parcels" },
};

export default function ParcelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
