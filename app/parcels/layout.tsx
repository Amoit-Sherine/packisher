import type { Metadata } from "next";

const PARCELS_TITLE = "Parcel Delivery & Courier Services in Nairobi | Packisher";
const PARCELS_DESCRIPTION =
  "Send parcels anywhere in Nairobi or across Kenya via bus station. Trained riders, photo proof, Mpesa payment. Download the Packisher app.";

export const metadata: Metadata = {
  title: PARCELS_TITLE,
  description: PARCELS_DESCRIPTION,
  keywords: [
    "courier services Nairobi",
    "parcel delivery Nairobi",
    "same day delivery Nairobi Kenya",
    "last mile delivery Nairobi",
    "errand services Nairobi",
    "bus station drop Nairobi",
    "Mpesa delivery booking Kenya",
    "courier app Nairobi",
    "Packisher Parcels",
  ],
  openGraph: {
    title: PARCELS_TITLE,
    description: PARCELS_DESCRIPTION,
    url: "https://packisher.com/parcels",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/packisher-logo-light.svg", alt: "Packisher Parcels | Courier & Delivery in Nairobi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PARCELS_TITLE,
    description: PARCELS_DESCRIPTION,
  },
  alternates: { canonical: "https://packisher.com/parcels" },
};

export default function ParcelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
