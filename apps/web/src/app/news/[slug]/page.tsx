import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { cmsToNewsArticle } from "@/lib/adapters";
import {
  getAllNews,
  getNewsBySlug,
  getTranslatedField,
  imageUrl,
  stripRichText,
  truncateText,
} from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const news = await getAllNews();
  return news
    .map((article) => ({ slug: article.meta?.slug ?? "" }))
    .filter((entry) => entry.slug !== "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: `${getTranslatedField(article, "title", "en", "om")} — Discover Qellem`,
    description: truncateText(
      stripRichText(article.body_en) || getTranslatedField(article, "title", "en", "om"),
      200,
    ),
    path: `/news/${slug}`,
    image: imageUrl(article.featured_image, "/hero.jpg"),
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return <ArticleView article={cmsToNewsArticle(article)} />;
}
