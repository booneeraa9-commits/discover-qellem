"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Link2,
  Mail,
  MapPin,
  Share2,
} from "lucide-react";
import { Gallery } from "@/components/Gallery";
import { useToast } from "@/components/use-toast";
import { localize } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";
import type { NewsArticle } from "@/lib/news-data";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ArticleView({ article }: { article: NewsArticle }) {
  const { t, lang } = useT();
  const { showToast } = useToast();

  const title = localize(article.title, lang);
  const category = localize(article.category, lang);
  const place = localize(article.place, lang);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t("article.copied"));
    } catch {
      showToast(window.location.href);
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        // User cancelled the share sheet; fall through to mail fallback.
      }
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}`;
  };

  return (
    <main className="page" id="main-content">
      <section className="section tight">
        <div className="container">
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <nav className="breadcrumb" aria-label={t("place.breadcrumb")}>
              <Link href="/">{t("nav.home")}</Link>
              <ChevronRight aria-hidden="true" />
              <Link href="/news">{t("nav.news")}</Link>
              <ChevronRight aria-hidden="true" />
              <span>{title}</span>
            </nav>

            <span className="chip">{category}</span>
            <h1 style={{ marginTop: 14 }}>{title}</h1>

            <div className="meta-row">
              <span>
                <CalendarDays aria-hidden="true" width={14} height={14} />
                {formatDate(article.date)}
              </span>
              <span>
                <MapPin aria-hidden="true" width={14} height={14} />
                {place}
              </span>
            </div>

            <div className="article-hero">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS-provided image; next/image wiring lands in Sprint 3 */}
              <img src={article.image} alt={title} />
            </div>

            <div className="article">
              {article.body.map((paragraph, i) => (
                <p key={i}>{localize(paragraph, lang)}</p>
              ))}
              <p className="muted" style={{ fontSize: 13.5 }}>
                {t("article.source")}
              </p>
            </div>

            {article.gallery.length > 0 ? (
              <div className="article-gallery-section">
                <div className="section-head left">
                  <span className="kicker">{t("article.gallery.title")}</span>
                </div>
                <Gallery images={article.gallery} />
              </div>
            ) : null}

            <div className="share-row">
              <button type="button" onClick={copyLink}>
                <Link2 aria-hidden="true" />
                {t("article.copyLink")}
              </button>
              <button type="button" onClick={share}>
                <Mail aria-hidden="true" />
                {t("article.share")}
              </button>
              <button type="button" onClick={share}>
                <Share2 aria-hidden="true" />
                {t("article.share")}
              </button>
            </div>

            <p style={{ marginTop: 24 }}>
              <Link href="/news" className="btn btn-ghost">
                <ArrowLeft aria-hidden="true" />
                {t("news.back")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
