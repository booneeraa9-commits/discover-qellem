"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PlaceCard, type PlaceCardData } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n-client";
import { PLACES, type Place } from "@/lib/places-data";

function toCardData(place: Place): PlaceCardData {
  const population = place.quickFacts.find((fact) => fact.label.en === "Population");
  const statValue =
    population && typeof population.value === "string"
      ? population.value
      : population && typeof population.value === "object"
        ? population.value.en
        : "";

  return {
    slug: place.slug,
    name: place.name,
    teaser: place.tagline,
    image: place.heroImage,
    statLabel: population?.label ?? { en: "Population", om: "Uummata" },
    statValue,
  };
}

export default function PlacesPage() {
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
              {PLACES.map((place) => (
                <PlaceCard key={place.slug} data={toCardData(place)} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
