import type { LocalizedText } from "@/lib/i18n";
import type { PersonCardData, SponsorCardData, SupporterCardData } from "@/components/cards";

// Zone-level local typed data for the home page (notables, glance table,
// sponsors marquee) and the support page (sponsors + supporters). Swapping to
// CMS props in #30 keeps the same shapes.

export interface GlanceRow {
  label: LocalizedText;
  value: string | LocalizedText;
  note?: LocalizedText;
}

// Verified zone facts (qa/CONTENT_FACTS.md §1 / §3a).
export const ZONE_GLANCE: GlanceRow[] = [
  {
    label: { en: "Region", om: "Naannoo", am: "[AM draft]" },
    value: { en: "Oromia", om: "Oromiyaa", am: "[AM draft]" },
    note: { en: "Administrative", om: "Bulchiinsa", am: "[AM draft]" },
  },
  {
    label: { en: "Zone", om: "Godina", am: "[AM draft]" },
    value: { en: "Kellem Wollega", om: "Qeellam Wallaggaa", am: "[AM draft]" },
  },
  {
    label: { en: "Capital", om: "Magaalaa Guddoo", am: "[AM draft]" },
    value: { en: "Dembi Dolo", om: "Dambi Doolloo", am: "[AM draft]" },
    note: { en: "652 km from Finfinnee", om: "Finfinnee irraa km 652", am: "[AM draft]" },
  },
  {
    label: { en: "Area", om: "Bal'ina", am: "[AM draft]" },
    value: "≈ 9,857 km²",
    note: { en: "2.9% of Oromia", om: "2.9% Oromiyaa", am: "[AM draft]" },
  },
  {
    label: { en: "Woredas & town", om: "Aanaalee fi Magaalaa", am: "[AM draft]" },
    value: { en: "11 + 1 town", om: "11 + magaalaa 1", am: "[AM draft]" },
    note: { en: "258 rural + 31 urban kebeles", om: "Gandoota 258 + 31", am: "[AM draft]" },
  },
  {
    label: { en: "Population (2023/24)", om: "Baay'ina Uummataa (2016 A.L.I)", am: "[AM draft]" },
    value: "1,254,817",
    note: { en: "Zone profile projection", om: "Tilmaama ragaa godinaa", am: "[AM draft]" },
  },
  {
    label: { en: "Population (2007)", om: "Baay'ina Uummataa (2007)", am: "[AM draft]" },
    value: "797,666",
    note: { en: "ESS census", om: "ESS", am: "[AM draft]" },
  },
  {
    label: { en: "Climate", om: "Haala Qilleensaa", am: "[AM draft]" },
    value: { en: "Woyinadega 47% · Kola 39% · Dega 14%", om: "Woyina Deega 47% · Kola 39% · Baddaa 14%", am: "[AM draft]" },
  },
  {
    label: { en: "Coffee (2023/24)", om: "Buna (2016 A.L.I)", am: "[AM draft]" },
    value: { en: "134,213 tonnes", om: "Toonnii 134,213", am: "[AM draft]" },
    note: { en: "from 484,841 ha", om: "Hektaara 484,841 irraa", am: "[AM draft]" },
  },
  {
    label: { en: "Livestock (2023/24)", om: "Horii (2016 A.L.I)", am: "[AM draft]" },
    value: "6,721,429",
    note: { en: "incl. 1,634,514 cattle", om: "Loon 1,634,514 dabalatee", am: "[AM draft]" },
  },
  {
    label: { en: "Beehives", om: "Gaagura dammaa", am: "[AM draft]" },
    value: { en: "473,300 (2015)", om: "473,300 (2015)", am: "[AM draft]" },
    note: { en: "339,193 (2016)", om: "339,193 (2016)", am: "[AM draft]" },
  },
  {
    label: { en: "Education", om: "Barnoota", am: "[AM draft]" },
    value: { en: "452 primary, 50 secondary, 1 university", om: "MB 452, MS 50, Yuunivarsiitii 1", am: "[AM draft]" },
    note: { en: "348,516 students", om: "Barattoota 348,516", am: "[AM draft]" },
  },
  {
    label: { en: "Health", om: "Fayyaa", am: "[AM draft]" },
    value: { en: "4 hospitals, 51 health centres, 256 posts", om: "Hosp. 4, BC 51, KP 256", am: "[AM draft]" },
  },
  {
    label: { en: "Cooperatives", om: "Waldaalee", am: "[AM draft]" },
    value: "817",
    note: { en: "156,500 members", om: "Miseensota 156,500", am: "[AM draft]" },
  },
  {
    label: { en: "Ethnicity (2007)", om: "Sanyii (2007)", am: "[AM draft]" },
    value: { en: "Oromo 94.8% · Amhara 4.01%", om: "Oromoo 94.8% · Amaaraa 4.01%", am: "[AM draft]" },
    note: { en: "ESS", om: "ESS", am: "[AM draft]" },
  },
  {
    label: { en: "Language (2007)", om: "Afaan (2007)", am: "[AM draft]" },
    value: { en: "Afaan Oromoo 96.31% · Amharic 3.13%", om: "Afaan Oromoo 96.31% · Amaariffa 3.13%", am: "[AM draft]" },
  },
  {
    label: { en: "Religion (2007)", om: "Amantaa (2007)", am: "[AM draft]" },
    value: { en: "Protestant 42.5% · Orthodox 34% · Muslim 21%", om: "Protestantii 42.5% · Ortodoksii 34% · Islaama 21%", am: "[AM draft]" },
  },
  {
    label: { en: "Minerals", om: "Mineraalota", am: "[AM draft]" },
    value: { en: "Gold, platinum, tantalum, uranium", om: "Warqee, Pilaatiiniyam, Tantaalam, Yuureniyam", am: "[AM draft]" },
    note: { en: "EMA 1988", om: "EMA 1988", am: "[AM draft]" },
  },
];

// Zone-wide notable people (also reachable from woreda pages).
export const ZONE_PEOPLE: PersonCardData[] = [
  {
    slug: "dr-negasso-gidada",
    name: { en: "Dr. Negasso Gidada", om: "Dr. Nagaasoo Gidaadaa", am: "[AM draft]" },
    years: "1943–2019",
    role: {
      en: "First President of the FDRE (1995–2001)",
      om: "Pireezidaantii FDRE isa jalqabaa (1995–2001)", am: "[AM draft]",
    },
    image: "/img/dr-nagaasoo.jpg",
  },
  {
    slug: "oliqa-dingil-booka",
    name: { en: "Oliqa Dingil Booka", om: "Oliiqaa Dingil Bookaa", am: "[AM draft]" },
    years: "c.1890–1930s",
    role: {
      en: "Hero of the Sayo highlands — anti-colonial leader",
      om: "Goota Baddaa Sayyoo — qabsoo ittisa koloneeffataa", am: "[AM draft]",
    },
    image: "/img/oliqaa-dingil.jpg",
  },
  {
    slug: "jote-tulu",
    name: { en: "Jote Tulu (Dejazmach)", om: "Jootee Tulluu", am: "[AM draft]" },
    years: "d. 1932",
    role: {
      en: "Ruler of Leqa Qellem — King of Sayo",
      om: "Abbaa Bulchaa Leqaa Qellem — Mootii Sayyoo", am: "[AM draft]",
    },
  },
  {
    slug: "sadi-akkayyu",
    name: { en: "Sadi Akkayyu", om: "Sadii Akkayyuu", am: "[AM draft]" },
    years: "mid-1600s",
    role: {
      en: "17th-century pioneer — founder of Biyya Sadii",
      om: "Goota jaarraa 17ffaa — Biyya Sadii bu'uureffataa", am: "[AM draft]",
    },
  },
  {
    slug: "gidami-guus-agalo",
    name: { en: "Gidami Guus Agalo", om: "Gidaamii Guus Agaloo", am: "[AM draft]" },
    years: "19th c.",
    role: {
      en: "Hunter and founder figure of Gidami town",
      om: "Adamsituu fi ijaaraa magaalaa Gidaamii", am: "[AM draft]",
    },
  },
  {
    slug: "jaal-laggasa-wagi-metta",
    name: { en: "Jaal Laggasa Wagi Metta", om: "Jaal Laggasaa Wagii Meettaa", am: "[AM draft]" },
    years: "1960–",
    role: {
      en: "Revolutionary and western Oromia leader",
      om: "Qabsaa'aa fi hogganaa dhiha Oromiyaa", am: "[AM draft]",
    },
  },
];

// Trusted partners shown in the sponsors marquee (and support page).
export const ZONE_SPONSORS: SponsorCardData[] = [
  {
    name: { en: "Kellem Wollega Zone Administration", om: "Bulchiinsa Godina Qeellam Wallaggaa", am: "[AM draft]" },
    href: "/support",
    initials: "KW",
    tint: "brand",
  },
  {
    name: { en: "Kellem Wollega Communication Office", om: "Waajjiira Oduu Godina Qeellam", am: "[AM draft]" },
    href: "/support",
    initials: "CO",
    tint: "gold",
  },
  {
    name: { en: "Dembi Dolo University", om: "Yuunivarsiitii Dambi Doolloo", am: "[AM draft]" },
    href: "/support",
    initials: "DD",
    tint: "brand",
  },
  {
    name: { en: "Dembi Dolo City Administration", om: "Bulchiinsa Magaalaa Dambi Doolloo", am: "[AM draft]" },
    href: "/support",
    initials: "DC",
    tint: "gold",
  },
  {
    name: { en: "Zone Agriculture Office", om: "Waajjira Qonnaa Godinaa", am: "[AM draft]" },
    href: "/support",
    initials: "AG",
    tint: "brand",
  },
  {
    name: { en: "Zone Culture & Tourism Office", om: "Waajjira Tuurizimii Godinaa", am: "[AM draft]" },
    href: "/support",
    initials: "CT",
    tint: "gold",
  },
  {
    name: { en: "Oromia Science & Technology Auth.", om: "Waajjira Saayinsii fi Teek.", am: "[AM draft]" },
    href: "/support",
    initials: "ST",
    tint: "brand",
  },
  {
    name: { en: "Kellem Coffee Cooperatives Union", om: "Waldaa Bunaa Qeellam", am: "[AM draft]" },
    href: "/support",
    initials: "KC",
    tint: "gold",
  },
  {
    name: { en: "Oromia Roads Authority", om: "Abbaa Taayitaa Daandii Oromiyaa", am: "[AM draft]" },
    href: "/support",
    initials: "OR",
    tint: "brand",
  },
  {
    name: { en: "Cultural Heritage Authority", om: "Dhaabbata Qabeenya Biyyoolessaa", am: "[AM draft]" },
    href: "/support",
    initials: "CH",
    tint: "gold",
  },
];

// Project supporters / patrons (shown on the support page).
export const ZONE_SUPPORTERS: SupporterCardData[] = [
  {
    name: { en: "Ato Gammachuu Gurmesa", om: "Obbo Gammachuu Gurmeessaa", am: "[AM draft]" },
    role: { en: "Chief Administrator, Kellem Wollega Zone", om: "Bulchaa Godina Qeellam Wallaggaa", am: "[AM draft]" },
    initials: "GG",
  },
  {
    name: { en: "Ato Girma Dangala", om: "Obbo Girmaa Dangalaa", am: "[AM draft]" },
    role: { en: "Mayor, Dembi Dolo City", om: "Kantiibaa Magaalaa Dambi Doolloo", am: "[AM draft]" },
    initials: "GD",
  },
  {
    name: { en: "Dr. Utukana Odaa", om: "Dr. Utukaanaa Odaa", am: "[AM draft]" },
    role: {
      en: "Deputy Head, Office of the President, Oromia",
      om: "Itt. Hoog. Waajjira Pirezidaantii Oromiyaa", am: "[AM draft]",
    },
    initials: "UO",
  },
  {
    name: { en: "Kellem Culture & Tourism Office", om: "Waajjira Tuurizimii Qeellam", am: "[AM draft]" },
    role: { en: "Research & photography partner", om: "Deeggarsa qorannoo fi suuraa", am: "[AM draft]" },
    initials: "KT",
  },
  {
    name: { en: "The People of Kellem Wollega", om: "Hawaasa Qeellam Wallaggaa", am: "[AM draft]" },
    role: { en: "The story and soul of this site", om: "Seenaa fi qabeenya — hundee fuula kanaa", am: "[AM draft]" },
    initials: "HW",
  },
  {
    name: { en: "Farmers & Cooperatives", om: "Qonnaan bultootaa fi Waldaalee", am: "[AM draft]" },
    role: { en: "817 co-ops, 156,500 members", om: "817 waldaalee, miseensota 156,500", am: "[AM draft]" },
    initials: "FW",
  },
];
