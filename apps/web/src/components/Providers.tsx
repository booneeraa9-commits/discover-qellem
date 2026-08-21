"use client";

// Client provider tree for the whole app. Context providers that need to
// survive across client navigations are composed here so pages stay thin.

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n-client";
import { ThemeProvider } from "@/lib/theme-client";
import { ToastProvider } from "./use-toast";
import { InstallProvider } from "./install-client";
import InstallBanner from "./InstallBanner";

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
