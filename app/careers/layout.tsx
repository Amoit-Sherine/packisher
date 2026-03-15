import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Packisher",
  description:
    "No open roles at Packisher right now. Reach out to support@packisher.com.",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
