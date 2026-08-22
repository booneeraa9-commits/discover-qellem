import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo";
import { resolveRequestLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveRequestLang();
  return buildMetadata({
    lang,
    title: "Share your story — Discover Qellem",
    description: "Send a story, photo or correction — no account needed.",
    path: "/contribute",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
