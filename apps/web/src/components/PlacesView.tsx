"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PlaceCard, type PlaceCardData } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n-client";

export default function PlacesView({ places }: { places: PlaceCardData[] }) {
  const { t } = useT();

  return (
    <main className="page" id="main-content">
      <section className="place-hero">
        <div className="place-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label={t("place.breadcrumb")}>
            <Link href="/">{t("nav.home")}</Link>
            <ChevronRight aria-hidden="true" />
            <span>{t("places.title")}</span>
          </nav>
          <h1>{t("places.title")}</h1>
          <p className="tagline">{t("places.sub")}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal>
            <div className="places-grid">
              {places.map((place) => (
                <PlaceCard key={place.slug} data={place} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
