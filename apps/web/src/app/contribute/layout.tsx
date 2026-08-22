import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Share your story — Discover Qellem",
  description: "Send a story, photo or correction — no account needed.",
  path: "/contribute",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
