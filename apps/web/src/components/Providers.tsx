"use client";

// Placeholder provider tree. Future client context providers (i18n language,
// dark/light theme) will be composed here so the whole app consumes them from a
// single client boundary.
//
// TODO(i18n): add LangProvider once the EN/OM dictionary lands.
// TODO(theme): add ThemeProvider once the dark/light toggle lands.

import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
