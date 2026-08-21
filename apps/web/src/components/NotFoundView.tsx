"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function NotFoundView() {
  const { t } = useT();

  return (
    <main className="page">
      <div className="nf-wrap">
        <h1>404</h1>
        <p>{t("notfound.sub")}</p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft aria-hidden="true" />
          {t("notfound.back")}
        </Link>
      </div>
    </main>
  );
}
