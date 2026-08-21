"use client";

import { SponsorCard, type SponsorCardData } from "@/components/cards";

/**
 * Infinite horizontal marquee of sponsor pills. The track duplicates the list
 * for a seamless -50% loop; the duplicate copy is inert + aria-hidden so it
 * never adds extra tab stops. Pauses on hover; reduced motion falls back to a
 * scrollable static strip.
 */
export default function SponsorsMarquee({ sponsors }: { sponsors: SponsorCardData[] }) {
  if (sponsors.length === 0) return null;

  return (
    <div className="marquee">
      <div className="marquee-track">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.initials} data={sponsor} />
        ))}
        <div inert aria-hidden="true" className="marquee-dup">
          {sponsors.map((sponsor) => (
            <SponsorCard key={`${sponsor.initials}-dup`} data={sponsor} />
          ))}
        </div>
      </div>
    </div>
  );
}
