import ContributeForm, { type PlaceOption } from "@/components/ContributeForm";
import { getAllPlaces } from "@/lib/cms";

export default async function ContributePage() {
  const places = await getAllPlaces();
  const options: PlaceOption[] = places.map((place) => ({
    slug: place.geography_slug ?? place.meta?.slug ?? "",
    name: place.geography_name ?? place.title,
  }));

  return (
    <main className="page" id="main-content">
      <section className="section tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <ContributeForm places={options} />
        </div>
      </section>
    </main>
  );
}
