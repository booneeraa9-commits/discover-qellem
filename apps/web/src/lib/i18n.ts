// Bilingual EN/OM string system (scaffold) — now tri-lingual (om | en | am).
//
// This module is intentionally free of any React dependency and of any
// "use client" directive so it can be imported from both server and client
// components. The React binding (provider, useT hook, <T> component) lives in
// ./i18n-client.
//
// Language rules (see CONTRIBUTING.md):
//   - Afaan Oromoo (om) is the authoritative content language; EN is reviewed.
//   - Amharic (am) is scaffolded as "[AM draft]" placeholders. Editors will
//     finalize real Amharic via Wagtail before deploy — do not hand-translate.
//   - Strings that are not yet translated carry a "[OM] " (Oromo) or
//     "[AM draft]" (Amharic) marker so reviewers can spot them at a glance.
//     See TODO(i18n) notes below.

export type Lang = "om" | "en" | "am";

/** A string expressed in the three supported languages. OM is authoritative;
 *  EN is the review copy; AM is a draft placeholder until editors fill it. */
export interface LocalizedText {
  en: string;
  om: string;
  am: string;
}

/** Resolve a localized string for the active language, falling back to English. */
export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.en;
}

// "am" is part of the Lang union but is intentionally NOT selectable in the
// language switcher yet (disabled "Coming soon" option). It stays here so the
// type system forces am-awareness across the codebase.
export const LANGS: readonly Lang[] = ["om", "en", "am"];

export const DEFAULT_LANG: Lang = "en";

export const LANG_STORAGE_KEY = "dq_lang";
export const LANG_COOKIE = "dq_lang";

export const dict: Record<Lang, Record<string, string>> = {
  en: {
    "brand.title": "Discover Qellem",
    "brand.sub": "Kellem Wollega · Oromia",

    "nav.home": "Home",
    "nav.places": "Places",
    "nav.news": "News",
    "nav.history": "History",
    "nav.support": "Support",
    "nav.main": "Primary",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",

    "lang.switch": "Switch language",
    "theme.toggle": "Toggle dark mode",

    // Language menu (endonyms are proper nouns — shown untranslated).
    "lang.menu": "Language",
    "lang.amComingSoon": "Coming soon",
    "lang.name.om": "Afaan Oromoo",
    "lang.name.en": "English",
    "lang.name.am": "አማርኛ",

    "common.readMore": "Read more",

    "skip.content": "Skip to content",

    "lightbox.label": "Photo viewer",
    "lightbox.close": "Close",
    "lightbox.previous": "Previous",
    "lightbox.next": "Next",
    "lightbox.open": "Open photo",

    "footer.about":
      "A verified, living guide to Kellem Wollega Zone — its twelve woredas and town, history, people and places. Built from official zone sources, the Kellem Wollega Zone Communication Office, and community knowledge.",
    "footer.explore": "Explore",
    "footer.resources": "Resources",
    "footer.contact": "Contact",
    "footer.contribute": "Contribute a story",
    "footer.aboutProject": "About",
    "footer.rights": "All rights reserved.",
    "footer.staff": "Staff",
    "footer.sources": "Sources: Zone profile 2015/16 E.C.",
    "footer.contact.location": "Dembi Dolo, Kellem Wollega",
    "footer.social.mail": "Email",
    "footer.social.site": "Website",
    "footer.social.news": "News",
    "footer.install": "Install app",

    "install.banner.title": "Install Discover Qellem",
    "install.banner.sub": "Add to your home screen for fast, offline access.",
    "install.banner.install": "Install",
    "install.banner.dismiss": "Dismiss",
    "install.ios.title": "Add to Home Screen",
    "install.ios.sub": "Tap the Share icon, then tap Add to Home Screen.",

    "offline.title": "You are offline",
    "offline.sub": "Check your connection and try again.",
    "offline.retry": "Try again",

    "home.hero.imageAlt": "Golden highlands sunset over Kellem Wollega",
    "home.hero.kicker": "Kellem Wollega Zone · Oromia",
    "home.hero.title.1": "A land of green horizons,",
    "home.hero.title.2": "deep roots,",
    "home.hero.title.3": "and open skies.",
    "home.hero.tagline":
      "Kellem Wollega is the western frontier of Oromia — coffee, the Dati Walal forests, rivers and living Oromo culture. Twelve woredas and towns, each with a story of its own. Explore verified facts, people, history and the latest projects shaping the zone today.",
    "home.cta.explore": "Explore woredas",
    "home.cta.support": "Support us",

    "home.quickfacts.population.label": "Population",
    "home.quickfacts.population.value": "1,254,817",
    "home.quickfacts.area.label": "Zone area",
    "home.quickfacts.area.value": "≈ 9,857 km²",
    "home.quickfacts.woredas.label": "Woredas & town",
    "home.quickfacts.woredas.value": "12",
    "home.quickfacts.coffee.label": "Coffee produced",
    "home.quickfacts.coffee.value": "134,213 t",

    "home.stats.kicker": "At a glance",
    "home.stats.title": "Zone at a Glance",
    "home.stats.sub": "Key figures from official sources (2015 & 2016 E.C.).",
    "home.stats.population.label": "Population (2023/24)",
    "home.stats.population.sub": "Zone profile projection",
    "home.stats.area.label": "Zone area",
    "home.stats.area.sub": "2.9% of Oromia",
    "home.stats.woredas.label": "Woredas & town",
    "home.stats.woredas.sub": "289 kebeles",
    "home.stats.coffee.label": "Coffee produced",
    "home.stats.coffee.sub": "tonnes / year",
    "home.stats.livestock.label": "Livestock",
    "home.stats.livestock.sub": "incl. 1,634,514 cattle",
    "home.stats.beehives.label": "Beehives",
    "home.stats.beehives.sub": "339,193 in 2016",

    "home.features.kicker": "What defines Kellem",
    "home.features.title": "A zone of remarkable diversity",
    "home.features.sub":
      "From coffee to the Dati Walal forests, from minerals to living markets — Kellem holds extraordinary natural and cultural wealth.",
    "home.features.explore.title": "Explore the Zone",
    "home.features.explore.text":
      "Eleven woredas and one town — each with a dedicated page, its own history, key facts, attractions, notable people and location map.",
    "home.features.history.title": "History & Culture",
    "home.features.history.text": "From Sayyoo to today — a history drawn from named sources.",
    "home.features.visit.title": "Plan Your Visit",
    "home.features.visit.text": "Seasons, routes and respect — make your visit a welcome one.",

    "home.map.kicker": "Map",
    "home.map.title": "Zone Map",
    "home.map.sub": "Tap a place to open its page.",

    "home.glance.kicker": "Verified facts",
    "home.glance.title": "The zone in numbers",
    "home.glance.sub": "Key figures from official sources (2015 & 2016 E.C.).",
    "home.glance.col.indicator": "Indicator",
    "home.glance.col.value": "Value",
    "home.glance.col.note": "Note",

    "home.woredas.kicker": "Explore by place",
    "home.woredas.title": "Explore the woredas",
    "home.woredas.sub": "Eleven woredas and one town — each with a dedicated page, its own history and key facts.",
    "home.woredas.viewAll": "View all woredas & towns",

    "home.news.kicker": "Fresh",
    "home.news.title": "Latest news",
    "home.news.sub": "Recent news and events from across the zone.",
    "home.news.viewAll": "All news & events",

    "home.notable.kicker": "People",
    "home.notable.title": "Notable Figures",

    "home.support.kicker": "Support Us",
    "home.support.title": "Your support makes it real",
    "home.support.sub": "Accurate content, photography and stories grow with your support.",
    "home.support.cta": "Make a contribution",

    "place.breadcrumb": "Breadcrumb",
    "place.type.woreda": "Woreda",
    "place.type.capital": "Capital",
    "place.intro.kicker": "About",
    "place.intro.title": "Know {name} beyond the name.",
    "place.notable.kicker": "People",
    "place.notable.title": "Notable Figures",
    "place.visit.kicker": "Location",
    "place.visit.title": "Plan your visit",
    "place.map.comingSoon": "Interactive map coming soon",
    "place.map.title": "Map of {name}",
    "place.map.open": "Open in OpenStreetMap",
    "place.back": "Back to places",

    "place.section.history": "History",
    "place.section.economy": "Economy",
    "place.section.culture": "Culture",
    "place.section.geography": "Geography",
    "place.section.attractions": "Attractions",

    "places.title": "Woredas & Towns",
    "places.sub":
      "Eleven woredas and one town — each with a dedicated page, its own history, key facts, attractions, notable people and location map.",

    "news.title": "News & Events",
    "news.sub": "From across the zone — news and upcoming events.",
    "news.filter.all": "All",
    "news.readMore": "Read more",
    "news.back": "Back to news",

    "pagination.prev": "Previous",
    "pagination.next": "Next",
    "pagination.page": "Page",

    "history.kicker": "History",
    "history.title": "The History of Kellem Wollega",
    "history.sub": "From Sayyoo to today — a history drawn from named sources.",
    "history.timeline.title": "Key events",

    "support.kicker": "Support Us",
    "support.title": "Your support makes it real",
    "support.sub":
      "Accurate content, photography and stories grow with your support. Chapa payments coming soon.",
    "support.donate": "Make a contribution",
    "support.comingSoon": "Coming soon",
    "support.toast.comingSoon": "Donations coming soon",
    "support.sponsors.kicker": "Trusted by",
    "support.sponsors.title": "Our partners & supporters",
    "support.sponsors.sub":
      "Public institutions, cooperatives and community bodies helping bring Discover Qellem to life.",
    "support.supporters.title": "Wall of supporters",
    "support.supporters.sub":
      "Institutions, leaders and community members who have championed this project.",

    "contribute.kicker": "Contribute a story",
    "contribute.title": "Share your story",
    "contribute.sub": "Send a story, photo or correction — no account needed.",
    "contribute.name": "Your name",
    "contribute.email": "Email (optional)",
    "contribute.titleField": "Title",
    "contribute.story": "Write your story here",
    "contribute.photo": "Photo (optional)",
    "contribute.submit": "Send",
    "contribute.toast.comingSoon": "Submissions coming soon",

    "staff.kicker": "Staff",
    "staff.title": "Editorial sign-in",
    "staff.sub": "Editors and administrators only.",
    "staff.cta": "Open Wagtail admin",

    "about.kicker": "About",
    "about.body":
      "This site is published in Afaan Oromoo and English. Every fact is drawn from official zone sources and verified Oromo source documents.",

    "article.source": "Source: Zone profile (2015/16 E.C.) and Oromo source book.",
    "article.share": "Share",
    "article.copyLink": "Copy link",
    "article.gallery.title": "Gallery",
    "article.copied": "Link copied",

    "notfound.title": "Page not found",
    "notfound.sub": "The page you are looking for does not exist.",
    "notfound.back": "Back to home",
  },
  om: {
    "brand.title": "Discover Qellem",
    "brand.sub": "Qeellam Wallaggaa · Oromiyaa",

    "nav.home": "Fuula",
    "nav.places": "Bakkaalee",
    "nav.news": "Oduu",
    "nav.history": "Seenaa",
    "nav.support": "Nu Deeggari",
    // TODO(i18n): get reviewed OM for these a11y/action labels from the content agent.
    "nav.main": "[OM] Primary",
    "nav.openMenu": "[OM] Open menu",
    "nav.closeMenu": "[OM] Close menu",

    "lang.switch": "[OM] Switch language",
    "theme.toggle": "[OM] Toggle dark mode",

    // Language menu (endonyms are proper nouns — shown untranslated).
    "lang.menu": "Afaan",
    "lang.amComingSoon": "Dhiyootti",
    "lang.name.om": "Afaan Oromoo",
    "lang.name.en": "English",
    "lang.name.am": "አማርኛ",

    "common.readMore": "Dabalataan ilaali",

    // TODO(i18n): get reviewed OM for the skip link from the content agent.
    "skip.content": "[OM] Skip to content",

    // TODO(i18n): get reviewed OM for the lightbox label from the content agent.
    "lightbox.label": "[OM] Photo viewer",
    "lightbox.close": "Cufi",
    "lightbox.previous": "Duraa",
    "lightbox.next": "Itti aanu",
    "lightbox.open": "[OM] Open photo",

    "footer.about":
      "Qajeelfama jiraataa Qeellam Wallaggaa — aanaalee fi magaalota 12, seenaa, namoota fi bakkaalee. Ragaawwan ofiisaalii, Waajjira Oduu Godina Qeellam Wallaggaa fi beekumsa hawaasaa irraa ijaarame.",
    "footer.explore": "Daawwadhuu",
    // TODO(i18n): get reviewed OM for this column heading from the content agent.
    "footer.resources": "[OM] Resources",
    "footer.contact": "Quunnamtii",
    "footer.contribute": "Seenaa ergi",
    "footer.aboutProject": "Waa'ee",
    "footer.rights": "Mirgi dhalaa eegamaadha.",
    "footer.staff": "Hojjettoota",
    "footer.sources": "Madda: Ragaalee Waajjira Godinaa 2015/16 A.L.I.",
    "footer.contact.location": "Dambi Doolloo, Qeellam Wallaggaa",
    "footer.social.mail": "Imeelii",
    // TODO(i18n): get reviewed OM for these social link labels from the content agent.
    "footer.social.site": "[OM] Website",
    "footer.social.news": "Oduu",
    "footer.install": "[OM] Install app",

    "install.banner.title": "Discover Qellem buufadhuu",
    "install.banner.sub": "Offline akka hojjetuuf fuula jalqabaa keessatti itti dabali.",
    "install.banner.install": "Buufadhuu",
    "install.banner.dismiss": "Cufi",
    // TODO(i18n): get reviewed OM for the iOS install tip from the content agent.
    "install.ios.title": "[OM] Add to Home Screen",
    "install.ios.sub": "[OM] Tap the Share icon, then tap Add to Home Screen.",

    "offline.title": "Interneeta hin qabdu",
    "offline.sub": "Qunnamtii kee ilaaliitii irra deebi'i yaali.",
    "offline.retry": "Irra deebi'i yaali",

    // TODO(i18n): get reviewed OM for the hero image alt text from the content agent.
    "home.hero.imageAlt": "[OM] Golden highlands sunset over Kellem Wollega",
    "home.hero.kicker": "Godina Qeellam Wallaggaa · Oromiyaa",
    "home.hero.title.1": "Lafa Margaa,",
    "home.hero.title.2": "Hundee Gadi Fageessoo,",
    "home.hero.title.3": "Sammii Banaa.",
    "home.hero.tagline":
      "Qeellam Wallaggaa godina Oromiyaa keessaa isa dhihaati — buna, bosona Dhaatii Walaal, lagee fi aadaa Oromoo kan hawwatu. Aanaalee fi magaalota 12 — tokkoon tokkoon isaanii seenaa mataa isaa qaba. Ragaa mirkanaa'e, namoota, seenaa fi pirojektoota haarawa argadhu.",
    "home.cta.explore": "Aanaalee daawwadhuu",
    "home.cta.support": "Nu deeggari",

    "home.quickfacts.population.label": "Uummata",
    "home.quickfacts.population.value": "1,254,817",
    "home.quickfacts.area.label": "Bal'ina Godinaa",
    "home.quickfacts.area.value": "≈ 9,857 km²",
    "home.quickfacts.woredas.label": "Aanaalee & Magaalaa",
    "home.quickfacts.woredas.value": "12",
    "home.quickfacts.coffee.label": "Oomisha Bunaa",
    "home.quickfacts.coffee.value": "134,213 t",

    "home.stats.kicker": "Gabaabinaan",
    "home.stats.title": "Godina Gabaabinaan",
    "home.stats.sub": "Ragaa waliigalaa ragaa ofiisaalii irraa (2015 fi 2016 A.L.I).",
    "home.stats.population.label": "Baay'ina Uummataa (2016 A.L.I)",
    "home.stats.population.sub": "Tilmaama ragaa godinaa",
    "home.stats.area.label": "Bal'ina Godinaa",
    "home.stats.area.sub": "2.9% Oromiyaa",
    "home.stats.woredas.label": "Aanaalee & Magaalaa",
    "home.stats.woredas.sub": "Gandoota 289",
    "home.stats.coffee.label": "Oomisha Bunaa",
    "home.stats.coffee.sub": "toonnii / waggaa",
    "home.stats.livestock.label": "Horii",
    "home.stats.livestock.sub": "Loon 1,634,514 dabalatee",
    "home.stats.beehives.label": "Gaagura dammaa",
    "home.stats.beehives.sub": "339,193 (2016)",

    "home.features.kicker": "Maaltu Qeellam adda taasisu",
    "home.features.title": "Qabeenyaa fi aadaa adda addaa",
    "home.features.sub":
      "Buna irraa hamma bosona Dhaatii Walaal, mineraala irraa hamma gabaa jireessoo — Qeellam ogummaa fi qabeenyaa uumamaa of keessaa qaba.",
    // TODO(i18n): get reviewed OM for these feature titles from the content agent.
    "home.features.explore.title": "[OM] Explore the Zone",
    "home.features.explore.text":
      "Aanaalee 11 fi magaalaa 1 — tokkoon tokkoon isaanii fuula, seenaa, ragaa fi kaartaa mataa isaa qaba.",
    "home.features.history.title": "Seenaa fi Aadaa",
    "home.features.history.text": "Sayyoo irraa hamma har'aa — seenaa madda beekamaa irraa.",
    "home.features.visit.title": "[OM] Plan Your Visit",
    "home.features.visit.text": "Yeroo, karaa fi kabajaa — daawwannaan kee fudhatamaa haa ta'u.",

    "home.map.kicker": "Kaartaa",
    "home.map.title": "Kaartaa Godina",
    "home.map.sub": "Bakka cuqaasi fuula isaa bana.",

    "home.glance.kicker": "Ragaalee mirkanaa'an",
    // TODO(i18n): get reviewed OM for these home section headings from the content agent.
    "home.glance.title": "[OM] The zone in numbers",
    "home.glance.sub": "Ragaa waliigalaa ragaa ofiisaalii irraa (2015 fi 2016 A.L.I).",
    "home.glance.col.indicator": "Qabxii",
    "home.glance.col.value": "Galmaa",
    "home.glance.col.note": "Yaadni",

    "home.woredas.kicker": "Bakkaa bakkatti",
    "home.woredas.title": "Aanaalee daawwadhuu",
    "home.woredas.sub": "Aanaalee 11 fi magaalaa 1 — tokkoon tokkoon isaanii fuula, seenaa fi ragaa mataa isaa qaba.",
    "home.woredas.viewAll": "Aanaalee hunda ilaali",

    "home.news.kicker": "Haaraa",
    "home.news.title": "Oduu dhiyoo",
    "home.news.sub": "Oduu fi taateewwan dhiyoo godina keessaa.",
    "home.news.viewAll": "Oduu hunda ilaali",

    "home.notable.kicker": "Namoota",
    "home.notable.title": "Namoota Beekkamoo",

    "home.support.kicker": "Nu Deeggari",
    "home.support.title": "Gumaachi kee ni jijjiira",
    "home.support.sub": "Odeeffannoo sirrii, suuraa fi seenota — gumaacha keessaniin ni guddatu.",
    "home.support.cta": "Gumaacha kenni",

    // TODO(i18n): get reviewed OM for these place-page labels from the content agent.
    "place.breadcrumb": "[OM] Breadcrumb",
    "place.type.woreda": "Aanaa",
    "place.type.capital": "Magaalaa Guddoo",
    "place.intro.kicker": "Waa'ee",
    "place.intro.title": "{name} maqaa isaa ol beeki.",
    "place.notable.kicker": "Namoota",
    "place.notable.title": "Namoota Beekkamoo",
    "place.visit.kicker": "Iddoo",
    "place.visit.title": "Daawwannaa qopheessaa",
    "place.map.comingSoon": "[OM] Interactive map coming soon",
    "place.map.title": "[OM] Map of {name}",
    "place.map.open": "[OM] Open in OpenStreetMap",
    "place.back": "Gara bakkaaleetti deebi'i",

    "place.section.history": "Seenaa",
    "place.section.economy": "Dinagdee",
    "place.section.culture": "Aadaa",
    "place.section.geography": "Naannoo",
    "place.section.attractions": "Bakkaalee",

    "places.title": "Aanaalee fi Magaalota",
    "places.sub":
      "Aanaalee 11 fi magaalaa 1 — tokkoon tokkoon isaanii fuula, seenaa, ragaa fi kaartaa mataa isaa qaba.",

    "news.title": "Oduu fi Taateewwan",
    "news.sub": "Taateewwan godina keessaa — oduu fi sagantaa dhiyoo.",
    "news.filter.all": "Hunda",
    "news.readMore": "Dabalataan ilaali",
    "news.back": "Gara oduutti deebi'i",

    "pagination.prev": "Duraa",
    "pagination.next": "Itti aanu",
    // TODO(i18n): get reviewed OM for the pagination label from the content agent.
    "pagination.page": "[OM] Page",

    "history.kicker": "Seenaa",
    "history.title": "Seenaa Godina Qeellam Wallaggaa",
    "history.sub": "Sayyoo irraa hamma har'aa — seenaa madda beekamaa irraa.",
    "history.timeline.title": "Taateewwan gurguddoo",

    "support.kicker": "Nu Deeggari",
    "support.title": "Gumaachi kee ni jijjiira",
    "support.sub":
      "Odeeffannoo sirrii, suuraa fi seenota — gumaacha keessaniin ni guddatu. Kaffaltiin Chapa dhiyootti dhufa.",
    "support.donate": "Gumaacha kenni",
    "support.comingSoon": "Dhiyootti",
    "support.toast.comingSoon": "Gumaachi dhiyootti",
    "support.sponsors.kicker": "Miseensota fi Deeggartoota",
    "support.sponsors.title": "Deeggartoota fi michoota keenya",
    "support.sponsors.sub":
      "Dhaabbilee mootummaa, waldaalee fi qaamolee hawaasaa Discover Qellem jabeessan.",
    "support.supporters.title": "Dhaabbi Deeggartootaa",
    "support.supporters.sub":
      "Dhaabbilee, hogganoota fi miseensota hawaasaa pirojektichaaf gahee olaanaa qaban.",

    "contribute.kicker": "Seenaa ergi",
    "contribute.title": "Seenaa kee qoodi",
    "contribute.sub": "Seenaa, suuraa ykn sirreessa ergi — galmeen hin barbaachisu.",
    "contribute.name": "Maqaa kee",
    "contribute.email": "Imeelii (filatamaa)",
    // TODO(i18n): get reviewed OM for these form labels from the content agent.
    "contribute.titleField": "[OM] Title",
    "contribute.story": "Seenaa kee as barreessi",
    "contribute.photo": "[OM] Photo (optional)",
    "contribute.submit": "Ergi",
    "contribute.toast.comingSoon": "[OM] Submissions coming soon",

    "staff.kicker": "Hojjettoota",
    // TODO(i18n): get reviewed OM for the staff page from the content agent.
    "staff.title": "[OM] Editorial sign-in",
    "staff.sub": "Editori fi bulchiinsaaf qofa.",
    "staff.cta": "[OM] Open Wagtail admin",

    "about.kicker": "Waa'ee",
    "about.body":
      "Fuulli kun afaan lamaaniin — Afaan Oromoo fi Ingiliffaan — qophaa'eera. Qabeenyi fi ragnni hundi ragaa ofiisaalii irraa dhufe.",

    "article.source": "Madda: Ragaa waajjira godinaa (2015/16 A.L.I) fi kuusaa Afaan Oromoo.",
    // TODO(i18n): get reviewed OM for the share row from the content agent.
    "article.share": "[OM] Share",
    "article.copyLink": "[OM] Copy link",
    "article.gallery.title": "Suuraalee",
    "article.copied": "[OM] Link copied",

    "notfound.title": "Fuulli argamuu hin dandeenye",
    "notfound.sub": "Barbaaddaa jirtu fuulli jiraachuu dide.",
    "notfound.back": "Gara fuula duraa deebi'i",
  },
  am: {
    "brand.title": "[AM draft]",
    "brand.sub": "[AM draft]",
    "nav.home": "[AM draft]",
    "nav.places": "[AM draft]",
    "nav.news": "[AM draft]",
    "nav.history": "[AM draft]",
    "nav.support": "[AM draft]",
    "nav.main": "[AM draft]",
    "nav.openMenu": "[AM draft]",
    "nav.closeMenu": "[AM draft]",
    "lang.switch": "[AM draft]",
    "theme.toggle": "[AM draft]",
    "lang.menu": "[AM draft]",
    "lang.amComingSoon": "[AM draft]",
    "lang.name.om": "Afaan Oromoo",
    "lang.name.en": "English",
    "lang.name.am": "አማርኛ",
    "common.readMore": "[AM draft]",
    "skip.content": "[AM draft]",
    "lightbox.label": "[AM draft]",
    "lightbox.close": "[AM draft]",
    "lightbox.previous": "[AM draft]",
    "lightbox.next": "[AM draft]",
    "lightbox.open": "[AM draft]",
    "footer.about": "[AM draft]",
    "footer.explore": "[AM draft]",
    "footer.resources": "[AM draft]",
    "footer.contact": "[AM draft]",
    "footer.contribute": "[AM draft]",
    "footer.aboutProject": "[AM draft]",
    "footer.rights": "[AM draft]",
    "footer.staff": "[AM draft]",
    "footer.sources": "[AM draft]",
    "footer.contact.location": "[AM draft]",
    "footer.social.mail": "[AM draft]",
    "footer.social.site": "[AM draft]",
    "footer.social.news": "[AM draft]",
    "footer.install": "[AM draft]",
    "install.banner.title": "[AM draft]",
    "install.banner.sub": "[AM draft]",
    "install.banner.install": "[AM draft]",
    "install.banner.dismiss": "[AM draft]",
    "install.ios.title": "[AM draft]",
    "install.ios.sub": "[AM draft]",
    "offline.title": "[AM draft]",
    "offline.sub": "[AM draft]",
    "offline.retry": "[AM draft]",
    "home.hero.imageAlt": "[AM draft]",
    "home.hero.kicker": "[AM draft]",
    "home.hero.title.1": "[AM draft]",
    "home.hero.title.2": "[AM draft]",
    "home.hero.title.3": "[AM draft]",
    "home.hero.tagline": "[AM draft]",
    "home.cta.explore": "[AM draft]",
    "home.cta.support": "[AM draft]",
    "home.quickfacts.population.label": "[AM draft]",
    "home.quickfacts.population.value": "[AM draft]",
    "home.quickfacts.area.label": "[AM draft]",
    "home.quickfacts.area.value": "[AM draft]",
    "home.quickfacts.woredas.label": "[AM draft]",
    "home.quickfacts.woredas.value": "[AM draft]",
    "home.quickfacts.coffee.label": "[AM draft]",
    "home.quickfacts.coffee.value": "[AM draft]",
    "home.stats.kicker": "[AM draft]",
    "home.stats.title": "[AM draft]",
    "home.stats.sub": "[AM draft]",
    "home.stats.population.label": "[AM draft]",
    "home.stats.population.sub": "[AM draft]",
    "home.stats.area.label": "[AM draft]",
    "home.stats.area.sub": "[AM draft]",
    "home.stats.woredas.label": "[AM draft]",
    "home.stats.woredas.sub": "[AM draft]",
    "home.stats.coffee.label": "[AM draft]",
    "home.stats.coffee.sub": "[AM draft]",
    "home.stats.livestock.label": "[AM draft]",
    "home.stats.livestock.sub": "[AM draft]",
    "home.stats.beehives.label": "[AM draft]",
    "home.stats.beehives.sub": "[AM draft]",
    "home.features.kicker": "[AM draft]",
    "home.features.title": "[AM draft]",
    "home.features.sub": "[AM draft]",
    "home.features.explore.title": "[AM draft]",
    "home.features.explore.text": "[AM draft]",
    "home.features.history.title": "[AM draft]",
    "home.features.history.text": "[AM draft]",
    "home.features.visit.title": "[AM draft]",
    "home.features.visit.text": "[AM draft]",
    "home.map.kicker": "[AM draft]",
    "home.map.title": "[AM draft]",
    "home.map.sub": "[AM draft]",
    "home.glance.kicker": "[AM draft]",
    "home.glance.title": "[AM draft]",
    "home.glance.sub": "[AM draft]",
    "home.glance.col.indicator": "[AM draft]",
    "home.glance.col.value": "[AM draft]",
    "home.glance.col.note": "[AM draft]",
    "home.woredas.kicker": "[AM draft]",
    "home.woredas.title": "[AM draft]",
    "home.woredas.sub": "[AM draft]",
    "home.woredas.viewAll": "[AM draft]",
    "home.news.kicker": "[AM draft]",
    "home.news.title": "[AM draft]",
    "home.news.sub": "[AM draft]",
    "home.news.viewAll": "[AM draft]",
    "home.notable.kicker": "[AM draft]",
    "home.notable.title": "[AM draft]",
    "home.support.kicker": "[AM draft]",
    "home.support.title": "[AM draft]",
    "home.support.sub": "[AM draft]",
    "home.support.cta": "[AM draft]",
    "place.breadcrumb": "[AM draft]",
    "place.type.woreda": "[AM draft]",
    "place.type.capital": "[AM draft]",
    "place.intro.kicker": "[AM draft]",
    "place.intro.title": "[AM draft]",
    "place.notable.kicker": "[AM draft]",
    "place.notable.title": "[AM draft]",
    "place.visit.kicker": "[AM draft]",
    "place.visit.title": "[AM draft]",
    "place.map.comingSoon": "[AM draft]",
    "place.map.title": "[AM draft]",
    "place.map.open": "[AM draft]",
    "place.back": "[AM draft]",

    "place.section.history": "[AM draft]",
    "place.section.economy": "[AM draft]",
    "place.section.culture": "[AM draft]",
    "place.section.geography": "[AM draft]",
    "place.section.attractions": "[AM draft]",
    "places.title": "[AM draft]",
    "places.sub": "[AM draft]",
    "news.title": "[AM draft]",
    "news.sub": "[AM draft]",
    "news.filter.all": "[AM draft]",
    "news.readMore": "[AM draft]",
    "news.back": "[AM draft]",
    "pagination.prev": "[AM draft]",
    "pagination.next": "[AM draft]",
    "pagination.page": "[AM draft]",
    "history.kicker": "[AM draft]",
    "history.title": "[AM draft]",
    "history.sub": "[AM draft]",
    "history.timeline.title": "[AM draft]",
    "support.kicker": "[AM draft]",
    "support.title": "[AM draft]",
    "support.sub": "[AM draft]",
    "support.donate": "[AM draft]",
    "support.comingSoon": "[AM draft]",
    "support.toast.comingSoon": "[AM draft]",
    "support.sponsors.kicker": "[AM draft]",
    "support.sponsors.title": "[AM draft]",
    "support.sponsors.sub": "[AM draft]",
    "support.supporters.title": "[AM draft]",
    "support.supporters.sub": "[AM draft]",
    "contribute.kicker": "[AM draft]",
    "contribute.title": "[AM draft]",
    "contribute.sub": "[AM draft]",
    "contribute.name": "[AM draft]",
    "contribute.email": "[AM draft]",
    "contribute.titleField": "[AM draft]",
    "contribute.story": "[AM draft]",
    "contribute.photo": "[AM draft]",
    "contribute.submit": "[AM draft]",
    "contribute.toast.comingSoon": "[AM draft]",
    "staff.kicker": "[AM draft]",
    "staff.title": "[AM draft]",
    "staff.sub": "[AM draft]",
    "staff.cta": "[AM draft]",
    "about.kicker": "[AM draft]",
    "about.body": "[AM draft]",
    "article.source": "[AM draft]",
    "article.share": "[AM draft]",
    "article.copyLink": "[AM draft]",
    "article.gallery.title": "[AM draft]",
    "article.copied": "[AM draft]",
    "notfound.title": "[AM draft]",
    "notfound.sub": "[AM draft]",
    "notfound.back": "[AM draft]",
  },
};

/**
 * Translate `key` for `lang`, falling back to English, then to the raw key.
 * A raw key in the UI is always a bug, so it is better to show the key than
 * to render nothing.
 */
export function translate(lang: Lang, key: string): string {
  return dict[lang][key] ?? dict[DEFAULT_LANG][key] ?? key;
}
