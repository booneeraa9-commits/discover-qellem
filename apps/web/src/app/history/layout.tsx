import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";
import { resolveRequestLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveRequestLang();
  return buildMetadata({
    lang,
    title: "History of Kellem Wollega — Discover Qellem",
    description: "From Sayyoo to today — a history drawn from named sources.",
    path: "/history",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
