import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getNews, newsSlugs } from "@/lib/news-data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return newsSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNews(slug);
  if (!article) return {};
  return buildMetadata({
    title: `${article.title.en} — Discover Qellem`,
    description: article.excerpt.en,
    path: `/news/${slug}`,
    image: article.image,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNews(slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
