"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Compass, Heart, Landmark, Map } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n-client";

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

export default function Home() {
  const { t } = useT();

  // The home hero is a full-bleed photo hero, so the nav needs its inverted,
  // translucent variant (see body.photo-nav styles in globals.css).
  useEffect(() => {
    document.body.classList.add("photo-nav");
    return () => document.body.classList.remove("photo-nav");
  }, []);

  return (
    <main className="page">
      <section className="place-hero place-hero-photo home-hero">
        <div
          className="place-hero-bg"
          role="img"
          aria-label={t("home.hero.imageAlt")}
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
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
    </main>
  );
}
