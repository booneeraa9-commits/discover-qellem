"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Non-standard event Chromium-based browsers expose for PWA install. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallMode = "prompt" | "ios" | "instructions";

interface InstallContextValue {
  visible: boolean;
  mode: InstallMode;
  promptInstall: () => void;
  dismiss: () => void;
}

const InstallContext = createContext<InstallContextValue>({
  visible: false,
  mode: "prompt",
  promptInstall: () => undefined,
  dismiss: () => undefined,
});

const DISMISS_KEY = "dq_install_dismissed";
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  return (
    (typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    (typeof navigator !== "undefined" &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIosDevice(): boolean {
  return typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<InstallMode>("prompt");
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  const promptInstall = useCallback(() => {
    const event = deferredPrompt.current;
    if (event) {
      event.prompt();
      event.userChoice
        .then((choice) => {
          if (choice.outcome === "accepted") {
            deferredPrompt.current = null;
            setVisible(false);
            try {
              window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {});
      return;
    }
    // No deferred prompt (e.g. iOS or already declined): show instructions.
    setMode(isIosDevice() ? "ios" : "instructions");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      if (!isDismissed()) {
        setMode("prompt");
        setVisible(true);
      }
    };

    const onInstalled = () => {
      deferredPrompt.current = null;
      setVisible(false);
      try {
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIosDevice() && !isDismissed()) {
      iosTimer = setTimeout(() => {
        setMode("ios");
        setVisible(true);
      }, 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const value = { visible, mode, promptInstall, dismiss };

  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

export function useInstall(): InstallContextValue {
  return useContext(InstallContext);
}
