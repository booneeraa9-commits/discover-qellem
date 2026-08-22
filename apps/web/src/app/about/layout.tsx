import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About — Discover Qellem",
  description: "A verified, bilingual guide to Kellem Wollega Zone.",
  path: "/about",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
