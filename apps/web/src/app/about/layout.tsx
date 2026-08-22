import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";
import { resolveRequestLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveRequestLang();
  return buildMetadata({
    lang,
    title: "About — Discover Qellem",
    description: "A verified, bilingual guide to Kellem Wollega Zone.",
    path: "/about",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
