// Internal component preview (dev only). NOT linked from the production nav.
// Lets the PM/reviewers eyeball every card variant in both themes and languages.
import {
  NewsCard,
  PersonCard,
  PlaceCard,
  SponsorCard,
  StoryCard,
  SupporterCard,
  type NewsCardData,
  type PersonCardData,
  type PlaceCardData,
  type SponsorCardData,
  type StoryCardData,
  type SupporterCardData,
} from "@/components/cards";
import { Gallery, type GalleryProps } from "@/components/Gallery";

const GALLERY_IMAGES: GalleryProps["images"] = [
  { src: "/img/project13.jpg", caption: "Oliiqaa Dingil Hall — large event" },
  { src: "/img/project6.jpg", caption: "Oliiqaa Dingil Grand Hall interior" },
  { src: "/img/project3.jpg", caption: "Ceremony" },
  { src: "/img/project1.jpg", caption: "Ribbon cutting" },
  { src: "/img/project2.jpg", caption: "Main avenue of Dembi Dolo" },
];

const PLACES: PlaceCardData[] = [
  {
    slug: "dambi-doolloo",
    name: { en: "Dembi Dolo", om: "Dambi Doolloo" },
    teaser: {
      en: "The capital of Kellem Wollega Zone, 652 km from Finfinnee.",
      om: "Magaalaa guddoo godina Qeellam Wallaggaa — Finfinnee irraa km 652.",
    },
    image: "/hero.jpg",
    statLabel: { en: "Population", om: "Uummata" },
    statValue: "59,343",
  },
  {
    slug: "sayyoo",
    name: { en: "Sayo", om: "Sayyoo" },
    teaser: {
      en: "The historic root of the zone — land of the Sayyoo Oromo.",
      om: "Lafa hundee godichaa — lafa Sayyoo Oromoo.",
    },
    image: "/hero.jpg",
    statLabel: { en: "Population", om: "Uummata" },
    statValue: "179,458",
  },
  {
    slug: "haawwaa-galaan",
    name: { en: "Hawa Gelan", om: "Haawwaa Galaan" },
    teaser: {
      en: "A southern woreda with wide farmland and recorded gold.",
      om: "Aanaa kibbaa — lafa qonnaa bal'aa fi warqee qabdu.",
    },
    image: "/hero.jpg",
    statLabel: { en: "Population", om: "Uummata" },
    statValue: "161,186",
  },
];

const NEWS: NewsCardData[] = [
  {
    href: "/news/dembi-dollo-inauguration-2026",
    category: { en: "Development", om: "Misooma" },
    date: "2026-08-21",
    title: {
      en: "Projects worth over 650 million Birr inaugurated in Dembi Dolo",
      om: "Magaalaa Dambi Doollootti pirojektiiwwan qarshii Miliyoona 650 oliin ijaaraman eebbifaman",
    },
    excerpt: {
      en: "The Grand Oliqa Dingil Hall, built at more than 425 million Birr, is inaugurated.",
      om: "Galmi Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame eebbifameera.",
    },
    image: "/hero.jpg",
  },
  {
    href: "/news/coffee-2026",
    category: { en: "Economy", om: "Dinagdee" },
    date: "2026-08-08",
    title: {
      en: "Zone coffee production recorded at 134,213 tonnes",
      om: "Oomishni buna godinaa toonnii 134,213 gahe",
    },
    excerpt: {
      en: "585,945 ha of coffee potential; 484,841 ha under coffee in 2016 E.C.",
      om: "Lafti bunaaf mijatu hektaara 585,945; 484,841 bunaan uwwifame (2016 A.L.I).",
    },
    image: "/hero.jpg",
  },
  {
    href: "/news/walal-2026",
    category: { en: "Environment", om: "Naannoo" },
    date: "2026-07-14",
    title: {
      en: "Dati Walal Park — a last home for species at risk",
      om: "Paarkiin Dhaatii Walaal — mana dhiisaa bineensota baduuf jiraniif",
    },
    excerpt: {
      en: "103,500 ha of rain forest; 20+ mammal and 150+ bird species.",
      om: "Hektaara 103,500 bosona roobaa; bineensota 20+ fi simbirroota 150+.",
    },
    image: "/hero.jpg",
  },
];

const STORIES: StoryCardData[] = [
  {
    href: "/news/coffee-road",
    title: {
      en: "The coffee road",
      om: "Daandii bunaa",
    },
    excerpt: {
      en: "At first light, sacks move toward markets and Dembi Dolo, then to Finfinnee and beyond.",
      om: "Ganama barii qonyee bunaatiin guutamee gara gabaawwanii fi Dambi Doollootti ce'a.",
    },
    author: { en: "Community contributor", om: "[OM] Community contributor" },
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    date: "2026-06-20",
    image: "/hero.jpg",
  },
  {
    href: "/news/dati-walal",
    title: {
      en: "Dati Walal National Park",
      om: "Paarkii Dhaatii Walaal",
    },
    excerpt: {
      en: "Herds of hippo in the river look like huge black rocks afloat.",
      om: "Gareen gafarsaa bishaan keessaa dhagaa gurraacha bishaan irra bololi'u fakkaata.",
    },
    author: { en: "Community contributor", om: "[OM] Community contributor" },
    place: { en: "Gawo Kebe", om: "Gaawoo Qeebbee" },
    date: "2026-07-02",
    image: "/hero.jpg",
  },
];

const PEOPLE: PersonCardData[] = [
  {
    slug: "dr-negasso-gidada",
    name: { en: "Dr. Negasso Gidada", om: "Dr. Nagaasoo Gidaadaa" },
    years: "1943–2019",
    role: {
      en: "First President of the FDRE (1995–2001) — born in Dembi Dolo.",
      om: "Pireezidaantii FDRE isa jalqabaa (1995–2001) — Dambi Doolloo keessatti dhalate.",
    },
    image: "/img/dr-nagaasoo.jpg",
  },
  {
    slug: "oliqa-dingil-booka",
    name: { en: "Oliqa Dingil Booka", om: "Oliiqaa Dingil Bookaa" },
    years: "c.1890–1930s",
    role: {
      en: "Hero of the Sayo highlands — anti-colonial leader.",
      om: "Goota Baddaa Sayyoo — qabsoo ittisa koloneeffataa.",
    },
    image: "/img/oliqaa-dingil.jpg",
  },
  {
    slug: "jote-tulu",
    name: { en: "Jote Tulu", om: "Jootee Tulluu" },
    years: "d. 1932",
    role: {
      en: "Ruler of Leqa Qellem who moved his seat to Gidami in 1884 E.C.",
      om: "Abbaa Bulchaa Leqa Qellem — bara 1884 A.L.I. teessoo isaa Gidaamiitti jijjiire.",
    },
  },
];

const SPONSORS: SponsorCardData[] = [
  {
    name: { en: "Kellem Wollega Zone Administration", om: "Bulchiinsa Godina Qeellam Wallaggaa" },
    href: "/support",
    initials: "KW",
    tint: "brand",
  },
  {
    name: { en: "Kellem Wollega Communication Office", om: "Waajjiira Oduu Godina Qeellam" },
    href: "/support",
    initials: "CO",
    tint: "gold",
  },
  {
    name: { en: "Dembi Dolo University", om: "Yuunivarsiitii Dambi Doolloo" },
    href: "/support",
    initials: "DD",
    tint: "brand",
  },
  {
    name: { en: "Dembi Dolo City Administration", om: "Bulchiinsa Magaalaa Dambi Doolloo" },
    href: "/support",
    initials: "DC",
    tint: "gold",
  },
];

const SUPPORTERS: SupporterCardData[] = [
  {
    name: { en: "Ato Gammachuu Gurmesa", om: "Obbo Gammachuu Gurmeessaa" },
    role: {
      en: "Chief Administrator, Kellem Wollega Zone",
      om: "Bulchaa Godina Qeellam Wallaggaa",
    },
    initials: "GG",
  },
  {
    name: { en: "Ato Girma Dangala", om: "Obbo Girmaa Dangalaa" },
    role: { en: "Mayor, Dembi Dolo City", om: "Kantiibaa Magaalaa Dambi Doolloo" },
    initials: "GD",
  },
  {
    name: { en: "Dr. Utukana Odaa", om: "Dr. Utukaanaa Odaa" },
    role: {
      en: "Deputy Head, Office of the President, Oromia",
      om: "Itt. Hoog. Waajjira Pirezidaantii Oromiyaa",
    },
    initials: "UO",
  },
  {
    name: { en: "Kellem Culture & Tourism Office", om: "Waajjira Tuurizimii Qeellam" },
    role: { en: "Research & photography partner", om: "Deeggarsa qorannoo fi suuraa" },
    initials: "KT",
  },
  {
    name: { en: "The People of Kellem Wollega", om: "Hawaasa Qeellam Wallaggaa" },
    role: { en: "The story and soul of this site", om: "Seenaa fi qabeenya — hundee fuula kanaa" },
    initials: "HW",
  },
  {
    name: { en: "Farmers & Cooperatives", om: "Qonnaan bultootaa fi Waldaalee" },
    role: { en: "817 co-ops, 156,500 members", om: "817 waldaalee, miseensota 156,500" },
    initials: "FW",
  },
];

export default function ComponentsPreview() {
  return (
    <main className="page">
      <section className="section">
        <div className="container">
          <span className="kicker">Internal preview</span>
          <h1>Card components</h1>
          <p className="muted" style={{ color: "var(--ink-500)", marginBottom: 48 }}>
            Development preview only — not linked from the navigation. Toggle EN/OM and
            dark mode from the header to check both variants.
          </p>

          <h2 style={{ fontSize: 24 }}>PlaceCard</h2>
          <div className="places-grid" style={{ marginBottom: 56 }}>
            {PLACES.map((p) => (
              <PlaceCard key={p.slug} data={p} />
            ))}
          </div>

          <h2 style={{ fontSize: 24 }}>NewsCard</h2>
          <div className="news-grid" style={{ marginBottom: 56 }}>
            {NEWS.map((n) => (
              <NewsCard key={n.href} data={n} />
            ))}
          </div>

          <h2 style={{ fontSize: 24 }}>StoryCard</h2>
          <div style={{ marginBottom: 56 }}>
            {STORIES.map((s) => (
              <StoryCard key={s.href} data={s} />
            ))}
          </div>

          <h2 style={{ fontSize: 24 }}>PersonCard</h2>
          <div className="people-grid" style={{ marginBottom: 56 }}>
            {PEOPLE.map((p) => (
              <PersonCard key={p.slug} data={p} />
            ))}
          </div>

          <h2 style={{ fontSize: 24 }}>SponsorCard</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            {SPONSORS.map((s) => (
              <SponsorCard key={s.initials} data={s} />
            ))}
          </div>

          <h2 style={{ fontSize: 24 }}>SupporterCard</h2>
          <div className="supporters-grid">
            {SUPPORTERS.map((s) => (
              <SupporterCard key={s.initials} data={s} />
            ))}
          </div>

          <h2 style={{ fontSize: 24, marginTop: 56 }}>PhotoGallery + Lightbox</h2>
          <p className="muted" style={{ color: "var(--ink-500)" }}>
            Click a tile; then use Esc, arrow keys, Tab, or swipe left/right.
          </p>
          <Gallery images={GALLERY_IMAGES} />
        </div>
      </section>
    </main>
  );
}
