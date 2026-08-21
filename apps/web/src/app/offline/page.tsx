"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function OfflinePage() {
  const { t } = useT();

  return (
    <main className="page">
      <div className="nf-wrap">
        <span className="offline-ico" aria-hidden="true">
          <WifiOff />
        </span>
        <h1>{t("offline.title")}</h1>
        <p>{t("offline.sub")}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          <RefreshCw aria-hidden="true" />
          {t("offline.retry")}
        </button>
      </div>
    </main>
  );
}
