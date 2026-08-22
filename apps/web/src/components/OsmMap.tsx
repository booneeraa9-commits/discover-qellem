"use client";

import { ExternalLink } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export interface OsmMapProps {
  lat: number;
  lng: number;
  /** Accessible label for the embedded map. */
  name: string;
}

/**
 * Styled OpenStreetMap embed panel. The iframe is lazily loaded and titled for
 * a11y; a fallback link opens the place on openstreetmap.org in a new tab.
 * Coords currently come from the local places-data.ts and keep the same shape
 * once the CMS provides them.
 */
export default function OsmMap({ lat, lng, name }: OsmMapProps) {
  const { t } = useT();

  // bbox of +/- 0.15 around the marker.
  const minLon = (lng - 0.15).toFixed(5);
  const minLat = (lat - 0.15).toFixed(5);
  const maxLon = (lng + 0.15).toFixed(5);
  const maxLat = (lat + 0.15).toFixed(5);
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  const openUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=11/${lat}/${lng}`;

  return (
    <div className="osm-embed">
      <iframe
        title={t("place.map.title").replace("{name}", name)}
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="osm-open-link"
      >
        <ExternalLink aria-hidden="true" width={14} height={14} />
        {t("place.map.open")}
      </a>
    </div>
  );
}
