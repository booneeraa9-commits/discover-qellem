"use client";

import { Heart, Sparkles } from "lucide-react";
import { SponsorCard, SupporterCard, type SponsorCardData, type SupporterCardData } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/use-toast";
import { useT } from "@/lib/i18n-client";

const AMOUNTS = [100, 250, 500, 1000];

const SPONSORS: SponsorCardData[] = [
  {
    name: { en: "Kellem Wollega Zone Administration", om: "Bulchiinsa Godina Qeellam Wallaggaa" },
    href: "/support",
    initials: "KW",
    tint: "brand",
  },
  {
    name: { en: "Kellem Wollega Communication Office", om: "Waajjiira Oduu Godina Qeellam" },
    href: "/support",
    initials: "CO",
    tint: "gold",
  },
  {
    name: { en: "Dembi Dolo University", om: "Yuunivarsiitii Dambi Doolloo" },
    href: "/support",
    initials: "DD",
    tint: "brand",
  },
  {
    name: { en: "Dembi Dolo City Administration", om: "Bulchiinsa Magaalaa Dambi Doolloo" },
    href: "/support",
    initials: "DC",
    tint: "gold",
  },
  {
    name: { en: "Zone Agriculture Office", om: "Waajjira Qonnaa Godinaa" },
    href: "/support",
    initials: "AG",
    tint: "brand",
  },
  {
    name: { en: "Kellem Coffee Cooperatives Union", om: "Waldaa Bunaa Qeellam" },
    href: "/support",
    initials: "KC",
    tint: "gold",
  },
];

const SUPPORTERS: SupporterCardData[] = [
  {
    name: { en: "Ato Gammachuu Gurmesa", om: "Obbo Gammachuu Gurmeessaa" },
    role: { en: "Chief Administrator, Kellem Wollega Zone", om: "Bulchaa Godina Qeellam Wallaggaa" },
    initials: "GG",
  },
  {
    name: { en: "Ato Girma Dangala", om: "Obbo Girmaa Dangalaa" },
    role: { en: "Mayor, Dembi Dolo City", om: "Kantiibaa Magaalaa Dambi Doolloo" },
    initials: "GD",
  },
  {
    name: { en: "Dr. Utukana Odaa", om: "Dr. Utukaanaa Odaa" },
    role: {
      en: "Deputy Head, Office of the President, Oromia",
      om: "Itt. Hoog. Waajjira Pirezidaantii Oromiyaa",
    },
    initials: "UO",
  },
  {
    name: { en: "Kellem Culture & Tourism Office", om: "Waajjira Tuurizimii Qeellam" },
    role: { en: "Research & photography partner", om: "Deeggarsa qorannoo fi suuraa" },
    initials: "KT",
  },
  {
    name: { en: "The People of Kellem Wollega", om: "Hawaasa Qeellam Wallaggaa" },
    role: { en: "The story and soul of this site", om: "Seenaa fi qabeenya — hundee fuula kanaa" },
    initials: "HW",
  },
  {
    name: { en: "Farmers & Cooperatives", om: "Qonnaan bultootaa fi Waldaalee" },
    role: { en: "817 co-ops, 156,500 members", om: "817 waldaalee, miseensota 156,500" },
    initials: "FW",
  },
];

export default function SupportPage() {
  const { t } = useT();
  const { showToast } = useToast();

  return (
    <main className="page">
      <section className="section tight">
        <div className="container">
          <Reveal>
            <div className="support-hero">
              <span className="kicker" style={{ color: "var(--gold-300)" }}>
                {t("support.kicker")}
              </span>
              <h1>{t("support.title")}</h1>
              <p>{t("support.sub")}</p>
            </div>
          </Reveal>

          <div className="grid-2">
            <Reveal>
              <div className="donate-card">
                <span className="chip gold">
                  <Sparkles aria-hidden="true" width={12} height={12} />
                  {t("support.comingSoon")} — Chapa
                </span>
                <h2 style={{ marginTop: 16 }}>{t("support.donate")}</h2>
                <p className="muted">{t("support.sub")}</p>
                <div className="amount-grid">
                  {AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="amount-btn"
                      onClick={() => showToast(t("support.toast.comingSoon"))}
                    >
                      {amount} <small>ETB</small>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-gold btn-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => showToast(t("support.toast.comingSoon"))}
                >
                  <Heart aria-hidden="true" />
                  {t("support.donate")}
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <span className="kicker">{t("support.sponsors.kicker")}</span>
              <h2>{t("support.sponsors.title")}</h2>
              <p className="muted">{t("support.sponsors.sub")}</p>
              <div className="sponsor-row">
                {SPONSORS.map((sponsor) => (
                  <SponsorCard key={sponsor.initials} data={sponsor} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tight bg-paper-2">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{t("support.sponsors.kicker")}</span>
            <h2>{t("support.supporters.title")}</h2>
            <p>{t("support.supporters.sub")}</p>
          </div>
          <div className="supporters-grid">
            {SUPPORTERS.map((supporter) => (
              <SupporterCard key={supporter.initials} data={supporter} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
