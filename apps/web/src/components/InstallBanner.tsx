"use client";

import { Download, Share, X } from "lucide-react";
import { useInstall } from "./install-client";
import { useT } from "@/lib/i18n-client";

/**
 * Bottom-of-viewport install prompt. Gold-accented, dismissible (persists to
 * localStorage with a 30-day expiry). Falls back to an iOS "Add to Home
 * Screen" tip when no beforeinstallprompt is available.
 */
export default function InstallBanner() {
  const { visible, mode, promptInstall, dismiss } = useInstall();
  const { t } = useT();

  if (!visible) return null;

  const isPrompt = mode === "prompt";
  const Icon = isPrompt ? Download : Share;
  const title = isPrompt ? t("install.banner.title") : t("install.ios.title");
  const sub = isPrompt ? t("install.banner.sub") : t("install.ios.sub");

  return (
    <div className="install-banner" aria-live="polite">
      <div className="install-banner-inner">
        <Icon aria-hidden="true" className="install-ico" />
        <div className="install-copy">
          <strong>{title}</strong>
          <p>{sub}</p>
        </div>
        <div className="install-actions">
          {isPrompt ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={promptInstall}>
              <Download aria-hidden="true" />
              {t("install.banner.install")}
            </button>
          ) : null}
          <button
            type="button"
            className="icon-btn"
            onClick={dismiss}
            aria-label={t("install.banner.dismiss")}
          >
            <X aria-hidden="true" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
