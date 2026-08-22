import SupportView from "@/components/SupportView";
import { cmsToSponsorCard, cmsToSupporterCard } from "@/lib/adapters";
import { getSponsors, getSupporters } from "@/lib/cms";

export default async function SupportPage() {
  const [sponsors, supporters] = await Promise.all([getSponsors(), getSupporters()]);
  return (
    <SupportView
      sponsors={sponsors.map(cmsToSponsorCard)}
      supporters={supporters.map(cmsToSupporterCard)}
    />
  );
}
