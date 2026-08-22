"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard, type NewsCardData } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { localize } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";
import type { CategoryOption } from "@/lib/adapters";

const PER_PAGE = 6;

export type NewsItem = NewsCardData & { categoryKey: string };

export default function NewsView({
  articles,
  categories,
}: {
  articles: NewsItem[];
  categories: CategoryOption[];
}) {
  const { t, lang } = useT();
  const [categoryKey, setCategoryKey] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (categoryKey === "all" ? articles : articles.filter((a) => a.categoryKey === categoryKey)),
    [articles, categoryKey],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const selectCategory = (key: string) => {
    setCategoryKey(key);
    setPage(1);
  };

  return (
    <main className="page" id="main-content">
      <section className="place-hero">
        <div className="place-hero-bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label={t("place.breadcrumb")}>
            <Link href="/">{t("nav.home")}</Link>
            <ChevronRight aria-hidden="true" />
            <span>{t("news.title")}</span>
          </nav>
          <h1>{t("news.title")}</h1>
          <p className="tagline">{t("news.sub")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tabs" role="group" aria-label={t("news.title")}>
            <button
              type="button"
              className={`tab${categoryKey === "all" ? " active" : ""}`}
              onClick={() => selectCategory("all")}
            >
              {t("news.filter.all")}
            </button>
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`tab${category.key === categoryKey ? " active" : ""}`}
                onClick={() => selectCategory(category.key)}
              >
                {localize(category.label, lang)}
              </button>
            ))}
          </div>

          <Reveal>
            <div className="news-grid">
              {pageItems.map((article) => (
                <NewsCard key={article.href} data={article} />
              ))}
            </div>
          </Reveal>

          {totalPages > 1 ? (
            <nav className="pagination" aria-label={t("pagination.page")}>
              <button
                type="button"
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                aria-label={t("pagination.prev")}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <span className="page-indicator">
                {t("pagination.page")} {current} / {totalPages}
              </span>
              <button
                type="button"
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current === totalPages}
                aria-label={t("pagination.next")}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
}
