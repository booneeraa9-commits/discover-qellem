"use client";

// Client provider tree for the whole app. Context providers that need to
// survive across client navigations are composed here so pages stay thin.

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n-client";
import { ThemeProvider } from "@/lib/theme-client";
import { ToastProvider } from "./use-toast";
import { InstallProvider } from "./install-client";

// The install banner is non-critical UI: split it out of the main bundle so
// its code loads only after hydration (deferred JS, Lighthouse-friendly).
const InstallBanner = dynamic(() => import("./InstallBanner"), { ssr: false });

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <ToastProvider>
          <InstallProvider>
            {children}
            <InstallBanner />
          </InstallProvider>
        </ToastProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
