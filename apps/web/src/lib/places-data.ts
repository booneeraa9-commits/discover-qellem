import type { LocalizedText } from "@/lib/i18n";

// Local typed placeholder data for the 12 woredas/towns. The shape mirrors
// what the Wagtail CMS will return in Sprint 3 (issues #29/#30); pages read
// from here and will swap to the CMS client without changing components.
//
// Canonical slugs come from qa/CONTENT_FACTS.md §3; OM names are the exact
// canonical strings from §2. Verified figures come from the zone profile
// 2015 & 2016 E.C. and the demo reference data.

export type PlaceType = "town" | "woreda";

export interface PlaceQuickFact {
  label: LocalizedText;
  value: string | LocalizedText;
}

export interface PlaceSection {
  kicker: LocalizedText;
  title: LocalizedText;
  paragraphs: LocalizedText[];
}

export interface PlacePerson {
  slug: string;
  name: LocalizedText;
  years: string;
  role: LocalizedText;
  image?: string;
}

export interface Place {
  slug: string;
  type: PlaceType;
  name: LocalizedText;
  tagline: LocalizedText;
  heroImage: string;
  heroAlt: LocalizedText;
  quickFacts: PlaceQuickFact[];
  intro: LocalizedText[];
  sections: PlaceSection[];
  people: PlacePerson[];
  /** [lat, lng] — used by the OSM embed in a later issue. */
  coords: [number, number];
}

const HERO = "/hero.jpg";

const POP_LABEL: LocalizedText = { en: "Population", om: "Uummata", am: "[AM draft]" };
const ELEV_LABEL: LocalizedText = { en: "Elevation", om: "Olka'iinsa", am: "[AM draft]" };
const CAPITAL_LABEL: LocalizedText = { en: "Capital", om: "Magaalaa Guddoo", am: "[AM draft]" };
const KEY_LABEL: LocalizedText = { en: "Key product", om: "Oomisha ijoo", am: "[AM draft]" };
const CLIMATE_LABEL: LocalizedText = { en: "Climate", om: "Haala qilleensaa", am: "[AM draft]" };

export const PLACES: Place[] = [
  {
    slug: "dambi-doolloo",
    type: "town",
    name: { en: "Dembi Dolo", om: "Dambi Doolloo", am: "[AM draft]" },
    tagline: {
      en: "The capital of Kellem Wollega Zone, 652 km from Finfinnee — a centre of trade, history and fresh development.",
      om: "Magaalaa guddoo godina Qeellam Wallaggaa — Finfinnee irraa km 652. Giddugala daldalaa, seenaa fi misooma haarawa godichaa.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Dembi Dolo, capital of Kellem Wollega", om: "[OM] Dambi Doolloo, magaalaa guddoo Qeellam Wallaggaa", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "59,343" },
      { label: ELEV_LABEL, value: "1,701–1,827 m" },
      { label: KEY_LABEL, value: { en: "Trade, services & administration", om: "Daldala fi tajaajila", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Dembi Dolo is the seat of Kellem Wollega Zone administration, divided into four sub-cities, and home to the zone university, a hospital, eleven banks, several colleges and an airstrip.",
        om: "Dambi Doolloo teessoo Bulchiinsa Godina Qeellam Wallaggaati — kutaa magaalaa afur qabdi; yuunivarsiitii, hospitaala, baankii 11, koolleejjii fi dirree xiyyaaraa of keessaa qabdi.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "A town named after a tree", om: "Magaalaa maqaa mukaatiin moggaafamte", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Its name comes from the dambi tree: a man called Obbo Dolloo waited in its shade, and traders crossing between Wollega and Gambela rested beneath it — so the town came to be called Dembi Dolo.",
            om: "Maqaan ishee muka dambii irraa dhufe: namichi Obbo Dolloo gaaddisa muka dambii jalatti taa'e; daldaltoonni Wallaggaa fi Gumbelaa jidduu deeman achitti boqatan. Haaluma kanaan 'Dambi Dolloo' jedhamte.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Trade, services and administration", om: "Daldala, tajaajila fi bulchiinsa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "As zonal capital, Dembi Dolo anchors trade, banking, education and public services. The Grand Oliqa Dingil Hall, built at more than 425 million Birr, was inaugurated in 2026.",
            om: "Akka magaalaa guddoo godinaatti, Dambi Doolloo daldala, baankii, barnootaa fi tajaajila mootummaa qabdi. Galmi Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame bara 2026 eebbifame.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Landmarks of the capital", om: "Bakkaalee magaalaa guddoo", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Visitors find the Grand Oliqa Dingil Hall, the city corridor, Borta Lake and the weekly Grand Market of Dembi Dolo.",
            om: "Daawwattoonni Galma Oliiqaa Dingil, kooridarii magaalaa, Hara Bortaa fi Gabaa Guddaa Dambi Doolloo argatu.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "dr-negasso-gidada",
        name: { en: "Dr. Negasso Gidada", om: "Dr. Nagaasoo Gidaadaa", am: "[AM draft]" },
        years: "1943–2019",
        role: {
          en: "First President of the FDRE (1995–2001) — born in Dembi Dolo.",
          om: "Pireezidaantii FDRE isa jalqabaa (1995–2001) — Dambi Doolloo keessatti dhalate.", am: "[AM draft]",
        },
        image: "/img/dr-nagaasoo.jpg",
      },
    ],
    coords: [8.533, 34.8],
  },
  {
    slug: "sayyoo",
    type: "woreda",
    name: { en: "Sayo", om: "Sayyoo", am: "[AM draft]" },
    tagline: {
      en: "The historic root of the zone — land of the Sayyoo Oromo, encircling Dembi Dolo itself.",
      om: "Lafa hundee godichaa — lafa Sayyoo Oromoo; Dambi Doolloo of keessaa qabdi.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Sayo woreda hills", om: "[OM] Tulluuwwan Sayyoo", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "179,458" },
      { label: ELEV_LABEL, value: "720–2,230 m" },
      { label: KEY_LABEL, value: { en: "Coffee", om: "Buna", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Sayo lies in the south-west of the zone, with the zonal capital Dembi Dolo within its borders, 555+ springs and two wildlife reserves.",
        om: "Sayyoo kibba-dhiha godinaatti argamti — Dambi Doolloo of keessaa qabdi; madda bishaanii 555 ol fi bakka eegumsaa bineensaa lama qabdi.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "The root of the zone", om: "Hundee godichaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The Sayyoo are a branch of the Machaa Oromo; Dembi Dolo itself was long known simply as Sayo. Dr Negasso Gidada's doctoral research brought the name to world scholarship.",
            om: "Sayyoon gosa Maccaa Oromoo keessaa dha; Dambi Doolloo yeroo dheeraaf 'Sayyoo' jedhamti turte. Qorannoon Dr. Nagaasoo Gidaadaa maqaa Sayyoo addunyaaf beeksise.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee country", om: "Biyya bunaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Coffee dominates; hills, springs and the wildlife reserves of Bada Xinnoo and Bada Guddaa shape its landscape.",
            om: "Buna oomisha ijoo ti; tulluuwwan, madda bishaanii fi bakka eegumsaa Bada Xinnoo fi Bada Guddaa lafa ishee bareechan.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "The historic hills of Sayo", om: "Tulluuwwan seenyaa Sayyoo", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The hills where the story of Jote Tulu and the Sayyoo clans was written are today green with coffee farms.",
            om: "Tulluuwwan seenaan Jootee Tulluu fi gosa Sayyoo barreeffame, har'a masara bunaatiin magariifaman.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "jote-tulu",
        name: { en: "Jote Tulu (Dejazmach)", om: "Jootee Tulluu", am: "[AM draft]" },
        years: "d. 1932",
        role: {
          en: "Ruler of Leqa Qellem who moved his seat to Gidami in 1884 E.C.",
          om: "Abbaa Bulchaa Leqa Qellem — bara 1884 A.L.I. teessoo isaa Gidaamiitti jijjiire.", am: "[AM draft]",
        },
      },
      {
        slug: "dr-negasso-gidada",
        name: { en: "Dr. Negasso Gidada", om: "Dr. Nagaasoo Gidaadaa", am: "[AM draft]" },
        years: "1943–2019",
        role: {
          en: "First President of the FDRE — born in Dembi Dolo (Sayo).",
          om: "Pireezidaantii FDRE isa jalqabaa — Dambi Doolloo (Sayyoo) keessatti dhalate.", am: "[AM draft]",
        },
        image: "/img/dr-nagaasoo.jpg",
      },
    ],
    coords: [8.47, 34.8],
  },
  {
    slug: "haawwaa-galaan",
    type: "woreda",
    name: { en: "Hawa Gelan", om: "Haawwaa Galaan", am: "[AM draft]" },
    tagline: {
      en: "A southern woreda with wide farmland, many rivers and recorded gold.",
      om: "Aanaa kibba godinaa — lafa qonnaa bal'aa, lageen hedduu fi warqee.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Hawa Gelan farmland", om: "[OM] Lafa qonnaa Haawwaa Galaan", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "161,186" },
      { label: ELEV_LABEL, value: "500–2,500 m" },
      { label: CAPITAL_LABEL, value: { en: "Geba Robi", om: "Geba Roobii", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Hawa Gelan lies in the south, 28 km from Dembi Dolo, with its capital at Geba Robi and elevations from 500 to 2,500 m.",
        om: "Haawwaa Galaan kibba godinaatti, Dambi Doolloo irraa km 28 argamti; magaalaan guddoon ishee Geba Roobii dha.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "A land of farms and minerals", om: "Lafa qonnaa fi mineraalaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The Ethiopian Mapping Authority (1988) records gold, platinum, titanium and uranium. Farmers live under coffee shade and on grain land.",
            om: "Ragaan Kaartaa Itoophiyaa (1988) warqee, pilaatiiniyam, titaaniyam fi yuureniyam ibsa. Qonnaan bultoonni gaaddisa bunaa fi lafa midhaanii irratti jiraatu.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Coffee, grain and livestock sustain the woreda; on market days produce flows to town.",
            om: "Buna, midhaan fi horiin jireenya gandaaf bu'uura; guyyaa gabaa oomishni gara magaalaatti ce'a.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Keto Waterfall", om: "Finchaa Kettoo", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A waterfall 48 km from Dembi Dolo, most spectacular in the heavy rains.",
            om: "Finchaa bishaanii — km 48 Dambi Doolloo irraa; yeroo rooba cimaa bareedina guddaa qaba.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.38, 35.0],
  },
  {
    slug: "daallee-sadii",
    type: "woreda",
    name: { en: "Dale Sadi", om: "Daallee Sadii", am: "[AM draft]" },
    tagline: {
      en: "A woreda named after two clans — Dalle of the highland and Sedi of the lowland.",
      om: "Aanaa maqaa gosoota lamaatiin moggaafamte — Daallee (baddaa) fi Saadii (gammoojjii).", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Dale Sadi hills", om: "[OM] Tulluuwwan Daallee Sadii", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "117,613" },
      { label: ELEV_LABEL, value: "up to 2,209 m" },
      { label: CAPITAL_LABEL, value: { en: "Haro Sebu", om: "Haroo Sabuu", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Dale Sadi lies in the south, 90 km from Dembi Dolo. The name joins two Oromo clans — the Dalle of the highland and the Sedi of the lowland.",
        om: "Daallee Sadii kibba godinaatti, Dambi Doolloo irraa km 90 argamti. Maqaan ishee gosoota Oromoo lama — Daallee baddaa fi Saadii gammoojjii — irraa dhufe.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Named by two clans", om: "Maqaa gosoota lamaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The two clans came together and named the woreda after themselves. The capital, Haro Sebu, is named after the lake beside the town.",
            om: "Gosoonni lamaan walitti dhufanii maqaa 'Daallee Sadii' jedhu moggaasan. Magaalaan guddoon, Haroo Sabuu, maqaa hara naannoo ishee jiru irraa argatte.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Highland teff, barley and wheat grow alongside lowland maize, sorghum, coffee and millet.",
            om: "Baddaa irratti xaafii, garbuu fi qamadii; gammoojjii irratti boqqolloo, mishingaa, buna fi daangulee oomishamu.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Jajo Akakil Stone Cave", om: "Holqa Jajoo Akakil", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A stone cave 132 km from Dembi Dolo — an official tourism site.",
            om: "Holqa dhagaa — km 132 Dambi Doolloo irraa; bakka daawwannaa ofiisaalaa.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.25, 35.2],
  },
  {
    slug: "daallee-waabaraa",
    type: "woreda",
    name: { en: "Dale Wabera", om: "Daallee Waabaraa", am: "[AM draft]" },
    tagline: {
      en: "An eastern woreda with capital at Kake — over 358 springs and recorded gold.",
      om: "Aanaa baha godinaa — magaalaan guddoon Kaakee; madda bishaanii 358+ fi warqee.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Dale Wabera highlands", om: "[OM] Baddaa Daallee Waabaraa", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "119,555" },
      { label: ELEV_LABEL, value: "1,500–2,000 m" },
      { label: CAPITAL_LABEL, value: { en: "Kake", om: "Kaakee", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Dale Wabera lies in the east, 72 km from Dembi Dolo. Over 358 springs rise here, and EMA 1988 records gold.",
        om: "Daallee Waabaraa baha godinaatti, Dambi Doolloo irraa km 72 argamti. Maddi bishaanii 358 ol jira; ragni EMA 1988 warqee ibsa.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Springs and hills", om: "Madda bishaanii fi tulluuwwan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The springs are the base of village life — drinking water, livestock and irrigation — while hills like Guma Guda rise to 2,209 m.",
            om: "Maddi bishaanii jireenya gandaaf bu'uura — dhugaatii, horii fi jallisiidhaaf oola. Tulluun Guma Guda meetira 2,209 olka'a.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A climate of 95% woyinadega makes this excellent coffee country.",
            om: "Haalli qilleensaa Woyina Deega 95% bunaaf mijataa dha.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "The 358 springs", om: "Madda Bishaanii 358", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The springs and rivers are the woreda's quiet wealth, feeding traditional and modern irrigation.",
            om: "Madda bishaanii fi lageen qabeenya aanaa kanaati — jallisii aadaa fi ammayyaatiif tajaajilu.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.35, 35.25],
  },
  {
    slug: "gaawoo-qeebbee",
    type: "woreda",
    name: { en: "Gawo Kebe", om: "Gaawoo Qeebbee", am: "[AM draft]" },
    tagline: {
      en: "The zone's tourism woreda — home to Dati Walal National Park, Mount Walal and Gawo forest.",
      om: "Aanaa daawwannaa godinaa — Paarkii Dhaatii Walaal, Tulluu Walaal fi bosona Gawo of keessaa qabdi.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Gawo Kebe highlands", om: "[OM] Baddaa Gaawoo Qeebbee", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "143,770" },
      { label: ELEV_LABEL, value: "1,300–3,335 m" },
      { label: KEY_LABEL, value: { en: "Coffee & grain", om: "Buna fi midhaan", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Gawo Kebe was demarcated from Dale Wabera in January 1998 E.C. It is rich in attractions, from Dati Walal National Park to Mount Walal at 3,335 m.",
        om: "Gaawoo Qeebbee Amajjii 1998 Daallee Waabaraa irraa adda baafame. Daawwannaan ishee badhaadhaa dha — Paarkii Dhaatii Walaal irraa kaasee hanga Tulluu Walaal (meetira 3,335).", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "The zone's tourism woreda", om: "Aanaa daawwannaa godinaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Established in January 1998 E.C., the woreda has 37 kebeles, 34 rural and 3 urban.",
            om: "Amajjii 1998 A.L.I. hundeeffame; gandoonni 37 jiru — 34 baadiyyaa fi 3 magaalaa.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Coffee and grain are the mainstays, with rainfall in eastern highlands reaching 1,700–2,200 mm.",
            om: "Buna fi midhaan oomisha ijoo ti; roobni baha ishee mm 1,700–2,200 ta'a.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Dati Walal National Park", om: "Paarkii Biyyaalessaa Dhaatii Walaal", am: "[AM draft]" },
        paragraphs: [
          {
            en: "103,500 ha of rain forest — hippo, buffalo and lion (IUCN vulnerable), proclaimed 87/2005 and gazetted 25 May 2012.",
            om: "Hektaara 103,500 bosona roobaa — roobii, gafarsa, leenca (IUCN'n balaaf saaxilamoo). Labsii 87/2005, Caamsaa 25, 2012 beekame.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "jaal-laggasaa-wagii",
        name: { en: "Jaal Laggasa Wagi Metta", om: "Jaal Laggasaa Wagii Meettaa", am: "[AM draft]" },
        years: "1960–",
        role: {
          en: "Revolutionary and western Oromia leader who joined the Qelem Kabo by age 15.",
          om: "Qabsaa'aa fi hogganaa dhiha Oromiyaa; gaafa umuriin isaa waggaa 15 dura Kaabii Qellemitti makame.", am: "[AM draft]",
        },
      },
    ],
    coords: [8.52, 35.08],
  },
  {
    slug: "yamaalogii-walal",
    type: "woreda",
    name: { en: "Yemalogi Welel", om: "Yamaalogii Walal", am: "[AM draft]" },
    tagline: {
      en: "Land of Mount Walal at 3,335 m — birthplace of Oliqa Dingil, hero of the Sayo highlands.",
      om: "Lafa Tulluu Walaal — meetira 3,335; dhaloota Oliiqaa Dingil, goota baddaa Sayyoo.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Mount Walal, Yemalogi Welel", om: "[OM] Tulluu Walaal, Yamaalogii Walal", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "149,984" },
      { label: ELEV_LABEL, value: "1,500–3,335 m" },
      { label: CAPITAL_LABEL, value: { en: "Tajo", om: "Taajoo", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Yemalogi Welel lies in the north, 42 km from Dembi Dolo. Mount Walal rises to 3,335 m — recorded as Ethiopia's third-highest mountain.",
        om: "Yamaalogii Walal kaaba godinaatti, Dambi Doolloo irraa km 42 argamti. Tulluun Walaal meetira 3,335 olka'a — tulluu sadaffaa guddaa Itoophiyaa.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Mountain and hero", om: "Tulluu fi goota", am: "[AM draft]" },
        paragraphs: [
          {
            en: "At Deentaa Garee the hero Oliqa Dingil Booka was born around 1890. On 23 May 1929 he took to the forest and won major battles against the colonial forces.",
            om: "Deentaa Garee keessatti gootni Oliiqaa Dingil Bookaa bara tilmaamaan 1890 dhalate. Caamsaa 23, 1929 bosona seenee waraana gurguddoo injifate.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Coffee and grain grow across a climate of 35% dega, 45% woyinadega and 20% kola.",
            om: "Buna fi midhaan haala qilleensaa Baddaa 35%, Woyina Deega 45% fi Kola 20% keessatti oomishamu.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Mount Walal", om: "Tulluu Walaal", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Trails and wide highland views, 42 km from Dembi Dolo; the Gumguma Cave lies 45 km out.",
            om: "Daandii miilaa fi ilaalcha bal'aa — km 42 Dambi Doolloo irraa; Holqa Gumgumaa km 45 irratti argama.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "oliqa-dingil-booka",
        name: { en: "Oliqa Dingil Booka", om: "Oliiqaa Dingil Bookaa", am: "[AM draft]" },
        years: "c.1890–1930s",
        role: {
          en: "Hero of the Sayo highlands — anti-colonial leader.",
          om: "Goota Baddaa Sayyoo — qabsoo ittisa koloneeffataa.", am: "[AM draft]",
        },
        image: "/img/oliqaa-dingil.jpg",
      },
    ],
    coords: [8.72, 34.98],
  },
  {
    slug: "anfilloo",
    type: "woreda",
    name: { en: "Anfillo", om: "Anfilloo", am: "[AM draft]" },
    tagline: {
      en: "The south-west frontier — Gargeda forest, big wildlife and recorded gold.",
      om: "Daangaa kibba-dhihaa — bosona Gargeedaa, bineensota gurguddoo fi warqee.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Anfillo forest", om: "[OM] Bosona Anfilloo", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "121,671" },
      { label: ELEV_LABEL, value: "500–2,500 m" },
      { label: CAPITAL_LABEL, value: { en: "Mugi", om: "Mugii", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Anfillo is the south-west frontier, 42 km from Dembi Dolo. The Gargeda forest holds elephant, lion, leopard and buffalo, and EMA 1988 records gold and uranium.",
        om: "Anfilloo daangaa kibba-dhihaa, Dambi Doolloo irraa km 42 argamti. Bosonni Gargeedaa arba, leenca, qeerroo fi gafarsa qaba; ragni EMA 1988 warqee fi yuureniyam ibsa.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Forest, wildlife and minerals", om: "Bosona, bineensota fi mineraala", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Annual rainfall around 2,141 mm is among the highest in the zone. Protecting these forests protects the zone's wealth.",
            om: "Roobni waggaa mm 2,141 godina keessaa isa guddaa keessaa tokko. Bosona eeguun qabeenya godinaa eeguu dha.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Forest coffee", om: "Buna bosonaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Forest coffee thrives in the shade of Gargeda and the Shebel manmade forest.",
            om: "Buna bosonaa gaaddisa Gargeedaa fi bosona dhaabame Sheebellii jalatti guddata.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Gargeda Natural Forest", om: "Bosona Gargeedaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A protected mix of natural and planted cover, 42 km from Dembi Dolo.",
            om: "Bosona eegamaa — uumamaa fi dhaabame walitti maku; km 42 Dambi Doolloo irraa.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.58, 34.5],
  },
  {
    slug: "gidaamii",
    type: "woreda",
    name: { en: "Gidami", om: "Gidaamii", am: "[AM draft]" },
    tagline: {
      en: "The western border woreda — on the Sudan frontier, home to Garjeedaa forest and the story of Jote Tulu.",
      om: "Aanaa daangaa dhihaa — Sudaan waliin daangaa qabdi; bosona Garjeedaa fi seenaa Jootee Tulluu.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Gidami, western border", om: "[OM] Gidaamii, daangaa dhihaa", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "132,620" },
      { label: ELEV_LABEL, value: "1,450–2,200 m" },
      { label: CAPITAL_LABEL, value: { en: "Gidami", om: "Gidaamii", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Gidami is the western woreda, 688 km from Finfinnee and bordering Sudan. The lowest point at Waro Koyan falls below 500 m.",
        om: "Gidaamii aanaa dhiha godinaa ti — Finfinnee irraa km 688, Sudaan daangeffamti. Bakki gadi aanaan Waro Koyan meetira 500 gadi bu'a.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Western frontier and history", om: "Daangaa dhihaa fi seenaa", am: "[AM draft]" },
        paragraphs: [
          {
            en: "In 1884 E.C. King Jote Tulu moved his seat of government to Gidami, and the town bears that name to this day.",
            om: "Bara 1884 A.L.I. Mootiin Jootee Tulluu teessoo mootummaa isaa gara Gidaamiitti jijjiire — magaalaan kun hanga ammaatti maqaa isaa qabdi.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Trade and coffee", om: "Daldala fi buna", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The economy depends 95% on farming and livestock; Waro Koyan is the border trading post with Sudan.",
            om: "Diinagdeen ishee qonnaa fi horii irratti 95% hundaa'a; Waro Koyan bakka daldala daangaati.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Garjeedaa forest and Kara Kawe Cave", om: "Bosona Garjeedaa fi Holqa Kaaraa Kawe", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The nationally known Garjeedaa forest and the Kara Kawe Cave (153 km from Dembi Dolo) are listed attractions.",
            om: "Bosonni Garjeedaa sadarkaa biyyaatti beekamaa fi Holqa Kaaraa Kawe (km 153 Dambi Doolloo irraa) bakka daawwannaa ti.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "gidaamii-guus-agaloo",
        name: { en: "Gidami Guus Agalo", om: "Gidaamii Guus Agaloo", am: "[AM draft]" },
        years: "19th c.",
        role: {
          en: "Hunter and founder figure — one account traces the town's name to him.",
          om: "Adamsituu fi ijaaraa magaalaa Gidaamii — akka yaada lammaffaatti maqaan isaa irraa dhufe.", am: "[AM draft]",
        },
      },
    ],
    coords: [8.98, 34.38],
  },
  {
    slug: "laaloo-qilee",
    type: "woreda",
    name: { en: "Lalo Kile", om: "Laaloo Qilee", am: "[AM draft]" },
    tagline: {
      en: "Hill country with a deep name — Lalo (son of Jahan Sayo) and Kile (the hot spring).",
      om: "Biyya tulluu fi seenaa — maqaan Lalo (ilma Jahaa Sayyoo) fi Kile (madda o'aa) irraa dhufe.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Lalo Kile hills", om: "[OM] Tulluuwwan Laaloo Qilee", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "103,505" },
      { label: CAPITAL_LABEL, value: { en: "Lalo", om: "Laaloo", am: "[AM draft]" } },
      { label: KEY_LABEL, value: { en: "Coffee & grain", om: "Buna fi midhaan", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Lalo Kile is one of the zone's twelve woredas. Elders say it has governed itself since 1874 E.C.; it stood alone in 1994.",
        om: "Laaloo Qilee aanaalee 12 godinaa keessaa tokko. Maanguddoonni bara 1874 A.L.I. irraa bulchiinsa mataa ishee akka qabdu dubbatu; bara 1994 of danda'e.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "A woreda with a deep name", om: "Aanaa maqaa gadi fagoo qabdu", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The name joins two roots: Lalo, the son of Jahan Sayo of the Machaa Oromo, and Kile, the hot spring beside the Kile river.",
            om: "Maqaan ishee lamaan walitti makamee dhufe: Laaloo, ilma Jahaa Sayyoo, fi Kile, madda o'aa laga Kilee bira.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "About 90% of its people live rurally, making their living from farming. EMA 1988 records gold and platinum; platinum extraction is beginning.",
            om: "Uummata ishee 90% baadiyyaa keessa jiraata. Ragni EMA 1988 warqee fi pilaatiiniyam ibsa — pilaatiiniyamiin baasuun jalqabaa jira.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "The Kile hot spring", om: "Madda o'aa Kilee", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The hot spring in Marfo Kebele gives the woreda half its name.",
            om: "Maddi o'aa ganda Marfoo keessatti jiru walakkaa maqaa aanaa kanaati.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.7, 35.3],
  },
  {
    slug: "sadii-canqaa",
    type: "woreda",
    name: { en: "Sadi Chanka", om: "Sadii Canqaa", am: "[AM draft]" },
    tagline: {
      en: "The woreda of Sadii Akkayyuu, a 17th-century pioneer, on the main Finfinnee–Dembi Dolo road.",
      om: "Aanaa seenaa Sadii Akkayyuu — goota jaarraa 17ffaa; daandii guddaa Finfinnee–Dambi Doolloo ishee jidduu darba.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Sadi Chanka, along the main road", om: "[OM] Sadii Canqaa, daandii guddaa bira", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "116,095" },
      { label: CAPITAL_LABEL, value: { en: "Chanka", om: "Canqaa", am: "[AM draft]" } },
      { label: KEY_LABEL, value: { en: "Coffee & grain", om: "Buna fi midhaan", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Sadi Chanka was separated from Dale Wabera in 2010. The main Finfinnee–Dembi Dolo asphalt road cuts through Chanka, making it a stopover for travellers.",
        om: "Sadii Canqaa bara 2010 Daallee Waabaraa irraa adda baate. Daandii asfaaltii guddaan Finfinnee–Dambi Doolloo Canqaa keessa darba.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Named by a pioneer", om: "Aanaa gootaatiin moggaafamte", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The 17th-century pioneer Sadii Akkayyuu settled here when his ox lay down and refused to rise, founding Biyya Sadii — from which Sadi Chanka derives.",
            om: "Gootichi Sadii Akkayyuu jaarraa 17ffaa keessa sangaan isaa ciisee ka'uu didnaan achumatti buufate, 'Biyya Sadii' moggaase — achii 'Sadii Canqaa' dhufe.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Coffee and grain", om: "Buna fi midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A hot 85% kola climate supports coffee and grain; rivers Keto, Kuni, Bururi and Adami drain it.",
            om: "Haalli qilleensaa Kola 85% buna fi midhaan gargaara; lageen Kettoo, Kunii, Bururii fi Adaamii ishee jidduu yaa'u.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Kuni Falls and Kuni Cave", om: "Finchaa Kunii fi Holqa Kunii", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Kuni Waterfall and Cave, 75 km from Dembi Dolo — one visit, two sights.",
            om: "Finchaa Kunii fi Holqa Kunii — km 75 Dambi Doolloo irraa; daawwannaa bakka tokkoo lama.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [
      {
        slug: "sadi-akkayyu",
        name: { en: "Sadi Akkayyu", om: "Sadii Akkayyuu", am: "[AM draft]" },
        years: "mid-1600s",
        role: {
          en: "17th-century pioneer who founded Biyya Sadii, after whom Sadi Chanka is named.",
          om: "Goota jaarraa 17ffaa — Biyya Sadii bu'uureffate; maqaan isaa Sadii Canqaa jedhame.", am: "[AM draft]",
        },
      },
    ],
    coords: [8.63, 35.2],
  },
  {
    slug: "jimmaa-horroo",
    type: "woreda",
    name: { en: "Jimma Horo", om: "Jimmaa Horroo", am: "[AM draft]" },
    tagline: {
      en: "A northern woreda of 201+ springs, the protected Sira Rejji forest and wide grain fields.",
      om: "Aanaa kaaba godinaa — madda bishaanii 201+, bosona Siiraa Rejjii eegamaa fi midhaan bal'aa.", am: "[AM draft]",
    },
    heroImage: HERO,
    heroAlt: { en: "Jimma Horo grain fields", om: "[OM] Lafa midhaanii Jimmaa Horroo", am: "[AM draft]" },
    quickFacts: [
      { label: POP_LABEL, value: "75,783" },
      { label: CLIMATE_LABEL, value: { en: "19.7% dega · 48.5% woyinadega · 31.8% kola", om: "Baddaa 19.7% · Woyina Deega 48.5% · Kola 31.8%", am: "[AM draft]" } },
      { label: KEY_LABEL, value: { en: "Grain", om: "Midhaan", am: "[AM draft]" } },
    ],
    intro: [
      {
        en: "Jimma Horo is a northern woreda between Gawo Kebe and Gidami. Over 201 springs rise in it, and natural vegetation covers 14,632 ha.",
        om: "Jimmaa Horroo aanaa kaaba godinaa ti, Gaawoo Qeebbee fi Gidaamii gidduutti argamti. Madda bishaanii 201 ol jira; bosona uumamaa hektaara 14,632 qabdi.", am: "[AM draft]",
      },
    ],
    sections: [
      {
        kicker: { en: "History & naming", om: "Seenaa fi maqaa", am: "[AM draft]" },
        title: { en: "Springs and forest", om: "Madda bishaanii fi bosona", am: "[AM draft]" },
        paragraphs: [
          {
            en: "The protected Sira Rejji forest (4,632 ha) holds wild animals — water buck, golden jackal, lion, buffalo, warthog and hippo — and more than 73 bird species.",
            om: "Bosonni Siiraa Rejjii (hektaara 4,632) bineensota bosonaa — water buck, golden jackal, leenca, gafarsa, booyyee fi roobii — fi simbirroota gosa 73 ol qaba.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
        title: { en: "Grain", om: "Midhaan", am: "[AM draft]" },
        paragraphs: [
          {
            en: "Grain, coffee and livestock are the base of village life; 22 farmers' associations organise it.",
            om: "Midhaan, buna fi horiin jireenya gandaaf bu'uura; waldaalee qonnaa 22 jiru.", am: "[AM draft]",
          },
        ],
      },
      {
        kicker: { en: "Attractions", om: "Bakkaalee", am: "[AM draft]" },
        title: { en: "Sira Rejji Forest", om: "Bosona Siiraa Rejjii", am: "[AM draft]" },
        paragraphs: [
          {
            en: "A protected forest of 4,632 ha — home to birds and wild animals.",
            om: "Bosona eegamaa — hektaara 4,632; simbirrootni fi bineensonni keessa jiraatu.", am: "[AM draft]",
          },
        ],
      },
    ],
    people: [],
    coords: [8.92, 34.82],
  },
];

export const placeSlugs = PLACES.map((place) => place.slug);

export function getPlace(slug: string): Place | undefined {
  return PLACES.find((place) => place.slug === slug);
}

/** Adapt a Place into PlaceCard props (single source for list pages + previews). */
export function toPlaceCardData(place: Place): import("@/components/cards").PlaceCardData {
  const population = place.quickFacts.find((fact) => fact.label.en === "Population");
  const statValue =
    population && typeof population.value === "string"
      ? population.value
      : population && typeof population.value === "object"
        ? population.value.en
        : "";

  return {
    slug: place.slug,
    name: place.name,
    teaser: place.tagline,
    image: place.heroImage,
    statLabel: population?.label ?? { en: "Population", om: "Uummata", am: "[AM draft]" },
    statValue,
  };
}
