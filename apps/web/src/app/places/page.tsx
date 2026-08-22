import PlacesView from "@/components/PlacesView";
import { cmsToPlaceCard } from "@/lib/adapters";
import { getAllPlaces } from "@/lib/cms";

export default async function PlacesPage() {
  const places = await getAllPlaces();
  return <PlacesView places={places.map(cmsToPlaceCard)} />;
}
