"use client";

import { Heart, Sparkles } from "lucide-react";
import {
  SponsorCard,
  SupporterCard,
  type SponsorCardData,
  type SupporterCardData,
} from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/use-toast";
import { useT } from "@/lib/i18n-client";

const AMOUNTS = [100, 250, 500, 1000];

export default function SupportView({
  sponsors,
  supporters,
}: {
  sponsors: SponsorCardData[];
  supporters: SupporterCardData[];
}) {
  const { t } = useT();
  const { showToast } = useToast();

  return (
    <main className="page" id="main-content">
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
                {sponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.name.om ?? sponsor.initials}
                    data={sponsor}
                  />
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
            {supporters.map((supporter) => (
              <SupporterCard
                key={supporter.name.om ?? supporter.initials}
                data={supporter}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
