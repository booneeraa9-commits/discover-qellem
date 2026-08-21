"use client";

// Client provider tree for the whole app. Context providers that need to
// survive across client navigations are composed here so pages stay thin.

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n-client";
import { ThemeProvider } from "@/lib/theme-client";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  );
}
