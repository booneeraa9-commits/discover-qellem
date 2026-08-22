import HistoryView from "@/components/HistoryView";
import { cmsToTimeline } from "@/lib/adapters";
import { getTimeline } from "@/lib/cms";

export default async function HistoryPage() {
  const events = await getTimeline();
  // The CMS lists newest-first; the demo presents the timeline oldest-first.
  const chronological = [...events].sort(
    (a, b) => (a.year_int ?? 0) - (b.year_int ?? 0),
  );
  return <HistoryView events={chronological.map(cmsToTimeline)} />;
}
