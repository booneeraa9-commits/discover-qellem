import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "News & Events — Discover Qellem",
  description: "Verified news and events from Kellem Wollega Zone.",
  path: "/news",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
