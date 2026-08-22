import PlacesView from "@/components/PlacesView";
import { cmsToPlaceCard } from "@/lib/adapters";
import { getAllImageRenditions, getAllPlaces } from "@/lib/cms";

export default async function PlacesPage() {
  const [places, imagesById] = await Promise.all([
    getAllPlaces(),
    getAllImageRenditions(),
  ]);
  return <PlacesView places={places.map((place) => cmsToPlaceCard(place, imagesById))} />;
}
