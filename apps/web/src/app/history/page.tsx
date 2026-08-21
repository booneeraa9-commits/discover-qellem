"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { localize } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";
import { TIMELINE } from "@/lib/timeline-data";

export default function HistoryPage() {
  const { t, lang } = useT();

  return (
    <main className="page" id="main-content">
      <section className="place-hero">
        <div className="place-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label={t("place.breadcrumb")}>
            <Link href="/">{t("nav.home")}</Link>
            <ChevronRight aria-hidden="true" />
            <span>{t("nav.history")}</span>
          </nav>
          <h1>{t("history.title")}</h1>
          <p className="tagline">{t("history.sub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head left">
              <span className="kicker">{t("history.kicker")}</span>
              <h2>{t("history.timeline.title")}</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="timeline">
              {TIMELINE.map((event) => (
                <div className="tl-item" key={event.year}>
                  <div className="tl-year">{event.year}</div>
                  <div className="tl-title">{localize(event.title, lang)}</div>
                  <p className="tl-text">{localize(event.text, lang)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
