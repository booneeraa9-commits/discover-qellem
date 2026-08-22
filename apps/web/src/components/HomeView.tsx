"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  Compass,
  Heart,
  Landmark,
  LayoutGrid,
  Map,
  Newspaper,
} from "lucide-react";
import { CountUp } from "@/components/CountUp";
import GlanceTable from "@/components/GlanceTable";
import { Reveal } from "@/components/Reveal";
import SponsorsMarquee from "@/components/SponsorsMarquee";
import ZoneMap from "@/components/ZoneMap";
import ResponsiveImage from "@/components/ResponsiveImage";
import {
  NewsCard,
  PersonCard,
  PlaceCard,
  type NewsCardData,
  type PersonCardData,
  type PlaceCardData,
  type SponsorCardData,
} from "@/components/cards";
import { useT } from "@/lib/i18n-client";
import type { GlanceRow } from "@/lib/zone-data";

interface StatItem {
  value: number;
  suffix?: string;
  labelKey: string;
  subKey: string;
}

const STATS: StatItem[] = [
  { value: 1254817, labelKey: "home.stats.population.label", subKey: "home.stats.population.sub" },
  { value: 9857, suffix: " km²", labelKey: "home.stats.area.label", subKey: "home.stats.area.sub" },
  { value: 12, labelKey: "home.stats.woredas.label", subKey: "home.stats.woredas.sub" },
  { value: 134213, suffix: " t", labelKey: "home.stats.coffee.label", subKey: "home.stats.coffee.sub" },
  { value: 6721429, labelKey: "home.stats.livestock.label", subKey: "home.stats.livestock.sub" },
  { value: 473300, labelKey: "home.stats.beehives.label", subKey: "home.stats.beehives.sub" },
];

const QUICK_FACTS = [
  { labelKey: "home.quickfacts.population.label", valueKey: "home.quickfacts.population.value" },
  { labelKey: "home.quickfacts.area.label", valueKey: "home.quickfacts.area.value" },
  { labelKey: "home.quickfacts.woredas.label", valueKey: "home.quickfacts.woredas.value" },
  { labelKey: "home.quickfacts.coffee.label", valueKey: "home.quickfacts.coffee.value" },
];

const FEATURES = [
  { icon: Map, titleKey: "home.features.explore.title", textKey: "home.features.explore.text" },
  { icon: Landmark, titleKey: "home.features.history.title", textKey: "home.features.history.text" },
  { icon: Compass, titleKey: "home.features.visit.title", textKey: "home.features.visit.text" },
];

export interface HomeViewProps {
  news: NewsCardData[];
  places: PlaceCardData[];
  people: PersonCardData[];
  glance: GlanceRow[];
  sponsors: SponsorCardData[];
}

export default function HomeView({ news, places, people, glance, sponsors }: HomeViewProps) {
  const { t } = useT();

  // The home hero is a full-bleed photo hero, so the nav needs its inverted,
  // translucent variant (see body.photo-nav styles in globals.css).
  useEffect(() => {
    document.body.classList.add("photo-nav");
    return () => document.body.classList.remove("photo-nav");
  }, []);

  return (
    <main className="page" id="main-content">
      <section className="place-hero place-hero-photo home-hero">
        <div className="place-hero-bg">
          <ResponsiveImage
            src="/hero.jpg"
            alt={t("home.hero.imageAlt")}
            priority
            fill
          />
        </div>
        <div className="container">
          <div className="place-hero-grid">
            <div>
              <span className="kicker kicker-light">{t("home.hero.kicker")}</span>
              <h1 className="place-hero-title">
                {t("home.hero.title.1")}
                <br />
                <em>{t("home.hero.title.2")}</em>
                <br />
                {t("home.hero.title.3")}
              </h1>
              <p className="place-hero-tagline">{t("home.hero.tagline")}</p>
              <div className="hero-cta">
                <Link href="/places" className="btn btn-primary">
                  <ArrowRight aria-hidden="true" />
                  {t("home.cta.explore")}
                </Link>
                <Link href="/support" className="btn btn-ghost-light">
                  <Heart aria-hidden="true" />
                  {t("home.cta.support")}
                </Link>
              </div>
            </div>

            <div className="place-quickfacts place-quickfacts-hero">
              {QUICK_FACTS.map((fact) => (
                <div className="qf qf-hero" key={fact.labelKey}>
                  <div className="qf-label">{t(fact.labelKey)}</div>
                  <div className="qf-val">{t(fact.valueKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.stats.kicker")}</span>
              <h2>{t("home.stats.title")}</h2>
              <p>{t("home.stats.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="stats stats-3">
              {STATS.map((stat, i) => (
                <Reveal delay={0.08 * i} key={stat.labelKey}>
                  <div className="stat">
                    <div className="stat-value">
                      <CountUp to={stat.value} suffix={stat.suffix ?? ""} />
                    </div>
                    <div className="stat-label">{t(stat.labelKey)}</div>
                    <div className="stat-sub">{t(stat.subKey)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.glance.kicker")}</span>
              <h2>{t("home.glance.title")}</h2>
              <p>{t("home.glance.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <GlanceTable rows={glance} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.woredas.kicker")}</span>
              <h2>{t("home.woredas.title")}</h2>
              <p>{t("home.woredas.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="places-grid">
              {places.map((place) => (
                <PlaceCard key={place.slug} data={place} />
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="text-center" style={{ marginTop: 32 }}>
              <Link href="/places" className="btn btn-ghost">
                <LayoutGrid aria-hidden="true" />
                {t("home.woredas.viewAll")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.map.kicker")}</span>
              <h2>{t("home.map.title")}</h2>
              <p>{t("home.map.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="map-wrap">
              <ZoneMap />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.news.kicker")}</span>
              <h2>{t("home.news.title")}</h2>
              <p>{t("home.news.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="news-grid">
              {news.map((article) => (
                <NewsCard key={article.href} data={article} />
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="text-center" style={{ marginTop: 32 }}>
              <Link href="/news" className="btn btn-ghost">
                <Newspaper aria-hidden="true" />
                {t("home.news.viewAll")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.notable.kicker")}</span>
              <h2>{t("home.notable.title")}</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="people-strip">
              {people.map((person) => (
                <PersonCard key={person.slug} data={person} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper-2">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("home.features.kicker")}</span>
              <h2>{t("home.features.title")}</h2>
              <p>{t("home.features.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="features features-3">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Reveal delay={0.08 * i} key={feature.titleKey}>
                    <div className="feature">
                      <div className="feature-ico">
                        <Icon aria-hidden="true" />
                      </div>
                      <h3>{t(feature.titleKey)}</h3>
                      <p>{t(feature.textKey)}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sponsors-section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{t("support.sponsors.kicker")}</span>
              <h2>{t("support.sponsors.title")}</h2>
              <p>{t("support.sponsors.sub")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SponsorsMarquee sponsors={sponsors} />
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal>
            <div className="support-hero" style={{ padding: 48 }}>
              <span className="kicker" style={{ color: "var(--gold-300)" }}>
                {t("home.support.kicker")}
              </span>
              <h2 style={{ fontSize: "clamp(28px, 3.4vw, 40px)" }}>
                {t("home.support.title")}
              </h2>
              <p>{t("home.support.sub")}</p>
              <Link href="/support" className="btn btn-gold" style={{ marginTop: 18 }}>
                <Heart aria-hidden="true" />
                {t("home.support.cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
