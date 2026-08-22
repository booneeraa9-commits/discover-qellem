import type { LocalizedText } from "@/lib/i18n";

// Zone timeline placeholder data (demo dates). The shape mirrors what the CMS
// will return in Sprint 3; content will be reviewed by the content agent.

export interface TimelineEvent {
  year: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
}

export const TIMELINE: TimelineEvent[] = [
  {
    year: { en: "mid-1600s", om: "mid-1600s", am: "[AM draft]" },
    title: { en: "Sadii Akkayyuu — Biyya Sadii", om: "Sadii Akkayyuu — Biyya Sadii", am: "[AM draft]" },
    text: {
      en: "Pioneer Sadii Akkayyuu travelled from Odaa Nabee into western Oromia, claimed land and named it Biyya Sadii — root of today's Sadi Chanka.",
      om: "Gootichi Sadii Akkayyuu Odaa Nabee irraa ka'ee dhiha Oromiyaatti imale; lafa qabatee 'Biyya Sadii' moggaase — achii Sadii Canqaa maqaa argatte.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1874", om: "1874", am: "[AM draft]" },
    title: { en: "Lalo Kile gains its administration", om: "Laaloo Qilee bulchiinsa argatte", am: "[AM draft]" },
    text: {
      en: "Elders record that Lalo Kile has governed itself since 1874 E.C.",
      om: "Akka maanguddootti, aanaan Laaloo Qilee bara 1874 irraa bulchiinsa mataa ishee qabdi.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1884", om: "1884", am: "[AM draft]" },
    title: { en: "Jote Tulu moves to Gidami", om: "Jootee Tulluu gara Gidaamiitti", am: "[AM draft]" },
    text: {
      en: "After campaigning against the Afteer clan, Jote Tulu moved his seat of government to Gidami.",
      om: "Jootee Tulluu qomoo 'Afteer' irratti loluun booda teessoo mootummaa isaa gara Gidaamiitti jijjiire.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1898/1903", om: "1898/1903", am: "[AM draft]" },
    title: { en: "The founding of Dembi Dolo", om: "Hundeeffama Dambi Doolloo", am: "[AM draft]" },
    text: {
      en: "Oral records place Dembi Dolo's founding in 1898 or 1903 — beneath the dambi tree where Obbo Dolloo and traders rested.",
      om: "Ragaaleen afaanii hundeeffama Dambi Doolloo bara 1898 ykn 1903 dubbatu — muka dambii jalatti Obbo Dolloo fi daldaltoonni boqatan.", am: "[AM draft]",
    },
  },
  {
    year: { en: "c.1890", om: "c.1890", am: "[AM draft]" },
    title: { en: "Birth of Oliqa Dingil Booka", om: "Dhaloota Oliiqaa Dingil Bookaa", am: "[AM draft]" },
    text: {
      en: "Oliqa Dingil was born at Deentaa Garee, Gurraatti Walal in Yemalogi Welel.",
      om: "Oliiqaa Dingil Yamaalogii Walal, Deentaa Garee keessatti dhalate.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1929", om: "1929", am: "[AM draft]" },
    title: { en: "The resistance of Oliqa Dingil", om: "Qabsoo Oliiqaa Dingil", am: "[AM draft]" },
    text: {
      en: "On 23 May 1929 Oliqa Dingil took to the forest and led anti-colonial resistance, winning battles at Finchoofi Dubbisi and Tajo.",
      om: "Caamsaa 23, 1929 Oliiqaa Dingil bosona seenee qabsoo geggeesse; Fiincoofi Dubbisi fi Taajoo keessatti injifannoo galmeesse.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1933", om: "1933", am: "[AM draft]" },
    title: { en: "Dembi Dolo municipality", om: "Bulchiinsa magaalaa Dambi Doolloo", am: "[AM draft]" },
    text: {
      en: "Dembi Dolo municipal administration was founded in 1933 E.C.",
      om: "Bulchiinsi magaalaa Dambi Doolloo bara 1933 A.L.I hundeefame.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1941", om: "1941", am: "[AM draft]" },
    title: { en: "Legal recognition", om: "Beekamtii seeraa", am: "[AM draft]" },
    text: {
      en: "Dembi Dolo gained legal recognition in 1941.",
      om: "Dambi Doolloo bara 1941 beekamtii seeraa argatte.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1943", om: "1943", am: "[AM draft]" },
    title: { en: "The birth of Dr Negasso Gidada", om: "Dhaloota Dr. Nagaasoo Gidaadaa", am: "[AM draft]" },
    text: {
      en: "Dr Negasso Gidada was born in Dembi Dolo on 8 September 1943.",
      om: "Fulbaana 8, 1943 Dr. Nagaasoo Gidaadaa Dambi Doolloo keessatti dhalate.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1995–2001", om: "1995–2001", am: "[AM draft]" },
    title: { en: "Presidency of the FDRE", om: "Pireezidaantii FDRE", am: "[AM draft]" },
    text: {
      en: "Dr Negasso Gidada served as the first President of the FDRE.",
      om: "Dr. Nagaasoo Gidaadaa Pireezidaantii FDRE isa jalqabaa ta'e.", am: "[AM draft]",
    },
  },
  {
    year: { en: "1998", om: "1998", am: "[AM draft]" },
    title: { en: "Zonal capital; new woredas", om: "Magaalaa guddittii godinaa; aanaalee haaraa", am: "[AM draft]" },
    text: {
      en: "Dembi Dolo became zonal capital in 1998; Gawo Kebe and Yemalogi Welel were demarcated in January 1998.",
      om: "Dambi Doolloo bara 1998 magaalaa guddittii godinaa taate; Gaawoo Qeebbee fi Yamaalogii Walal Amajjii 1998 adda baafaman.", am: "[AM draft]",
    },
  },
  {
    year: { en: "2010", om: "2010", am: "[AM draft]" },
    title: { en: "Sadi Chanka stands alone", om: "Sadii Canqaa of dandaate", am: "[AM draft]" },
    text: {
      en: "Sadi Chanka was separated from Dale Wabera in 2010.",
      om: "Sadii Canqaa bara 2010 Daallee Waabaraa irraa adda baate.", am: "[AM draft]",
    },
  },
  {
    year: { en: "2026", om: "2026", am: "[AM draft]" },
    title: { en: "Dembi Dolo project inauguration", om: "Eebba pirojektoota Dambi Doolloo", am: "[AM draft]" },
    text: {
      en: "Projects worth more than 650 million Birr were inaugurated — the Grand Oliqa Dingil Hall, city corridor, clusters, the Science Café and the city road network.",
      om: "Pirojektoonni qarshii Miliyoona 650 oliin ijaaraman — Galma Oliiqaa Dingil, kooridarii magaalaa, kilaasterota, Kaaffee Tekinooloojii fi marfata magaalichaa — eebbifaman.", am: "[AM draft]",
    },
  },
];
