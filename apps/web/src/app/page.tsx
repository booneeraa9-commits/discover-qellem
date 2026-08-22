import HomeView from "@/components/HomeView";
import {
  cmsToNewsCard,
  cmsToPersonCard,
  cmsToPlaceCard,
  cmsToSponsorCard,
  homeGlanceRows,
} from "@/lib/adapters";
import {
  getAllImageRenditions,
  getAllNews,
  getAllPeople,
  getAllPlaces,
  getHomePage,
  getSponsors,
} from "@/lib/cms";
import { ZONE_GLANCE } from "@/lib/zone-data";

// Zone-level stats band + hero quick facts stay static (they are not CMS
// content yet); the CMS-backed sections render from the Wagtail API with a
// local mock fallback when the CMS is unreachable (see lib/cms.ts).
export default async function Home() {
  const [news, places, people, sponsors, home, imagesById] = await Promise.all([
    getAllNews(),
    getAllPlaces(),
    getAllPeople(),
    getSponsors(),
    getHomePage(),
    getAllImageRenditions(),
  ]);

  // The home page API does not expose zone stats yet — fall back to the
  // locally mirrored verified facts (qa/CONTENT_FACTS.md).
  const glance = homeGlanceRows(home) ?? ZONE_GLANCE;

  return (
    <HomeView
      news={news.slice(0, 3).map((article) => cmsToNewsCard(article, imagesById))}
      places={places.slice(0, 4).map((place) => cmsToPlaceCard(place, imagesById))}
      people={people
        .filter((person) => person.is_zone_notable)
        .map((person) => cmsToPersonCard(person, imagesById))}
      glance={glance}
      sponsors={sponsors.map(cmsToSponsorCard)}
    />
  );
}
