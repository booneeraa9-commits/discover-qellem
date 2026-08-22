import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceView from "@/components/PlaceView";
import { cmsToPlace } from "@/lib/adapters";
import { getAllPeople, getAllPlaces, getPlaceBySlug, imageUrl, stripRichText, truncateText } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const places = await getAllPlaces();
  return places
    .map((place) => ({ slug: place.geography_slug ?? place.meta?.slug ?? "" }))
    .filter((entry) => entry.slug !== "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPlaceBySlug(slug);
  if (!profile) return {};
  const name = profile.geography_name ?? profile.title;
  return buildMetadata({
    title: `${name} — Discover Qellem`,
    description: truncateText(
      stripRichText(profile.intro_en) || stripRichText(profile.intro_om),
      200,
    ),
    path: `/place/${slug}`,
    image: imageUrl(profile.hero_image ?? profile.featured_image, "/hero.jpg"),
  });
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [profile, people] = await Promise.all([getPlaceBySlug(slug), getAllPeople()]);
  if (!profile) notFound();

  const peopleBySlug = new Map(people.map((person) => [person.slug, person]));
  return <PlaceView place={cmsToPlace(profile, peopleBySlug)} />;
}
