"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
import { PersonCard } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { localize } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";
import type { Place } from "@/lib/places-data";

export default function PlaceView({ place }: { place: Place }) {
  const { t, lang } = useT();

  // Full-bleed photo hero: the nav inverts to its translucent variant.
  useEffect(() => {
    document.body.classList.add("photo-nav");
    return () => document.body.classList.remove("photo-nav");
  }, []);

  const name = localize(place.name, lang);
  const tagline = localize(place.tagline, lang);
  const heroAlt = localize(place.heroAlt, lang);
  const typeLabel = t(place.type === "town" ? "place.type.capital" : "place.type.woreda");

  return (
    <main className="page">
      {/* Photo hero */}
      <section className="place-hero place-hero-photo">
        <div
          className="place-hero-bg"
          role="img"
          aria-label={heroAlt}
          style={{ backgroundImage: `url('${place.heroImage}')` }}
        />
        <div className="container">
          <nav className="breadcrumb" aria-label={t("place.breadcrumb")}>
            <Link href="/">{t("nav.home")}</Link>
            <ChevronRight aria-hidden="true" />
            <Link href="/places">{t("nav.places")}</Link>
            <ChevronRight aria-hidden="true" />
            <span>{name}</span>
          </nav>
          <div className="place-hero-grid">
            <div>
              <span className="kicker kicker-light">{typeLabel}</span>
              <h1 className="place-hero-title">{name}</h1>
              <p className="place-hero-tagline">{tagline}</p>
            </div>
            <div className="place-quickfacts place-quickfacts-hero">
              {place.quickFacts.map((fact) => (
                <div className="qf qf-hero" key={fact.label.en}>
                  <div className="qf-label">{localize(fact.label, lang)}</div>
                  <div className="qf-val">
                    {typeof fact.value === "string" ? fact.value : localize(fact.value, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          <Reveal>
            <div className="section-head left">
              <span className="kicker">{t("place.intro.kicker")}</span>
              <h2>{t("place.intro.title").replace("{name}", name)}</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="place-intro">
              {place.intro.map((paragraph, i) => (
                <p key={i}>{localize(paragraph, lang)}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Detail sections (history / economy / culture / attractions) */}
      {place.sections.map((section, i) => (
        <section
          key={section.title.en}
          className={`section${i % 2 === 1 ? " bg-paper-2" : ""}`}
        >
          <div className="container">
            <Reveal>
              <div className="section-head left">
                <span className="kicker">{localize(section.kicker, lang)}</span>
                <h2>{localize(section.title, lang)}</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="place-intro">
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j}>{localize(paragraph, lang)}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Notable people */}
      {place.people.length > 0 ? (
        <section className="section tight bg-paper-2">
          <div className="container">
            <div className="section-head left">
              <span className="kicker">{t("place.notable.kicker")}</span>
              <h2>{t("place.notable.title")}</h2>
            </div>
            <div className="people-grid">
              {place.people.map((person) => (
                <PersonCard key={person.slug} data={person} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Plan your visit / location (OSM iframe wired in a later issue) */}
      <section className="section">
        <div className="container">
          <div className="section-head left">
            <span className="kicker">{t("place.visit.kicker")}</span>
            <h2>{t("place.visit.title")}</h2>
          </div>
          <div className="osm-placeholder" role="img" aria-label={t("place.map.comingSoon")}>
            <MapPin aria-hidden="true" />
            <span>{t("place.map.comingSoon")}</span>
          </div>
          <p style={{ marginTop: 24, marginBottom: 0 }}>
            <Link href="/places" className="btn btn-ghost">
              <ArrowLeft aria-hidden="true" />
              {t("place.back")}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
