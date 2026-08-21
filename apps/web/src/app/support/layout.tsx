import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Support Us — Discover Qellem",
  description: "Accurate content, photography and stories grow with your support.",
  path: "/support",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
