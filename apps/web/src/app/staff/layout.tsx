import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Editorial sign-in — Discover Qellem",
  description: "Editors and administrators only.",
  path: "/staff",
});

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
