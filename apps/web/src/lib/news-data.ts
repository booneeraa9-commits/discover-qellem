import type { LocalizedText } from "@/lib/i18n";
import type { LightboxImage } from "@/components/Lightbox";

// Local typed placeholder news data. The shape mirrors what the Wagtail CMS
// will return in Sprint 3; figures come from qa/CONTENT_FACTS.md.

export interface NewsArticle {
  slug: string;
  categoryKey: string;
  category: LocalizedText;
  /** ISO date, e.g. "2026-08-21". */
  date: string;
  place: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
  image: string;
  gallery: LightboxImage[];
}

export const NEWS: NewsArticle[] = [
  {
    slug: "dembi-dollo-inauguration-2026",
    categoryKey: "development",
    category: { en: "Development", om: "Misooma" },
    date: "2026-08-21",
    place: { en: "Dembi Dolo", om: "Dambi Doolloo" },
    title: {
      en: "Projects worth over 650 million Birr inaugurated in Dembi Dolo",
      om: "Magaalaa Dambi Doollootti pirojektiiwwan qarshii Miliyoona 650 oliin ijaaraman eebbifaman",
    },
    excerpt: {
      en: "The Grand Oliqa Dingil Hall, built at more than 425 million Birr, is inaugurated together with the city corridor, clusters and the Science Café.",
      om: "Galmi Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame, kooridarii magaalaa, kilaasterota fi Kaaffee Tekinooloojii waliin eebbifamaa jira.",
    },
    body: [
      {
        en: "Multiple development projects built at a cost of more than 650 million Birr are being inaugurated in Dembi Dolo. The Grand Oliqa Dingil Hall, constructed for over 425 million Birr, is opened together with the city corridor development, multi-purpose service clusters, the Science & Technology Café and the city road network.",
        om: "Pirojektiiwwan gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman Dambi Doollootti eebbifamaa jiru. Galmi Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame, kooridarii magaalaa, kilaasterota, Kaaffee Tekinooloojii fi marfata magaalichaa waliin eebbifamaa jira.",
      },
      {
        en: "The Mayor of Dembi Dolo, Obbo Girma Dangala, reported more than 32 projects underway. The Chief Administrator of Kellem Wollega, Obbo Gammachuu Gurmesa, stated that 2,284 projects worth more than 17 billion Birr have been completed over the last four years.",
        om: "Kantiibaan Magaalaa Dambi Doolloo Obbo Girmaa Dangalaa pirojektoota 32 ol hojjetamaa jiraachuu himan. Bulchaan Godina Qellem Wallaggaa Obbo Gammachuu Gurmeessaa pirojektoota 2,284 qarshii Biliyoona 17 oliin waggoota afran darban xumuraman himan.",
      },
      {
        en: "Dr. Utukana Odaa, Deputy Head of the Office of the President of the Oromia Regional State, said the regional government's work in education, technology, economy and institution-building is succeeding at a high level.",
        om: "Dr. Utukaanaa Odaa, Itt. Hoog. Waajjira Pirezidaantii Mootummaa Naannoo Oromiyaa, hojiin mootummaa naannoo barnootaa, teekinooloojii, dinagdee fi sirna ijaaruutti sadarkaa olaanaan milkaa'aa jiraachuu himan.",
      },
    ],
    image: "/img/project6.jpg",
    gallery: [
      { src: "/img/project13.jpg", caption: "Oliiqaa Dingil Hall — large event" },
      { src: "/img/project6.jpg", caption: "Grand Hall interior" },
      { src: "/img/project3.jpg", caption: "Ceremony" },
      { src: "/img/project1.jpg", caption: "Ribbon cutting" },
      { src: "/img/project2.jpg", caption: "Main avenue of Dembi Dolo" },
    ],
  },
  {
    slug: "coffee-2026",
    categoryKey: "economy",
    category: { en: "Economy", om: "Dinagdee" },
    date: "2026-08-08",
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    title: {
      en: "Zone coffee production recorded at 134,213 tonnes",
      om: "Oomishni buna godinaa toonnii 134,213 gahe",
    },
    excerpt: {
      en: "585,945 ha of coffee potential; in 2016 E.C. 484,841 ha were covered and 134,213 tonnes produced.",
      om: "Lafti bunaaf mijatu hektaara 585,945; bara 2016 A.L.I hektaara 484,841 uwwifamee toonnii 134,213 oomishame.",
    },
    body: [
      {
        en: "According to the zone profile, 484,841 ha were under coffee in 2016 E.C., producing 134,213 tonnes. 817 cooperatives with 156,500 members channel the harvest to market.",
        om: "Akka ragaa waajjira godinaatti, bara 2016 A.L.I hektaara 484,841 bunaan uwwifamee toonnii 134,213 oomishame. Waldaaleen 817 miseensota 156,500 waliin oomisha gabaaf qopheessu.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "walal-2026",
    categoryKey: "environment",
    category: { en: "Environment", om: "Naannoo" },
    date: "2026-07-14",
    place: { en: "Gawo Kebe", om: "Gaawoo Qeebbee" },
    title: {
      en: "Dati Walal Park — a last home for species at risk",
      om: "Paarkiin Dhaatii Walaal — mana dhiisaa bineensota baduuf jiraniif",
    },
    excerpt: {
      en: "103,500 ha of rain forest; 20+ mammal and 150+ bird species.",
      om: "Hektaara 103,500 bosona roobaa; bineensota 20+ fi simbirroota 150+.",
    },
    body: [
      {
        en: "Dati Walal was established by proclamation 87/2005 and gazetted 25 May 2012. It is home to hippo, buffalo and lion — IUCN-listed vulnerable species.",
        om: "Paarkiin Dhaatii Walaal labsii 87/2005tiin hundeeffame; Caamsaa 25, 2012 beekame. Roobii, gafarsa fi leenca — IUCN'n balaaf saaxilamoo — of keessaa qaba.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "gold-2026",
    categoryKey: "minerals",
    category: { en: "Minerals", om: "Mineraala" },
    date: "2026-06-03",
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    title: {
      en: "Gold recorded in five woredas",
      om: "Warqee aanaalee shan keessatti argama",
    },
    excerpt: {
      en: "EMA (1988): gold in Anfillo, Dale Wabera, Hawa Gelan, Lalo Kile and Sayo.",
      om: "Ragaan EMA (1988): warqee Anfilloo, Daallee Waabaraa, Haawwaa Galaan, Laaloo Qilee fi Sayyoo keessatti.",
    },
    body: [
      {
        en: "Known minerals include gold, platinum (Lalo Kile), tantalum (Sayo) and uranium (Anfillo, Sayo). Platinum extraction is beginning in Lalo Kile.",
        om: "Mineraalonni godina keessatti argaman warqee, pilaatiiniyam (Laaloo Qilee), tantaalam (Sayyoo) fi yuureniyam (Anfilloo, Sayyoo) dha. Pilaatiiniyamiin Laaloo Qilee keessatti baasuun jalqabaa jira.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "honey-2026",
    categoryKey: "agriculture",
    category: { en: "Agriculture", om: "Qonna" },
    date: "2026-05-19",
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    title: {
      en: "473,300 beehives — honey's big potential",
      om: "Gaagura dammaa 473,300 — qabeenya guddaa",
    },
    excerpt: {
      en: "473,300 hives (2015 E.C.) — modern methods are the answer to lift output.",
      om: "Gaagura 473,300 (2015 A.L.I); teeknooloojii ammayyaa guddinaaf barbaaddi.",
    },
    body: [
      {
        en: "The zone counts 473,300 hives (2015) and 339,193 (2016). Output remains low — modern hives will significantly raise production.",
        om: "Gaagura dammaa 473,300 (2015) fi 339,193 (2016) jiru. Oomishni garuu gadi aanaa dha — gaagura ammayyaa guddina oomishaa fida.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "health-2026",
    categoryKey: "health",
    category: { en: "Health", om: "Fayyaa" },
    date: "2026-04-22",
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    title: {
      en: "Zone health in numbers",
      om: "Fayyaa godinaa lakkoofsota ragaa irraa",
    },
    excerpt: {
      en: "4 hospitals, 51 health centres, 256 health posts.",
      om: "Hospitaalota 4, buufata fayyaa 51, kellaa fayyaa 256.",
    },
    body: [
      {
        en: "The zone has 4 hospitals, 51 health centres, 256 health posts and 372 drug vendors. One doctor currently serves 43,960 people.",
        om: "Hospitaalota 4, buufata fayyaa 51, kellaa fayyaa 256 fi mana qorichaa 372 jiru. Doktorri tokko uummata 43,960 tajaajila.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "schools-2026",
    categoryKey: "education",
    category: { en: "Education", om: "Barnoota" },
    date: "2026-03-09",
    place: { en: "Kellem Wollega", om: "Qeellam Wallaggaa" },
    title: {
      en: "348,516 students learning across the zone",
      om: "Barattoota 348,516 godina keessatti baratu",
    },
    excerpt: {
      en: "452 government primary schools, 50 secondary schools, one teachers' college and one university.",
      om: "Mana barumsaa 1–8 mootummaa 452, 9–12 50, koolleejjii barsiisota 1 fi yuunivarsiitii 1.",
    },
    body: [
      {
        en: "In 2016 E.C. the zone had 452 government primary and 50 secondary schools, one teachers' college and one university — 348,516 students enrolled.",
        om: "Bara 2016 A.L.I manneen barumsaa 1–8 mootummaa 452, 9–12 50, koolleejjii barsiisota 1 fi yuunivarsiitii 1 jiru — barattoonni 348,516.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
  {
    slug: "irreecha-2026",
    categoryKey: "culture",
    category: { en: "Culture", om: "Aadaa" },
    date: "2026-09-27",
    place: { en: "Local water sites", om: "Madda bishaanii" },
    title: {
      en: "Irreecha celebration",
      om: "Ayyaana Irreechaa",
    },
    excerpt: {
      en: "Irreecha, the Oromo thanksgiving, gathers communities at the water.",
      om: "Irreecha ayyaana galataa Oromoo — hawaasni madda bishaanii irratti walga'a.",
    },
    body: [
      {
        en: "Communities across Kellem mark Irreecha at local water sites — thanksgiving, song and gathering.",
        om: "Hawaasni Qeellam Irreecha madda bishaanii irratti kabaja — galata, faaruu fi walga'ii hawaasaa.",
      },
    ],
    image: "/hero.jpg",
    gallery: [],
  },
];

export const newsSlugs = NEWS.map((item) => item.slug);

export function getNews(slug: string): NewsArticle | undefined {
  return NEWS.find((item) => item.slug === slug);
}
