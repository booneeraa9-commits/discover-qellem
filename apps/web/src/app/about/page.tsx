"use client";

import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n-client";

export default function AboutPage() {
  const { t } = useT();

  return (
    <main className="page">
      <section className="section tight">
        <div className="container" style={{ maxWidth: 780 }}>
          <Reveal>
            <span className="kicker">{t("about.kicker")}</span>
            <h1>{t("brand.title")}</h1>
            <p className="muted" style={{ fontSize: 17 }}>
              {t("footer.about")}
            </p>
            <p>{t("about.body")}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
