import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logistics | Packisher",
  description:
    "Packisher Logistics is building a batched delivery platform for rural communities in British Columbia. Pilot launch: Kamloops, BC.",
};

export default function LogisticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
