"use client";

// Client provider tree for the whole app. Context providers that need to
// survive across client navigations are composed here so pages stay thin.
//
// TODO(theme): add ThemeProvider once the dark/light toggle lands.

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n-client";

export default function Providers({ children }: { children: ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
