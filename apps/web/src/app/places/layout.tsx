import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Woredas & Towns — Discover Qellem",
  description: "Woredas and towns of Kellem Wollega Zone, each with a dedicated page.",
  path: "/places",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
