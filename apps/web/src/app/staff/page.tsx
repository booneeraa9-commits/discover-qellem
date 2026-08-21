"use client";

import { LogIn } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n-client";

export default function StaffPage() {
  const { t } = useT();

  return (
    <main className="page" id="main-content">
      <section className="auth-wrap">
        <Reveal className="auth-card">
          <span className="kicker">{t("staff.kicker")}</span>
          <h2>{t("staff.title")}</h2>
          <p className="sub muted">{t("staff.sub")}</p>
          {/* Wagtail admin lives on the CMS domain; redirect wired at deploy. */}
          <a
            href="/staff/admin"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <LogIn aria-hidden="true" />
            {t("staff.cta")}
          </a>
        </Reveal>
      </section>
    </main>
  );
}
