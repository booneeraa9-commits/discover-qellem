"use client";

// Client-side dark/light theme store.
//
// The initial theme is applied before paint by the inline script in
// layout.tsx (reads localStorage, falls back to prefers-color-scheme). This
// provider then mirrors that value into React state via useSyncExternalStore
// and owns subsequent toggles. The theme is expressed as a data-theme
// attribute on <html> — the same mechanism as the demo reference.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dq_theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => undefined,
});

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

// Module-level store so the snapshot reference is stable across renders.
const themeStore = {
  theme: "light" as Theme,
  listeners: new Set<() => void>(),

  subscribe(listener: () => void): () => void {
    themeStore.listeners.add(listener);
    return () => {
      themeStore.listeners.delete(listener);
    };
  },

  getSnapshot(): Theme {
    return themeStore.theme;
  },

  apply(next: Theme): void {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; in-memory state still works.
    }
    if (themeStore.theme !== next) {
      themeStore.theme = next;
      themeStore.listeners.forEach((listener) => listener());
    }
  },

  /**
   * Adopt the theme already applied by the layout's init script (which read
   * localStorage / prefers-color-scheme) into React state, once, after mount.
   */
  hydrate(): void {
    const applied = document.documentElement.getAttribute("data-theme");
    themeStore.apply(isTheme(applied) ? applied : "light");
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => "light",
  );

  useEffect(() => {
    themeStore.hydrate();
  }, []);

  const toggleTheme = useCallback(
    () => themeStore.apply(themeStore.getSnapshot() === "dark" ? "light" : "dark"),
    [],
  );

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Access the active theme and a `toggleTheme()` action from any client component. */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
