"use client";

import { useRouter } from "next/navigation";
import { localize, type LocalizedText } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

interface MapPlace {
  slug: string;
  name: LocalizedText;
  x: number;
  y: number;
  capital?: boolean;
}

// Schematic positions (approximate, not geographically exact) in a 800x520
// viewBox, matching the demo reference's pin layout. Slugs are the canonical
// production slugs from qa/CONTENT_FACTS.md §3.
const PLACES: MapPlace[] = [
  { slug: "dambi-doolloo", name: { en: "Dembi Dolo", om: "Dambi Doolloo" }, x: 400, y: 245, capital: true },
  { slug: "sayyoo", name: { en: "Sayo", om: "Sayyoo" }, x: 360, y: 280 },
  { slug: "haawwaa-galaan", name: { en: "Hawa Gelan", om: "Haawwaa Galaan" }, x: 430, y: 300 },
  { slug: "daallee-sadii", name: { en: "Dale Sadi", om: "Daallee Sadii" }, x: 490, y: 330 },
  { slug: "daallee-waabaraa", name: { en: "Dale Wabera", om: "Daallee Waabaraa" }, x: 480, y: 270 },
  { slug: "gaawoo-qeebbee", name: { en: "Gawo Kebe", om: "Gaawoo Qeebbee" }, x: 430, y: 210 },
  { slug: "yamaalogii-walal", name: { en: "Yemalogi Welel", om: "Yamaalogii Walal" }, x: 370, y: 180 },
  { slug: "anfilloo", name: { en: "Anfillo", om: "Anfilloo" }, x: 270, y: 260 },
  { slug: "gidaamii", name: { en: "Gidami", om: "Gidaamii" }, x: 220, y: 210 },
  { slug: "laaloo-qilee", name: { en: "Lalo Kile", om: "Laaloo Qilee" }, x: 500, y: 215 },
  { slug: "sadii-canqaa", name: { en: "Sadi Chanka", om: "Sadii Canqaa" }, x: 470, y: 240 },
  { slug: "jimmaa-horroo", name: { en: "Jimma Horo", om: "Jimmaa Horroo" }, x: 320, y: 170 },
];

export default function ZoneMap() {
  const { t, lang } = useT();
  const router = useRouter();
  const zoneLabel = lang === "om" ? "Qeellam Wallaggaa" : "Kellem Wollega";

  return (
    <svg
      className="map-svg"
      viewBox="0 0 800 520"
      role="img"
      aria-label={`${t("home.map.title")} — ${zoneLabel}`}
    >
      <defs>
        <linearGradient id="zoneFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-100)" />
          <stop offset="100%" stopColor="var(--brand-200)" />
        </linearGradient>
      </defs>

      {/* Stylized zone silhouette + dashed rivers (decorative). */}
      <path
        d="M190,150 C270,100 430,95 550,130 C650,160 690,240 660,320 C630,400 540,430 420,430 C290,430 170,390 140,310 C110,230 130,180 190,150 Z"
        fill="url(#zoneFill)"
        stroke="var(--brand-500)"
        strokeWidth="2"
        opacity="0.75"
      />
      <path
        d="M220,230 C300,210 370,270 460,240 C530,220 580,280 630,310"
        fill="none"
        stroke="var(--brand-400)"
        strokeWidth="1.6"
        strokeDasharray="4 5"
        opacity="0.65"
      />
      <path
        d="M200,320 C290,300 360,350 450,330 C530,310 590,350 640,340"
        fill="none"
        stroke="var(--brand-400)"
        strokeWidth="1.6"
        strokeDasharray="3 4"
        opacity="0.55"
      />
      <text
        x="400"
        y="275"
        textAnchor="middle"
        fontFamily="var(--serif)"
        fontSize="20"
        fontWeight="600"
        fill="var(--brand-700)"
        opacity="0.55"
      >
        {zoneLabel}
      </text>

      {PLACES.map((place) => {
        const label = localize(place.name, lang);
        return (
          <a
            key={place.slug}
            className={`map-pin${place.capital ? " map-pin-capital" : ""}`}
            href={`/place/${place.slug}`}
            aria-label={`${place.name.en} · ${place.name.om}`}
            onClick={(event) => {
              if (event.defaultPrevented) return;
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }
              event.preventDefault();
              router.push(`/place/${place.slug}`);
            }}
          >
            {place.capital ? (
              <circle className="pin-pulse" cx={place.x} cy={place.y} r="6" />
            ) : null}
            <circle
              className="pin-dot"
              cx={place.x}
              cy={place.y}
              r={place.capital ? 9 : 6}
            />
            <text x={place.x + 12} y={place.y + 4}>
              {label}
            </text>
          </a>
        );
      })}
    </svg>
  );
}
