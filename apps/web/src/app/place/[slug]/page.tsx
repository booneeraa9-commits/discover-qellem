import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceView from "@/components/PlaceView";
import { getPlace, placeSlugs } from "@/lib/places-data";
import { buildMetadata } from "@/lib/seo";

// Static route params for the 12 canonical slugs (qa/CONTENT_FACTS.md §3).
export function generateStaticParams() {
  return placeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  return buildMetadata({
    title: `${place.name.en} — Discover Qellem`,
    description: place.tagline.en,
    path: `/place/${slug}`,
    image: place.heroImage,
  });
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  return <PlaceView place={place} />;
}
