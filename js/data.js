/* ============================================================
   Discover Qellem — verified data (real facts from extracted texts)
   ============================================================ */

const IMG = {
  // Real uploaded photos (Discover Qellem / Kellem Wollega)
  hero:        'img/hero.jpg',            // Golden highlands sunset (matches the uploaded preview)
  dembiSky:    'img/project2.jpg',         // Dembi Dolo city fountain / main road
  dembiCity:   'img/project2.jpg',         // Main avenue of Dembi Dolo
  dembiHall:   'img/project6.jpg',         // Oliiqaa Dingil Grand Hall interior
  dembiHall2:  'img/project13.jpg',        // Hall during large event
  inauguration1:'img/project1.jpg',        // Ribbon cutting
  inauguration3:'img/project3.jpg',        // Ceremony with pink hats
  gidamiAerial:'img/gidami-aerial.jpg',    // Aerial of Gidami woreda
  drNegaasoo:  'img/dr-nagaasoo.jpg',      // Portrait Dr. Negasso Gidada
  oliiqaaDingil:'img/oliqaa-dingil.jpg',   // Portrait Oliiqaa Dingil Booka
  scienceCafe: 'img/project2.jpg',         // Dembi Dolo Science Cafe area (same fountain)

  // Unsplash (placeholders where real photos not yet available — clearly tagged in README)
  coffee1:  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=70',
  coffee2:  'https://images.unsplash.com/photo-1524350876685-274059332603?w=1200&auto=format&fit=crop&q=70',
  forest1:  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=70',
  forest2:  'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&auto=format&fit=crop&q=70',
  hills1:   'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=70',
  hills2:   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=70',
  valley:   'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=70',
  market:   'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1200&auto=format&fit=crop&q=70',
  village:  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&auto=format&fit=crop&q=70',
  river:    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=70',
  mountain: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&auto=format&fit=crop&q=70',
  culture:  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&auto=format&fit=crop&q=70',
  people:   'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&auto=format&fit=crop&q=70',
  grain:    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop&q=70',
  falls:    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=70',
  sunset:   'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop&q=70'
};

const DATA = {
  i18n: {
    en: {
      announce:"Verified content from the Kellem Wollega zone profile · 2015/16 E.C. — freshly updated with project inauguration news.",
      brandTitle:"Discover Qellem", brandSub:"Kellem Wollega · Oromia",
      navHome:"Home", navPlaces:"Woredas & Towns", navNews:"News & Events",
      navStories:"Stories", navHistory:"History", navSupport:"Support",
      explore:"Explore", getInvolved:"Get involved", contribute:"Contribute a story",
      about:"About", contact:"Contact", rights:"All rights reserved.",
      staff:"Staff", sources:"Sources: Zone profile 2015/16 E.C. · Kellem Wollega Communication Office · Oromo source book · ESS 2007 · EMA 1988",
      footerAbout:"A verified, living guide to Kellem Wollega Zone — its twelve woredas and town, history, people and places. Built from official zone sources, the Kellem Wollega Zone Communication Office, and community knowledge.",
      heroKicker:"Kellem Wollega Zone · Oromia",
      heroLine1:"A land of green horizons,",
      heroLine2:"deep roots,",
      heroLine3:"and open skies.",
      heroSub:"Kellem Wollega is the western frontier of Oromia — coffee, the Dati Walal forests, rivers and living Oromo culture. Twelve woredas and towns, each with a story of its own. Explore verified facts, people, history and the latest projects shaping the zone today.",
      ctaExplore:"Explore woredas", ctaSupport:"Support us",
      verifiedOnly:"Only verified sources", bilingual:"Afaan Oromoo / English", offline:"Works offline",
      introKicker:"About Kellem", introTitle:"A remarkable corner of Oromia",
      introP1:"Kellem Wollega is the westernmost of Oromia's zones and the 13th largest, accounting for about 2.9% of the region. It is bordered by West Wollega to the north and east, Benishangul Gumuz to the north-west, Ilu Aba Bora to the south and south-east, Gambella to the west and south-west, and the Republic of Sudan to the far west. Its capital, Dembi Dolo (Dambi Doolloo), lies 652 km west of Finfinnee (Addis Ababa) along the Nekemte–Gimbi corridor.",
      introP2:"Administratively the zone is organised into 11 rural woredas and 1 town administration, together comprising 258 rural and 31 urban kebeles (289 total). Its climate is 47% woyinadega (sub-tropical), 39% kola (tropical/lowland) and 14% dega (temperate highland). Elevations run from below 500 m at Waro Koyan on the Sudan border in Gidami, up to 3,335 m at Mount Walal in Yemalogi Welel — one of the highest peaks in Ethiopia.",
      introP3:"Coffee is the zone's great wealth: suitable coffee land is put at 585,945 hectares, of which 484,841 ha were under coffee in 2016 E.C. (2023/24 G.C.), producing 134,213 tonnes. Beyond coffee the zone holds the Dati Walal National Park, deposits of gold, platinum, tantalum and uranium, over 473,000 beehives, more than 6.7 million livestock, and the historic legacy of figures from Jote Tulu to Dr Negasso Gidada and Oliqa Dingil Booka. Every figure on this site is drawn from the official zone socio-economic profile (2015 & 2016 E.C.), the Oromo source book, the 2007 Population and Housing Census, the Ethiopian Mapping Authority 1988 records, and the Kellem Wollega Zone Communication Office.",
      seeMore:"See more", seeLess:"Show less",
      featuresKicker:"What defines Kellem", featuresTitle:"A zone of remarkable diversity",
      featuresSub:"From coffee to the Dati Walal forests, from minerals to living markets — Kellem holds extraordinary natural and cultural wealth.",
      placesKicker:"Explore by place", placesTitle:"Woredas & Towns",
      placesSub:"Eleven woredas and one town — each with a dedicated page, its own history, key facts, attractions, notable people and location map.",
      newsKicker:"Fresh", newsTitle:"News & Events", newsSub:"From across the zone — news and upcoming events.",
      tabNews:"News", tabEvents:"Events", readMore:"Read more",
      storiesKicker:"Community", storiesTitle:"Community Stories", storiesSub:"Stories of the towns and woredas — life, work and community across Kellem.",
      historyKicker:"History", historyTitle:"The History of Kellem Wollega",
      historySub:"From Sayyoo to today — a history drawn from named sources.",
      supportTitle:"Support Us", supportSub:"Accurate information, honest photography and community stories — all kept alive by your support. Chapa payments coming soon.",
      ctaDonate:"Make a contribution", supportComing:"Coming soon",
      mapKicker:"Map", mapTitle:"Zone Map", mapSub:"Tap a place to open its page.",
      notFound:"Page not found", notFoundSub:"The page you are looking for does not exist.", backHome:"Back to home",
      supportHeroTitle:"Your support makes it real", supportHeroSub:"Accurate content, photography and stories grow with your support. Chapa payments coming soon.",
      impactTitle:"Why it matters",
      allocTitle:"How contributions are used",
      allocResearch:"Content research & writing", allocResearchD:"Verifying sources, community interviews and bilingual writing.",
      allocPhoto:"Photography & maps", allocPhotoD:"Honest photography of places and accurate zone mapping.",
      allocTrans:"Translation Oromo ↔ English", allocTransD:"Keeping both languages clean and complete.",
      allocTech:"Platform & hosting", allocTechD:"Hosting, the offline PWA and maintenance.",
      notableTitle:"Notable Figures", notableKicker:"People",
      planKicker:"Guide", planTitle:"Travel with respect and wonder", planSub:"Seasons, routes and respect — make your visit a welcome one.",
      tableKicker:"At a glance", tableTitle:"Zone at a Glance",
      tableSub:"Key figures from official sources (2015 & 2016 E.C.).",
      shareStory:"Share your story", shareStoryD:"Send a story, photo or correction — no account needed.",
      send:"Send", yourName:"Your name", yourEmail:"Email (optional)", yourPlace:"Woreda / Town", yourStory:"Write your story here",
      staffLogin:"Staff login", username:"Username", password:"Password", login:"Sign in",
      elevation:"Elevation", population:"Population", keyProduct:"Key product", capitalTown:"Capital",
      aboutWoreda:"About", keyFacts:"Key facts", stories:"Stories", places:"Places to discover",
      people:"Notable people", gallery:"Gallery", location:"Location",
      populationShort:"Pop.", elevationShort:"Elev.",
      historyP1:"Kellem is the land of the Sayyoo Oromo, a branch of the Machaa confederation. The town of Dembi Dolo was long known simply as Sayo; its name comes from the dambi tree and Obbo Dolloo, who waited in its shade as traders between Wollega and Gambela rested beneath it. The deep history of this area is one of clans, the gadaa system, farmland and frontier trade.",
      historyP2:"In 1884 E.C., Dejazmach Jote Tulu, ruler of Leqa Qellem, campaigned against the Afteer clan and then moved his seat of government from Sayo to Gidami, turning the western hills into a political centre. Around 1912 European travellers reaching Sayo were received at his seat, leaving early written accounts. Over the following decades the Sayyoo country passed through the centralising imperial state, the Italian occupation and the modern administration; Dembi Dolo municipality was founded in 1933 and legally recognised in 1941.",
      historyP3:"During the Italian occupation (1936–1941), the patriot Oliqa Dingil Booka — 'Hero of the Sayo Highlands' (Goota Baddaa Sayyoo) — led the anti-colonial resistance from Yemalogi Welel, taking to the forest on 23 May 1929 and fighting until his death through poison at Oddoo Butaa. On 8 September 1943, Dr Negasso Gidada — the first President of the Federal Democratic Republic of Ethiopia (1995–2001) — was born in Dembi Dolo. In January 1998 two new woredas (Gawo Kebe and Yemalogi Welel) were demarcated; Sadi Chanka followed in 2010, bringing the zone to its present twelve units. These records come from the zone's Oromo and English source books.",
      timelineHeading:"Key events",
      zonePeopleHeading:"Notable figures",
      planHeading:"Plan your visit", tableHeading:"Zone at a Glance",
      newsAll:"All", newsCatEconomy:"Economy", newsCatEnv:"Environment", newsCatMinerals:"Minerals", newsCatAgri:"Agriculture", newsCatHealth:"Health", newsCatEdu:"Education", newsCatCulture:"Culture", newsCatTrade:"Trade", newsCatDev:"Development",
      prevPhoto:"Previous", nextPhoto:"Next", closeLightbox:"Close", photoOf:"Photo",
      historyHeading:"History & heritage",
      photoCredit:"Official photo",
      galleryComing:"Gallery — tap to view",
      sponsorsKicker:"Trusted by",
      sponsorsTitle:"Our partners & supporters",
      sponsorsSub:"Public institutions, cooperatives and community bodies helping bring Discover Qellem to life.",
      supportersHeading:"Wall of supporters",
      supportersSub:"Institutions, leaders and community members who have championed this project. Add your name by donating or contributing a story.",
      localIntro:"A local introduction",
      knowBeyond:"Know {name} beyond the name.",
      atAGlance:"{name} at a glance",
      historyNaming:"History & naming",
      howGotName:"How {name} got its name.",
      cultureHeading:"The living culture",
      cultureSub:"Food, clothing, music, dance, festivals, ceremonies, arts, traditions and folklore.",
      cultureFood:"Food", cultureFoodD:"Town kitchens and market food — from coffee-ceremony traditions to the shared plates of market days.",
      cultureClothing:"Clothing", cultureClothingD:"Everyday shamma, colourful bullukko and festival dress woven locally and traded in markets.",
      cultureMusic:"Music", cultureMusicD:"Geerarsa, traditional songs and modern Ethiopian sounds from wedding bands to church choirs.",
      cultureDance:"Dance", cultureDanceD:"Shoulder dances at weddings and holidays that draw every generation into the circle.",
      cultureFestivals:"Festivals", cultureFestivalsD:"Irreecha, Christian and Muslim holidays — a community of many calendars.",
      cultureCeremonies:"Ceremonies", cultureCeremoniesD:"Naming feasts, blessings, weddings and the long coffee-ceremony greetings.",
      cultureArts:"Arts & craft", cultureArtsD:"Basketry, weaving and pottery brought in from the countryside for weekly markets.",
      cultureTraditions:"Traditions", cultureTraditionsD:"The long greeting, coffee before questions, and the hospitality of the market square.",
      cultureFolklore:"Folklore", cultureFolkloreD:"Tales of the land, clan founders and the names beneath the modern towns.",
      keepExploring:"Keep exploring",
      moreQellem:"More of Kellem Wollega.",
      helpBuild:"Know a local gem?",
      helpBuildTitle:"Help build Qellem's living archive.",
      helpBuildSub:"Every story, photo and insight you share makes this archive more accurate and more alive.",
      explore:"Explore", seeMore:"See more",
      glanceType:"Type", glanceZone:"Zone", glanceAltitude:"Altitude", glancePopulation:"Population", glanceLanguages:"Languages",
      glanceKeyRole:"Key role", glanceMarketDay:"Market day", glanceAccess:"Access",
      woredaLabel:"Woreda", townLabel:"Town", capitalLabel:"Capital"
    },
    om: {
      announce:"Qeellam Wallaggaa — ragaa waajjira godinaa irraa · 2015/16 A.L.I. — oduu pirojektoota eebbifamaniin haaromfameera.",
      brandTitle:"Discover Qellem", brandSub:"Qeellam Wallaggaa · Oromiyaa",
      navHome:"Fuula", navPlaces:"Aanaalee fi Magaalota", navNews:"Oduu fi Taateewwan",
      navStories:"Seenota", navHistory:"Seenaa", navSupport:"Nu Deeggari",
      explore:"Daawwadhuu", getInvolved:"Hirmaadhuu", contribute:"Seenaa ergi",
      about:"Waa'ee", contact:"Quunnamtii", rights:"Mirgi dhalaa eegamaadha.",
      staff:"Hojjettoota", sources:"Madda: Ragaalee Waajjira Godinaa 2015/16 A.L.I. · Waajjira Oduu Qeellam Wallaggaa · Kuusaa Afaan Oromoo · ESS 2007 · EMA 1988",
      footerAbout:"Qajeelfama jiraataa Qeellam Wallaggaa — aanaalee fi magaalota 12, seenaa, namoota fi bakkaalee. Ragaawwan ofiisaalii, Waajjira Oduu Godina Qeellam Wallaggaa fi beekumsa hawaasaa irraa ijaarame.",
      heroKicker:"Godina Qeellam Wallaggaa · Oromiyaa",
      heroLine1:"Lafa Margaa,",
      heroLine2:"Hundee Gadi Fageessoo,",
      heroLine3:"Sammii Banaa.",
      heroSub:"Qeellam Wallaggaa godina Oromiyaa keessaa isa dhihaati — buna, bosona Dhaatii Walaal, lagee fi aadaa Oromoo kan hawwatu. Aanaalee fi magaalota 12 — tokkoon tokkoon isaanii seenaa mataa isaa qaba. Ragaa mirkanaa'e, namoota, seenaa fi pirojektoota haarawa argadhu.",
      ctaExplore:"Aanaalee daawwadhuu", ctaSupport:"Nu deeggari",
      verifiedOnly:"Ragaa ofiisaalii qofa", bilingual:"Afaan Oromoo / English", offline:"Offline ni hojjeta",
      introKicker:"Waa'ee Qeellam", introTitle:"Kutaa Oromiyaa addaa ta'e",
      introP1:"Qeellam Wallaggaa godina Oromiyaa keessaa isa dhihaa fi guddaa 13ffaa ti. Kaabaa fi bahaan Wallagga Bahaa, kaaba-dhihaan Baniishaangul Gumuz, kibbaa fi kibba-bahaan Illuu Abbaa Booraa, dhihaa fi kibba-dhihaan Gumbelaa fi dhihaan Sudaan daangeffamtee argamti. Magaalaan guddoon ishee Dambi Doolloo — Finfinnee irraa km 652 fagaattee, karaa Naqamtee–Gimbii irraan gahuun ni danda'ama.",
      introP2:"Godinichi aanaa baadiyyaa 11 fi magaalaa bulchiinsa 1 of keessaa qaba; gandoonni baadiyyaa 258 fi magaalaa 31 — walumaa galatti gandoota 289 jiru. Haalli qilleensaa Woyina Deega 47%, Kola 39% fi Baddaa 14% dha. Olka'iinsi lafaa ishee Waro Koyan Gidaamii (Sudaan daangaa) meetira 500 gadi bu'ee hanga Tulluu Walaal Yamaalogii Walal keessatti meetira 3,335 ol ka'a — tulluu sadaffaa guddaa Itoophiyaa.",
      introP3:"Buna qabeenya guddaa godichaa ti: lafti bunaaf mijatu hektaara 585,945 ta'uun beekama; bara 2016 A.L.I. hektaara 484,841 bunaan uwwifamee toonnii 134,213 oomishame. Kana malees Paarkiin Biyyaalessaa Dhaatii Walaal, warqee, pilaatiiniyam, tantaalam, yuureniyam, gaagura dammaa 473,300 ol, horii 6.7 miliyoona ol, fi seenaa Jootee Tulluu, Dr. Nagaasoo Gidaadaa fi Oliiqaa Dingil of keessaa qaba.",
      seeMore:"Dabalataan ilaali", seeLess:"Xiqqee agarsiisi",
      featuresKicker:"Maaltu Qeellam adda taasisu", featuresTitle:"Qabeenyaa fi aadaa adda addaa",
      featuresSub:"Buna irraa hamma bosona Dhaatii Walaal, mineraala irraa hamma gabaa jireessoo — Qeellam ogummaa fi qabeenyaa uumamaa of keessaa qaba.",
      placesKicker:"Bakkaa bakkatti", placesTitle:"Aanaalee fi Magaalota",
      placesSub:"Aanaalee 11 fi magaalaa 1 — tokkoon tokkoon isaanii fuula, seenaa, ragaa fi kaartaa mataa isaa qaba.",
      newsKicker:"Haaraa", newsTitle:"Oduu fi Taateewwan", newsSub:"Taateewwan godina keessaa — oduu fi sagantaa dhiyoo.",
      tabNews:"Oduu", tabEvents:"Taateewwan", readMore:"Dabalataan ilaali",
      storiesKicker:"Hawaasa", storiesTitle:"Seenota Hawaasaa", storiesSub:"Seenota magaalaa fi aanaalee — jireenya, hojii fi hawaasa Qeellam.",
      historyKicker:"Seenaa", historyTitle:"Seenaa Godina Qeellam Wallaggaa",
      historySub:"Sayyoo irraa hamma har'aa — seenaa madda beekamaa irraa.",
      supportTitle:"Nu Deeggari", supportSub:"Odeeffannoo sirrii, suuraa amanamaa fi seenota hawaasaa — gumaacha keessaniin jiraata. Kaffaltiin Chapa dhiyootti dhufa.",
      ctaDonate:"Gumaacha kenni", supportComing:"Dhiyootti",
      mapKicker:"Kaartaa", mapTitle:"Kaartaa Godina", mapSub:"Bakka cuqaasi fuula isaa bana.",
      notFound:"Fuulli argamuu hin dandeenye", notFoundSub:"Barbaaddaa jirtu fuulli jiraachuu dide.", backHome:"Gara fuula duraa deebi'i",
      supportHeroTitle:"Gumaachi kee ni jijjiira", supportHeroSub:"Odeeffannoo sirrii, suuraa fi seenota — gumaacha keessaniin ni guddatu.",
      impactTitle:"Maaliif barbaachisa",
      allocTitle:"Gumaachi akkamitti fayyada",
      allocResearch:"Qo'annoo fi barreeffama seenaa", allocResearchD:"Ragaalee maddisiisuu, gaaffii hawaasaa fi barreeffama afaan lamaaniin.",
      allocPhoto:"Suuraa fi kaartaa", allocPhotoD:"Suuraa amanamaa bakkaalee fi kaartaa godinaa sirrii.",
      allocTrans:"Hiikkaa Oromoo ↔ English", allocTransD:"Afaan lamaan qulqullinaan akka jiraatuuf.",
      allocTech:"Teeknooloojii fi marsariitii", allocTechD:"Hosting, PWA fi eegumsa sirnaa.",
      notableTitle:"Namoota Beekkamoo", notableKicker:"Namoota",
      planKicker:"Qajeelfama", planTitle:"Daawwannaa Kabajaan", planSub:"Yeroo, karaa fi kabajaa — daawwannaan kee fudhatamaa haa ta'u.",
      tableKicker:"Gabaabinaan", tableTitle:"Godina Gabaabinaan",
      tableSub:"Ragaa waliigalaa ragaa ofiisaalii irraa (2015 fi 2016 A.L.I).",
      shareStory:"Seenaa kee qoodi", shareStoryD:"Seenaa, suuraa ykn sirreessa ergi — galmeen hin barbaachisu.",
      send:"Ergi", yourName:"Maqaa kee", yourEmail:"Imeelii (filatamaa)", yourPlace:"Aanaa / Magaalaa", yourStory:"Seenaa kee as barreessi",
      staffLogin:"Seensa Hojjettootaa", username:"Maqaa fayyadamaa", password:"Jecha icciitii", login:"Seensaa",
      elevation:"Olka'iinsa", population:"Uummata", keyProduct:"Oomisha ijoo", capitalTown:"Magaalaa Guddoo",
      aboutWoreda:"Waa'ee", keyFacts:"Ragaa Ijoo", stories:"Seenota", places:"Bakkaalee",
      people:"Namoota Beekkamoo", gallery:"Suuraalee", location:"Iddoo",
      populationShort:"Uum.", elevationShort:"Olka.",
      historyP1:"Qeellam lafa Sayyoo Oromoo dha — gosa Maccaa keessaa. Magaalaan Dambi Doolloo yeroo dheeraaf maqaa Sayyoo jedhamti turte; maqaan ishee muka dambii fi Obbo Dolloo irraa dhufe. Seenaan naannoo kanaa seenaa gosaa, gadaa, lafa qonnaa fi daldala daangaati.",
      historyP2:"Bara 1884 A.L.I. Dajazmaach Jootee Tulluu, Abbaan Bulchaa Leqa Qellem, qomoo 'Afteer' irratti loluun booda teessoo mootummaa isaa gara Gidaamiitti jijjiire. Bara 1912 imaltoonni Awurooppaa gara Sayyootti dhufan isa arguu danda'an. Ergasii Dambi Doolloo bara 1933 bulchiinsa magaalaa argatte, bara 1941 immoo beekamtii seeraa argatte.",
      historyP3:"Yeroo weerara Xaaliyaanii (1929–1933), gootni Oliiqaa Dingil Bookaa — 'Goota Baddaa Sayyoo' — Yamaalogii Walal irraa qabsoo ittisa koloneeffataa geggeesse. Fulbaana 8, 1943 Dr. Nagaasoo Gidaadaa Dambi Doolloo keessatti dhalate — Pireezidaantii FDRE isa jalqabaa (1995–2001). Amajjii 1998 aanaaleen Gawo Kebe fi Yamaalogii Walal adda baafaman; bara 2010 Sadii Canqaa of dandaate — kunis aanaalee 12 amma jiran uume.",
      timelineHeading:"Taateewwan gurguddoo",
      zonePeopleHeading:"Namoota beekkamoo",
      planHeading:"Daawwannaa qopheessaa", tableHeading:"Godina gabaabinaan",
      newsAll:"Hunda", newsCatEconomy:"Dinagdee", newsCatEnv:"Naannoo", newsCatMinerals:"Mineraala", newsCatAgri:"Qonna", newsCatHealth:"Fayyaa", newsCatEdu:"Barnoota", newsCatCulture:"Aadaa", newsCatTrade:"Daldala", newsCatDev:"Misooma",
      prevPhoto:"Duraa", nextPhoto:"Itti aanu", closeLightbox:"Cufi", photoOf:"Suuraa",
      historyHeading:"Seenaa fi aadaa",
      photoCredit:"Suuraa ofiisaalaa",
      galleryComing:"Suuraalee — cuqaasi ilaali",
      sponsorsKicker:"Miseensota fi Deeggartoota",
      sponsorsTitle:"Deeggartoota fi michoota keenya",
      sponsorsSub:"Dhaabbilee mootummaa, waldaalee fi qaamolee hawaasaa Discover Qellem jabeessan.",
      supportersHeading:"Dhaabbi Deeggartootaa",
      supportersSub:"Dhaabbilee, hogganoota fi miseensota hawaasaa pirojektichaaf gahee olaanaa qaban.",
      localIntro:"Beekuma ganda",
      knowBeyond:"{name} maqaa isaa ol beeki.",
      atAGlance:"{name} gabaabinaan",
      historyNaming:"Seenaa fi maqaa",
      howGotName:"{name} akkamitti maqaa argate.",
      cultureHeading:"Aadaa jiraataa",
      cultureSub:"Nyaata, uffata, muuziqaa, shubbisa, ayyaanota, aadaalee, ogummaa harkaa, duudhaa fi oduu durii.",
      cultureFood:"Nyaata", cultureFoodD:"Mana nyaataa fi gabaa — qaalii buna irraa kaasee hanga nyaata gabaa wal-qoodaarra ga'u.",
      cultureClothing:"Uffata", cultureClothingD:"Shamma guyyaa guyyaa, bullukko ayyaanaa fi uffata dhaabbataan uffamu.",
      cultureMusic:"Muuziqaa", cultureMusicD:"Geerarsaa, faarfannaa aadaa fi muuziqaa ammayyaa geggeessitoota irraa.",
      cultureDance:"Shubbisa", cultureDanceD:"Shubbisa cinaacha ayyaana irratti hirmaachisu — dhaloota hunda walitti fida.",
      cultureFestivals:"Ayyaanota", cultureFestivalsD:"Irreecha, ayyaana Kiristaanaa fi Musliima — hawaasa kallattii hedduu.",
      cultureCeremonies:"Aadaalee", cultureCeremoniesD:"Cidhaa, maqaa kaa'aa, eeboo fi aadaa buna simannaa dheeraa.",
      cultureArts:"Ogummaa harkaa", cultureArtsD:"Suufii daldee, shubbisa harkaa, dhagaa harkaan dalagee gabaatti galu.",
      cultureTraditions:"Duudhaa", cultureTraditionsD:"Nagaa dheeraa, buna gaaffii dura, fi tattaaffii gabaa keessatti simannaa.",
      cultureFolklore:"Oduu durii", cultureFolkloreD:"Oduu lafaa, abbootii gosaa fi maqoo magaalota jalqabaa.",
      keepExploring:"Ituma fufi daawwachuu",
      moreQellem:"Qeellam Wallaggaa dabalataan.",
      helpBuild:"Bakka addaa beektaa?",
      helpBuildTitle:"Kuusaa jiraataa Qellem ijaaruu gargaari.",
      helpBuildSub:"Seenaan, suuraan fi hubannoo keessan kuusaa kana dhugaa fi jiraataa taasisu.",
      explore:"Daawwadhuu", seeMore:"Dabalataan ilaali",
      glanceType:"Gosa", glanceZone:"Godina", glanceAltitude:"Olka'iinsa", glancePopulation:"Uummata", glanceLanguages:"Afaanota",
      glanceKeyRole:"Gahee ijoo", glanceMarketDay:"Guyyaa gabaa", glanceAccess:"Karaa gahuu",
      woredaLabel:"Aanaa", townLabel:"Magaalaa", capitalLabel:"Guddoo"
    }
  },

  stats: [
    { value:1254817, key:'pop' },
    { value:9857,    key:'area', suffix:' km²' },
    { value:12,      key:'woredas' },
    { value:134213,  key:'coffee', suffix:' t' }
  ],
  statLabels: {
    en: {
      pop:{l:"Population (2023/24)", s:"Zone profile projection"},
      area:{l:"Zone area", s:"2.9% of Oromia"},
      woredas:{l:"Woredas & town", s:"289 kebeles"},
      coffee:{l:"Coffee produced", s:"tonnes / year"}
    },
    om: {
      pop:{l:"Baay'ina Uummataa (2016 A.L.I)", s:"Tilmaama ragaa godinaa"},
      area:{l:"Bal'ina Godinaa", s:"2.9% Oromiyaa"},
      woredas:{l:"Aanaalee & Magaalaa", s:"Gandoota 289"},
      coffee:{l:"Oomisha Bunaa", s:"toonnii / waggaa"}
    }
  },

  features: [
    { icon:'coffee',        img:IMG.coffee1, title:{om:"Buna",en:"Coffee"},                                 text:{om:"Lafa bunaaf mijatu hektaara 585,945; toonnii 134,213 oomishama (2016 A.L.I). Waldaalee 817 miseensota 156,500 waliin.",en:"585,945 ha of coffee potential; 134,213 tonnes produced in 2016 E.C., channelled through 817 cooperatives with 156,500 members."} },
    { icon:'tree-pine',     img:IMG.forest1, title:{om:"Paarkii Dhaatii Walaal",en:"Dati Walal National Park"}, text:{om:"Hektaara 103,500 — bosona roobaa, bineensota 20+ fi simbirroota 150+. Labsii 87/2005 labsame, Caamsaa 25, 2012 beekame.",en:"103,500 ha — rain forest with 20+ mammal and 150+ bird species, including hippo, buffalo and lion (IUCN vulnerable). Proclaimed 87/2005, gazetted 25 May 2012."} },
    { icon:'layers',        img:IMG.mountain,title:{om:"Mineraalota",en:"Minerals"},                         text:{om:"Warqee Anfilloo, Daallee Waabaraa, Haawwaa Galaan, Laaloo Qilee fi Sayyoo keessatti; Pilaatiiniyam Laaloo Qilee; Tantaalam Sayyoo; Yuureniyam Anfilloo fi Sayyoo.",en:"Gold in Anfillo, Dale Wabera, Hawa Gelan, Lalo Kile and Sayo; platinum in Lalo Kile; tantalum in Sayo; uranium in Anfillo and Sayo (EMA 1988)."} },
    { icon:'droplet',       img:IMG.forest2, title:{om:"Damma",en:"Honey"},                                 text:{om:"Gaagura dammaa 473,300 ol (2015) — dammi bosonaa gabaadhaaf oomishama; teeknooloojii ammayyaa guddinaaf barbaaddi.",en:"Over 473,300 beehives (2015) producing forest honey for market; modern hives are gradually being introduced to lift output."} },
    { icon:'users',         img:IMG.people,  title:{om:"Qonnaa fi Horii",en:"Farming & Livestock"},          text:{om:"Horii 6,721,429 — loon 1,634,514, hoolaa 2,284,903, re'ee 1,823,144, fardaa 53,327, harree 925,541 (2016 A.L.I).",en:"6,721,429 livestock — 1,634,514 cattle, 2,284,903 sheep, 1,823,144 goats, 53,327 horses, 925,541 donkeys (2016 E.C.)."} },
    { icon:'landmark',      img:IMG.culture, title:{om:"Aadaa Lubbuun Jiru",en:"Living Culture"},            text:{om:"Aadaa Oromoo — sirna buna qalaa, jaarsummaa, sirna gadaa fi seenaa afaaniin darbu; amantaa fi sabummaa garaagarummaa waliin jiraachuu.",en:"Oromo traditions — the coffee ceremony, jaarsummaa (elder mediation), the gadaa system, and oral history; multi-religious, multi-ethnic coexistence across the zone."} },
    { icon:'route',         img:IMG.market,  title:{om:"Hawaasa Daangaa",en:"Border Communities"},           text:{om:"Bakka Oromiyaa, Gumbelaa fi Sudaan walqunnaman — daldalaa, saaqoo fi jireenya walitti makaa Waro Koyan Gidaamii.",en:"Where Oromia meets Gambella and Sudan — cross-border trade at Waro Koyan, Gidami, and multilingual frontier life."} },
    { icon:'mountain-snow', img:IMG.mountain,title:{om:"Tulluu Walaal",en:"Mount Walal"},                   text:{om:"Meetira 3,335 — tulluu sadaffaa guddaa Itoophiyaa; Yamaalogii Walal keessatti dhaloota Oliiqaa Dingil Bookaa.",en:"3,335 m — Ethiopia's third-highest mountain, in Yemalogi Welel; birthplace of Oliqa Dingil Booka, with trails and wide highland views."} }
  ],

  plan: [
    { icon:'calendar-days', title:{om:"Yeroo Filatamaa",en:"Best season"},  text:{om:"Onkoloolessa–Amajjii sanyii bunaa fi qilleensa qulqulluuf; Bitootessa–Caamsaa magariisa guutuuf Rooba cimaa keessa daandii rakkisaa ta'uu danda'a.",en:"October–January for coffee harvest and clear skies; March–May for greenest landscapes (note: some roads turn rough in heavy rain)."} },
    { icon:'car',           title:{om:"Akkamitti Geessan",en:"Getting there"},text:{om:"Finfinnee irraa Naqamtee fi Gimbii keessa km 652; ykn xiyyaaraan Dambi Doollootti bu'aa. Karaa asfaaltii Finfinnee–Dambi Doolloo gabaabaa ta'aa jira.",en:"Drive 652 km from Finfinnee via Nekemte and Gimbi on the new asphalt highway, or charter a flight to Dembi Dolo airstrip."} },
    { icon:'compass',       title:{om:"Naannoo Keessatti",en:"Getting around"},text:{om:"Konkolaataa 4x4 aanaa daangaa fi gammoojjiitti filadhaa. Karaan daandii asfaaltii biraa kanneen gaggaarii; baajajii fi geejjibaa ni argama.",en:"A 4x4 is recommended for lowland and border woredas. Public transport and bajaj connect the main towns; asphalt continues to improve."} },
    { icon:'hand-heart',    title:{om:"Kabajaa Eegaa",en:"Respect"},        text:{om:"Suuraa kaasuun dura gaafadhaa; buna yoo kenname simadhaa; jaarsolii jalqaba nagaa gaafadhaa.",en:"Ask before photographing people. Accept coffee when offered. Greet elders first."} },
    { icon:'shopping-bag',  title:{om:"Deeggarsa Hawaasaa",en:"Support local"},text:{om:"Waldaalee bunaa, gabaafi hoteelota naannoo deeggadhaa; qarshii xiqqaa qabadhu.",en:"Buy from coffee cooperatives, markets and local guesthouses — carry small notes and keep benefit in the community."} }
  ],

  glance: [
    { label:{om:"Naannoo",en:"Region"},                     val:{om:"Oromiyaa",en:"Oromia"},                                   note:{om:"Bulchiinsa",en:"Administrative"} },
    { label:{om:"Godina",en:"Zone"},                        val:{om:"Qeellam Wallaggaa",en:"Kellem Wollega"} },
    { label:{om:"Magaalaa Guddoo",en:"Capital"},            val:{om:"Dambi Doolloo",en:"Dembi Dolo"},                          note:{om:"Finfinnee irraa km 652",en:"652 km from Finfinnee"} },
    { label:{om:"Bal'ina",en:"Area"},                       val:{om:"≈ 9,857 km²",en:"≈ 9,857 km²"},                          note:{om:"2.9% Oromiyaa",en:"2.9% of Oromia"} },
    { label:{om:"Aanaalee fi Magaalaa",en:"Woredas & town"},val:{om:"11 + magaalaa 1",en:"11 + 1 town"},                        note:{om:"Gandoota 258 + 31",en:"258 rural + 31 urban kebeles"} },
    { label:{om:"Baay'ina Uummataa (2016 A.L.I)",en:"Population (2023/24)"}, val:"1,254,817",                              note:{om:"Tilmaama ragaa godinaa",en:"Zone profile projection"} },
    { label:{om:"Baay'ina Uummataa (2007)",en:"Population (2007)"}, val:"797,666",                                          note:{om:"ESS",en:"ESS census"} },
    { label:{om:"Haala Qilleensaa",en:"Climate"},           val:{om:"Woyina Deega 47% · Kola 39% · Baddaa 14%",en:"Woyinadega 47% · Kola 39% · Dega 14%"} },
    { label:{om:"Buna (2016 A.L.I)",en:"Coffee (2023/24)"}, val:{om:"Toonnii 134,213",en:"134,213 tonnes"},                    note:{om:"Hektaara 484,841 irraa",en:"from 484,841 ha"} },
    { label:{om:"Horii (2016 A.L.I)",en:"Livestock (2023/24)"}, val:"6,721,429",                                             note:{om:"Loon 1,634,514 dabalatee",en:"incl. 1,634,514 cattle"} },
    { label:{om:"Gaagura dammaa",en:"Beehives"},            val:{om:"473,300 (2015)",en:"473,300 (2015)"},                    note:{om:"339,193 (2016)",en:"339,193 (2016)"} },
    { label:{om:"Barnoota",en:"Education"},                 val:{om:"MB 452, MS 50, Yuunivarsiitii 1",en:"452 primary, 50 secondary, 1 university"}, note:{om:"Barattoota 348,516",en:"348,516 students"} },
    { label:{om:"Fayyaa",en:"Health"},                      val:{om:"Hosp. 4, BC 51, KP 256",en:"4 hospitals, 51 health centres, 256 posts"} },
    { label:{om:"Waldaalee",en:"Cooperatives"},             val:{om:"817",en:"817"},                                         note:{om:"Miseensota 156,500",en:"156,500 members"} },
    { label:{om:"Sanyii (2007)",en:"Ethnicity (2007)"},     val:{om:"Oromoo 94.8% · Amaaraa 4.01%",en:"Oromo 94.8% · Amhara 4.01%"}, note:{om:"ESS",en:"ESS"} },
    { label:{om:"Afaan (2007)",en:"Language (2007)"},       val:{om:"Afaan Oromoo 96.31% · Amaariffa 3.13%",en:"Afaan Oromoo 96.31% · Amharic 3.13%"} },
    { label:{om:"Amantaa (2007)",en:"Religion (2007)"},     val:{om:"Protestantii 42.5% · Ortodoksii 34% · Islaama 21%",en:"Protestant 42.5% · Orthodox 34% · Muslim 21%"} },
    { label:{om:"Mineraalota",en:"Minerals"},               val:{om:"Warqee, Pilaatiiniyam, Tantaalam, Yuureniyam",en:"Gold, platinum, tantalum, uranium"}, note:{om:"EMA 1988",en:"EMA 1988"} }
  ],

  places: [
    { slug:"dembi-dollo", type:"town",
      name:{om:"Dambi Doolloo",en:"Dembi Dolo"},
      img:IMG.dembiCity,
      tagline:{om:"Magaalaa guddoo godina Qeellam Wallaggaa — Finfinnee irraa km 652. Giddugala daldalaa, seenaa, tajaajilaafi misooma haarawa godichaa. Galma guddaa Oliiqaa Dingil fi Kooridarii magaalaa har'a eebbifameera.",en:"The capital of Kellem Wollega Zone, 652 km from Finfinnee — the zone's centre of trade, history, services and fresh development. The Grand Oliqa Dingil Hall and the city corridor have just been inaugurated."},
      badges:[{icon:"landmark",l:{om:"Magaalaa Guddoo",en:"Capital"}},{icon:"users",l:{om:"Gabaa",en:"Market"}},{icon:"plane",l:{om:"Dirree Xiyyaaraa",en:"Airstrip"}}],
      pop:"59,343", elev:{om:"1,701–1,827 m",en:"1,701–1,827 m"},
      key:{om:"Daldala fi tajaajila",en:"Trade, services & administration"}, cap:"—",
      coords:[8.533,34.800],
      aboutTitle:{om:"Magaalaa maqaa mukaatiin moggaafamte",en:"A town named after a tree"},
      about:[
        {om:"Dambi Doolloo teessoo Bulchiinsa Godina Qeellam Wallaggaati — Finfinnee irraa km 652, tulluuwwanii fi lafa diriiraa irratti argamti. Lageen xixiqqaa akka Borxaa, Somboo fi Meexxii ishee marsu; Lagaan Borxaa bishaan dhugaatii magaalaa guutuuf tajaajila. Bal'inni lafaa ishee hektaara 5,198 dha; olka'iinsi ishee meetira 1,701–1,827 gidduutti argama. Magaalichaan kutaa afur qabdi — Doolloo, Yabaloo, Laaftoo fi Biiftuu — fi yuunivarsiitii, hospitaala, baankii 11, koolleejjii fi dirree xiyyaaraa of keessaa qabdi.",en:"Dembi Dolo is the seat of Kellem Wollega Zone administration — 652 km from Finfinnee, spread over hills and plains and ringed by streams such as Borxa, Sombo and Meexxii. The Borxa river supplies the whole town's drinking water. The town covers 5,198 hectares, rising from 1,701 to 1,827 m, and is divided into four sub-cities — Dolloo, Yabaloo, Laaftoo and Biiftuu. It hosts the zone university, a hospital, 11 banks, several colleges and an airstrip."},
        {om:"Maqaan ishee muka dambii irraa dhufe: namichi Obbo Dolloo jedhamu gaaddisa muka dambii jalatti taa'ee Mishingaa isaa eeggata ture; daldaltoonni Wallaggaa fi Gumbelaa jidduu deeman achitti boqotanii daabboo cabsatanii odeeffannoo wal jijjiirataa turan. Haaluma kanaan magaalaan 'Dambi Dolloo' jedhamtee waamamte — akka maanguddoonni umuriin ragan dubbatan. Hundeeffamni ishee jaarraa tokkoo ol; ragaaleen afaanii bara 1898 ykn 1903 dubbatu.",en:"Its name comes from the dambi tree: a man called Obbo Dolloo sat under a dambi's shade awaiting his mission, and traders crossing between Wollega and Gambela rested there to eat and exchange news of the road. So the town came to be called 'Dembi Dolo', as the elders tell it. Its founding goes back more than a century; oral records place it in 1898 or 1903."},
        {om:"Bara 1933 A.L.I bulchiinsi magaalaa hundeefame; bara 1941 beekamtii seeraa argatte. Yeroo Xaaliyaanii magaalaan kun guddina saffisaa argatte; bara 1998 magaalaa guddittii godinaa taate. Har'a pirojektoonni misoomaa haarawa galma Oliiqaa Dingil (qarshii miliyoona 425 oliin), Kooridarii magaalaa, kilaasterota, Kaaffee Tekinooloojii (Science Café), fi marfata magaalichaa eebbifamaa jiru — Kantiibaan Obbo Girmaa Dangalaa pirojektoota 32 ol hojjetamaa jiraachuu himaniiru.",en:"A municipal administration was founded in 1933 E.C. and gained legal recognition in 1941. The town grew fast during the Italian occupation and became zonal capital in 1998. Today a wave of new development is being inaugurated — the Grand Oliqa Dingil Hall (built at a cost of over 425 million Birr), the city corridor, multi-purpose clusters, the Oromia Science & Technology Authority Science Café, and improved road networks, with the city mayor Obbo Girma Dangala reporting more than 32 active projects."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa (2016 A.L.I)",en:"Population (2023/24)"},v:"59,343"},
        {l:{om:"Baay'ina Uummataa (2015 A.L.I)",en:"Population (2022/23)"},v:"56,959"},
        {l:{om:"Bal'ina",en:"Area"},v:{om:"Hektaara 5,198",en:"5,198 hectares"}},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"1,701–1,827 m",en:"1,701–1,827 m"}},
        {l:{om:"Qilleensa",en:"Climate"},v:{om:"Woyina Deega 100% · 18–28°C",en:"100% Woina Dega · 18–28°C"},n:{om:"Giddu galeessa 23°C",en:"avg 23°C"}},
        {l:{om:"Rooba",en:"Rainfall"},v:{om:"mm 800–1,800",en:"800–1,800 mm / year"}},
        {l:{om:"Fageenya Finfinnee irraa",en:"Distance from Finfinnee"},v:"km 652"},
        {l:{om:"Kutaa magaalaa",en:"Sub-cities"},v:{om:"Doolloo, Yabaloo, Laaftoo, Biiftuu",en:"Dolloo, Yabaloo, Laaftoo, Biiftuu"}},
        {l:{om:"Bishaan qulqulluu",en:"Clean water access"},v:"47%"},
        {l:{om:"Tajaajila",en:"Facilities"},v:{om:"Hospitaala 1 · Yuunivarsiitii · Koolleejjii · Baankii 11",en:"1 hospital · university · colleges · 11 banks"},n:{om:"Dirree xiyyaaraa 1",en:"1 airstrip"}}
      ],
      gallery:[IMG.dembiCity, IMG.dembiHall, IMG.dembiHall2, IMG.inauguration3, IMG.inauguration1],
      placesList:[
        {name:{om:"Gabaa Guddaa Dambi Doolloo",en:"The Grand Market of Dembi Dolo"},short:{om:"Giddugala daldalaa godinaa — buna, damma, midhaan fi meeshaa harkaa guyyaa gabaa walitti qaba.",en:"The zone's trading heart — coffee, honey, grain and crafts from across the zone gather here on market day."},type:{om:"Gabaa torbanii",en:"Weekly market"},img:IMG.market},
        {name:{om:"Hara Bortaa",en:"Borta Lake"},short:{om:"Hara hidhata bishaanii — km 2 qofa Dambi Doolloo irraa, boqonnaa fi daawwannaa mijataa.",en:"A dam lake just 2 km from Dembi Dolo — a calm spot for rest and recreation."},type:{om:"Hara",en:"Lake"},img:IMG.river},
        {name:{om:"Galma Oliiqaa Dingil",en:"Grand Oliqa Dingil Hall"},short:{om:"Galma guddaa qarshii Miliyoona 425 oliin ijaarame — har'a eebbifamaa jira.",en:"The grand conference hall built at more than 425 million Birr — newly inaugurated."},type:{om:"Pirojektii haarawa",en:"New project"},img:IMG.dembiHall}
      ],
      notable:[
        {name:{om:"Dr. Nagaasoo Gidaadaa",en:"Dr. Negasso Gidada"},years:"1943–2019",role:{om:"Pireezidaantii FDRE isa jalqabaa (1995–2001) — Dambi Doolloo keessatti dhalate",en:"First President of the FDRE (1995–2001) — born in Dembi Dolo"}, img:IMG.drNegaasoo}
      ]
    },
    { slug:"sayo", type:"woreda",
      name:{om:"Sayyoo",en:"Sayo"},
      img:IMG.hills2,
      tagline:{om:"Lafa hundee godichaa — lafa Sayyoo Oromoo; Dambi Doolloo of keessaa qabdi. Tulluuwwan, madda bishaanii 555+ fi seenaa Jootee Tulluu.",en:"The historic root of the zone — land of the Sayyoo Oromo, encircling Dembi Dolo itself. Hills, over 555 springs and the legacy of Jote Tulu."},
      badges:[{icon:"landmark",l:{om:"Seenaa",en:"History"}},{icon:"coffee",l:{om:"Buna",en:"Coffee"}},{icon:"tree-pine",l:{om:"Eegumsa Bineensaa",en:"Wildlife Reserves"}}],
      pop:"179,458", elev:{om:"720–2,230 m",en:"720–2,230 m"},
      key:{om:"Buna",en:"Coffee"}, cap:"—",
      coords:[8.47,34.80],
      aboutTitle:{om:"Hundee godichaa",en:"The root of the zone"},
      about:[
        {om:"Sayyoo aanaa kibba-dhiha godina Qeellam Wallaggaa ti — magaalaan guddoon godichaa, Dambi Doolloo, aanaa kana keessatti argamti. Bal'inni ishee km² 1,278; gandoonni baadiyyaa 27 fi magaalaa 2 qabdi. Kibbaan Gumbelaa, kibba-bahaan Illuu Abbaa Booraa, kaabaa fi bahaan Haawwaa Galaan fi Yamaalogii Walal, dhihaa fi kaaba-dhihaan Anfilloo daangeffamti.",en:"Sayo lies in the south-west of Kellem Wollega — the zonal capital, Dembi Dolo, stands within it. The woreda covers 1,278 km² with 27 rural and 2 town kebeles. It borders Gambela to the south, Ilu Aba Bora to the south-east, Hawa Gelan and Yemalogi Welel to the north and east, and Anfillo to the west and north-west."},
        {om:"Madda bishaanii 555 ol qabdi; lageen gurguddoon Birbirsaa, Meetii, Saakoo, Duuchii, Bortaa fi Bonda'oo ishee jidduu yaa'u. Tulluuwwan beekamoon Gara Mao, Yangii, Kaakee, Daagaa Alattii, Meetoo, Konkii, Hombii, Bubbukaa, Sootii fi Eniiti. Bineensota bosonaa eeguuf bakka eegumsaa lamatu jira — Bada Xinnoo (Kuree Gayib) fi Bada Guddaa (Laga Loomii) — leenca, gafarsa, booyyee fi kkf itti argamu.",en:"Over 555 springs rise here, and major rivers drain through: Birbirsa, Meti, Sako, Duchi, Borta and Bondao. Well-known hills include Gara Mao, Yangi, Kake, Daga Alatti, Meto, Konki, Humbi, Bubbuka, Soti and Eni. Two wildlife reserves protect its fauna — Bada Xinnoo (Kuree Gayib) and Bada Guddaa (Laga Loomii) — home to lion, buffalo, warthog and other species."},
        {om:"Seenaan Sayyoo barreeffama guddaa argate: gosa Sayyoo Maccaa Oromoo keessaa dha; Dambi Doolloo mataan ishee yeroo dheeraaf 'Sayyoo' jedhamti turte. Qorannoon doktoraa Dr. Nagaasoo Gidaadaa 'Seenaa Sayyoo Oromoo Wallaggaa, 1730–1886' jedhu maqaa Sayyoo addunyaaf beeksise.",en:"Sayo carries a major written history: the Sayyoo are a branch of the Machaa Oromo, and Dembi Dolo itself was long known simply as 'Sayo'. Dr Negasso Gidada's doctoral research, 'The History of the Sayyoo Oromo of Wallaga, 1730–1886', brought the name to world scholarship."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"179,458"},
        {l:{om:"Baay'ina Uummataa (2015)",en:"Population (2022/23)"},v:"177,215"},
        {l:{om:"Bal'ina",en:"Area"},v:"1,278 km²"},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"720–2,230 m",en:"720–2,230 m"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"27 baadiyyaa + 2 magaalaa",en:"27 rural + 2 town"}},
        {l:{om:"Madda bishaanii",en:"Springs"},v:"555+"},
        {l:{om:"Haala qilleensaa",en:"Climate"},v:{om:"Baddaa 46.15% · Woyina Deega 23.07% · Kola 30.78%",en:"Dega 46.15% · Woyinadega 23.07% · Kola 30.78%"}},
        {l:{om:"Eegumsa bineensaa",en:"Wildlife reserves"},v:{om:"Bada Xinnoo fi Bada Guddaa",en:"Bada Xinnoo & Bada Guddaa"},n:{om:"Leenca, gafarsa, booyyee",en:"lion, buffalo, warthog"}}
      ],
      gallery:[IMG.hills2,IMG.coffee1,IMG.forest1,IMG.coffee2],
      placesList:[
        {name:{om:"Tulluuwwan Seenyaa Sayyoo",en:"The Historic Hills of Sayo"},short:{om:"Bakka seenaan Jootee Tulluu fi gosa Sayyoo barreeffame; har'a masara bunaatiin magariifaman.",en:"Where the story of Jote Tulu and the Sayyoo clans was written; today green with coffee farms."},type:{om:"Seenaa",en:"Historic hills"},img:IMG.hills2}
      ],
      notable:[
        {name:{om:"Jootee Tulluu",en:"Jote Tulu (Dejazmach)"},years:"d. 1932",role:{om:"Abbaa Bulchaa Leqa Qellem — bara 1884 A.L.I. teessoo isaa Gidaamiitti jijjiire",en:"Ruler of Leqa Qellem who moved his seat to Gidami in 1884 E.C."}},
        {name:{om:"Dr. Nagaasoo Gidaadaa",en:"Dr. Negasso Gidada"},years:"1943–2019",role:{om:"Pireezidaantii FDRE isa jalqabaa — Dambi Doolloo (Sayyoo) keessatti dhalate",en:"First President of the FDRE — born in Dembi Dolo (Sayo)"}, img:IMG.drNegaasoo}
      ]
    },
    { slug:"hawa-gelan", type:"woreda",
      name:{om:"Haawwaa Galaan",en:"Hawa Gelan"},
      img:IMG.valley,
      tagline:{om:"Aanaa kibba godinaa — magaalaa guddoon Geba Roobii; lafa qonnaa bal'aa, lageen hedduu fi warqee.",en:"A southern woreda with its capital at Geba Robi — wide farmland, many rivers and recorded gold."},
      badges:[{icon:"users",l:{om:"Baay'ina",en:"Populous"}},{icon:"coffee",l:{om:"Buna",en:"Coffee"}},{icon:"layers",l:{om:"Warqee",en:"Gold"}}],
      pop:"161,186", elev:{om:"500–2,500 m",en:"500–2,500 m"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:{om:"Geba Roobii",en:"Geba Robi"},
      coords:[8.38,35.00],
      aboutTitle:{om:"Lafa qonnaa fi mineraalaa",en:"A land of farms and minerals"},
      about:[
        {om:"Haawwaa Galaan aanaa kibba godina Qeellam Wallaggaa ti — Dambi Doolloo irraa km 28 fagaattee. Bal'inni ishee km² 835.18; gandoonni 16 jiru — 14 baadiyyaa fi 2 magaalaa. Magaalaan guddoon ishee Geba Roobii dha.",en:"Hawa Gelan lies in the south, 28 km from Dembi Dolo. It covers 835.18 km² with 16 kebeles — 14 rural and 2 urban — and its capital is Geba Robi."},
        {om:"Kibbaa fi kibba-bahaan Illuu Abbaa Booraa, kibbaa fi kibba-dhihaan Sayyoo, kaaba-bahaan Daallee Waabaraa fi kaabaan Yamaalogii Walal daangeffamti. Lageen Caabal, Hinciinaa, Lomee, Coqorsaa, Lagaa Kuncee, Mandiyyoo, Birbir fi Dabbaqaa ishee jidduu yaa'u. Olka'iinsi ishee meetira 500–2,500 — bakki ol aanaan Fiincoo, gadi aanaan Tullamaa.",en:"It borders Ilu Aba Bora to the south and south-east, Sayo to the south and south-west, Dale Wabera to the north-east and Yemalogi Welel to the north. The rivers Cabal, Hindina, Lome, Chokorsa, Laga Kunche, Mandiyo, Birbir and Dabaka drain it. Elevations run from 500 to 2,500 m — highest at Fincho, lowest at Tulama."},
        {om:"Ragaan Kaartaa Itoophiyaa (1988) warqee, pilaatiiniyam, titaaniyam fi yuureniyam Haawwaa Galaan keessatti argamuu ibsa. Haalli qilleensaa Woyina Deega 31.9% fi Kola 68.1%; ho'i giddu galeessaan 22°C. Qonnaan bulaan gaaddisa bunaa jalatti, lafa midhaanii fi korma horsiisee jiraata; guyyaa gabaa oomishni gara magaalaatti ce'a.",en:"The Ethiopian Mapping Authority (1988) records gold, platinum, titanium and uranium. The climate is 31.9% woyinadega and 68.1% kola, averaging 22°C. Farmers live under coffee shade, on grain land and with their herds; on market days the produce flows to town."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"161,186"},
        {l:{om:"Bal'ina",en:"Area"},v:"835.18 km²"},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Geba Roobii",en:"Geba Robi"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"14 baadiyyaa + 2 magaalaa",en:"14 rural + 2 urban"}},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"500–2,500 m",en:"500–2,500 m"}},
        {l:{om:"Ho'a giddu galeessaa",en:"Avg temperature"},v:"22°C"},
        {l:{om:"Mineraalota",en:"Minerals"},v:{om:"Warqee, Pilaatiiniyam, Titaaniyam, Yuureniyam",en:"Gold, Platinum, Titanium, Uranium"},n:{om:"EMA 1988",en:"EMA 1988"}}
      ],
      gallery:[IMG.valley,IMG.coffee1,IMG.grain,IMG.river],
      placesList:[
        {name:{om:"Finchaa Kettoo",en:"Keto Waterfall"},short:{om:"Finchaa bishaanii — km 48 Dambi Doolloo irraa; yeroo rooba cimaa bareedina guddaa qaba.",en:"A waterfall 48 km from Dembi Dolo — most spectacular in the heavy rains."},type:{om:"Finchaa",en:"Waterfall"},img:IMG.falls}
      ]
    },
    { slug:"dale-sadi", type:"woreda",
      name:{om:"Daallee Sadii",en:"Dale Sadi"},
      img:IMG.coffee2,
      tagline:{om:"Aanaa maqaa gosoota lamaatiin moggaafamte — Daallee (baddaa) fi Saadii (gammoojjii). Magaalaan guddoon Haroo Sabuu.",en:"A woreda named after two clans — Dalle of the highland and Sedi of the lowland. Its capital is Haro Sebu."},
      badges:[{icon:"coffee",l:{om:"Buna",en:"Coffee"}},{icon:"mountain-snow",l:{om:"Guma Guda",en:"Guma Guda"}},{icon:"users",l:{om:"Gosoota Lama",en:"Two Clans"}}],
      pop:"117,613", elev:{om:"hanga 2,209 m",en:"up to 2,209 m"},
      key:{om:"Buna",en:"Coffee"}, cap:{om:"Haroo Sabuu",en:"Haro Sebu"},
      coords:[8.25,35.20],
      aboutTitle:{om:"Maqaa gosoota lamaa",en:"Named by two clans"},
      about:[
        {om:"Daallee Sadii aanaa kibba godina Qeellam Wallaggaa ti — Dambi Doolloo irraa km 90. Kibbaan Illuu Abbaa Booraa, dhihaan Daallee Waabaraa, bahaan Laaloo Qilee fi kaabaan Ayyiraa (Wallagga Bahaa) daangeffamti. Bal'inni ishee km² 694.18; gandoonni 30 jiru — 27 baadiyyaa fi 3 magaalaa. Magaalaan guddoon Haroo Sabuu dha.",en:"Dale Sadi lies in the south, 90 km from Dembi Dolo. It borders Ilu Aba Bora to the south, Dale Wabera to the west, Lalo Kile to the east and Ayira of West Wollega to the north. It covers 694.18 km² with 30 kebeles — 27 rural and 3 urban; capital is Haro Sebu."},
        {om:"Maqaan 'Daallee Sadii' gosoota Oromoo lama irraa dhufe: Daallee baddaa fi Saadii gammoojjii keessa jiraatu. Baddaa irratti xaafii, garbuu fi qamadii oomishamu; gammoojjii irratti boqqolloo, mishingaa, buna fi daangulee. Gosoonni lamaan walitti dhufanii maqaa 'Daallee Sadii' jedhu moggaasan.",en:"The name comes from two Oromo clans: the Dalle of the highland (teff, barley and wheat country) and the Sedi of the lowland (maize, sorghum, coffee and millet). The two clans came together and named the woreda after themselves."},
        {om:"Magaalaan Haroo Sabuu hara naannoo ishee jiru irraa maqaa argatte. Tulluuwwan ishee — Guma Guda (2,209 m, daangaa Daallee Waabaraa waliin), Guma Tika Immo (2,000 m), Guma Tika Wenkir (1,972 m) fi Daagaa Boraa (1,780 m) — beekamoo dha. Roobni waggaa mm 1,200; ho'i giddu galeessaan 25°C.",en:"Haro Sebu, the capital, is named after the lake beside the town. The woreda's known hills include Guma Guda (2,209 m on the border with Dale Wabera), Guma Tika Immo (2,000 m), Guma Tika Wenkir (1,972 m) and Daga Bora (1,780 m). Annual rainfall ~1,200 mm; average temperature 25°C."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"117,613"},
        {l:{om:"Bal'ina",en:"Area"},v:"694.18 km²"},
        {l:{om:"Tulluu guddaa",en:"Highest hill"},v:{om:"Guma Guda — 2,209 m",en:"Guma Guda — 2,209 m"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"27 baadiyyaa + 3 magaalaa",en:"27 rural + 3 urban"}},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Haroo Sabuu",en:"Haro Sebu"},n:{om:"Maqaa haraa irraa",en:"named after the lake"}},
        {l:{om:"Rooba",en:"Rainfall"},v:{om:"mm 1,200",en:"≈ 1,200 mm"}},
        {l:{om:"Ho'a",en:"Temperature"},v:"≈ 25°C"}
      ],
      gallery:[IMG.coffee2,IMG.hills2,IMG.coffee1,IMG.forest2],
      placesList:[
        {name:{om:"Holqa Jajoo Akakil",en:"Jajo Akakil Stone Cave"},short:{om:"Holqa dhagaa — km 132 Dambi Doolloo irraa; bakka daawwannaa ofiisaalaa.",en:"A stone cave 132 km from Dembi Dolo — an official tourism site."},type:{om:"Holqa",en:"Cave"},img:IMG.mountain}
      ]
    },
    { slug:"dale-wabera", type:"woreda",
      name:{om:"Daallee Waabaraa",en:"Dale Wabera"},
      img:IMG.forest2,
      tagline:{om:"Aanaa baha godinaa — magaalaan guddoon Kaakee; madda bishaanii 358+ fi warqee.",en:"An eastern woreda with capital at Kake — over 358 springs and recorded gold."},
      badges:[{icon:"mountain-snow",l:{om:"Guma Guda",en:"Guma Guda"}},{icon:"droplet",l:{om:"Madda Bishaanii",en:"Springs"}},{icon:"layers",l:{om:"Warqee",en:"Gold"}}],
      pop:"119,555", elev:{om:"1,500–2,000 m",en:"1,500–2,000 m"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:{om:"Kaakee",en:"Kake"},
      coords:[8.35,35.25],
      aboutTitle:{om:"Madda bishaanii fi tulluuwwan",en:"Springs and hills"},
      about:[
        {om:"Daallee Waabaraa aanaa baha ti — Dambi Doolloo irraa km 72. Bal'inni ishee km² 531.003; gandoonni 24 jiru — 22 baadiyyaa fi 2 magaalaa. Magaalaan guddoon Kaakee dha. Bahaan Daallee Sadii, dhihaan Yamaalogii Walal, kaabaan Gawo Kebe fi kibbaan Sadii Canqaa daangeffamti.",en:"Dale Wabera lies in the east, 72 km from Dembi Dolo. It covers 531.003 km² with 24 kebeles — 22 rural and 2 urban; capital at Kake. It borders Dale Sadi to the east, Yemalogi Welel to the west, Gawo Kebe to the north and Sadi Chanka to the south."},
        {om:"Madda bishaanii 358 ol qabdi; lageen gurguddoon kaabaan Walleensuu, Lakormaa fi Alaltuu, kibbaan immoo Bururii, Koombolcaa, Diibaa, Foogee fi Adaamii yaa'u. Tulluuwwan ishee — Guma Guda (2,209 m), Tulluu Sa'aa fi Tulluu Mootii — meetira 1,500–2,000 olka'an. Maddi bishaanii jireenya gandaaf bu'uura — dhugaatii, horii fi jallisiidhaaf oola.",en:"Over 358 springs rise here; main rivers run north (Wallensu, Lakorma, Alaltu) and south (Bururi, Kombolcha, Diba, Foge, Adami). Hills — Guma Guda (2,209 m), Tulu Sa'a, Tulu Moti — rise between 1,500 and 2,000 m. The springs are the base of village life — drinking, livestock and irrigation."},
        {om:"Ragaan Kaartaa Itoophiyaa (1988) warqee aanaa kana keessatti argamuu ibsa. Haalli qilleensaa Woyina Deega 95% fi Kola 5% — qilleensi gaariin bunaaf mijata.",en:"EMA 1988 records gold here. The climate is 95% woyinadega and 5% kola — excellent coffee country."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"119,555"},
        {l:{om:"Bal'ina",en:"Area"},v:"531.003 km²"},
        {l:{om:"Madda bishaanii",en:"Springs"},v:"358+"},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"22 baadiyyaa + 2 magaalaa",en:"22 rural + 2 urban"}},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Kaakee",en:"Kake"}},
        {l:{om:"Haala qilleensaa",en:"Climate"},v:{om:"Woyina Deega 95% · Kola 5%",en:"Woyinadega 95% · Kola 5%"}},
        {l:{om:"Mineraalota",en:"Minerals"},v:{om:"Warqee",en:"Gold"},n:{om:"EMA 1988",en:"EMA 1988"}}
      ],
      gallery:[IMG.forest2,IMG.river,IMG.hills1,IMG.valley]
    },
    { slug:"gawo-kebe", type:"woreda",
      name:{om:"Gaawoo Qeebbee",en:"Gawo Kebe"},
      img:IMG.mountain,
      tagline:{om:"Aanaa daawwannaa godinaa — km² 1,173.27; Paarkii Dhaatii Walaal, Tulluu Walaal fi bosona Gawo of keessaa qabdi.",en:"The zone's tourism woreda at 1,173.27 km² — home to Dati Walal National Park, Mount Walal and Gawo forest."},
      badges:[{icon:"tree-pine",l:{om:"Dhaatii Walaal",en:"Dati Walal"}},{icon:"mountain-snow",l:{om:"Tulluu Walaal",en:"Mount Walal"}},{icon:"landmark",l:{om:"Ilaalcha",en:"Viewpoints"}}],
      pop:"143,770", elev:{om:"1,300–3,335 m",en:"1,300–3,335 m"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:"—",
      coords:[8.52,35.08],
      aboutTitle:{om:"Aanaa daawwannaa godinaa",en:"The zone's tourism woreda"},
      about:[
        {om:"Gaawoo Qeebbee Amajjii 1998 Daallee Waabaraa irraa adda baafamee ijaarame. Kaabaan Qondaalaa, bahaan Daallee Waabaraa, kibbaan Yamaalogii Walal fi dhihaan Jimmaa Horroo daangeffamti; Dambi Doolloo irraa km 88 fagaattee argamti. Bal'inni ishee km² 1,173.27 dha.",en:"Gawo Kebe was demarcated from Dale Wabera and established in January 1998 E.C. It borders Qondala to the north, Dale Wabera to the east, Yemalogi Welel to the south and Jimma Horo to the west, lying 88 km from Dembi Dolo. Its area is 1,173.27 km²."},
        {om:"Gandoonni 37 jiru — 34 baadiyyaa fi 3 magaalaa; keessaa 29 Oromiyaadhaaf beekamtii argatan, 5 'satellite' jedhamanii gandoota biraa jalatti bulfamu. Olka'iinsi ishee meetira 1,300–3,335 gidduutti argama; gammoojjiin guddaan Dhaatii (Koyan naannoo) dha.",en:"It has 37 kebeles — 34 rural and 3 urban; 29 are officially recognised by the Oromia Regional State, and 5 'satellite' kebeles are administered under others. Elevations run 1,300–3,335 m; the main lowland is Dhati, near Koyan."},
        {om:"Daawwannaan Gaawoo Qeebbee badhaadhaa dha: Paarkii Dhaatii Walaal (km 128 Dambi Doolloo irraa, labsii 87/2005 hundeeffame, Caamsaa 25, 2012 beekame) — hektaara 103,500 kan Roobii, Gafarsa, Leenca fi kkf of keessaa qabu; Tulluu Walaal (km 106, meetira 3,335); bosona Gawo (km 94); fi Tulluu Kiriitee (km 113). Roobni baha ishee mm 1,700–2,200 ta'a.",en:"Gawo Kebe is rich in attractions: Dati Walal National Park (128 km from Dembi Dolo, proclaimed 87/2005 and gazetted 25 May 2012) — 103,500 ha holding hippo, buffalo, lion and more; Mount Walal (106 km, 3,335 m); Gawo natural forest (94 km); and Kirite mountain (113 km). Rainfall in eastern highlands reaches 1,700–2,200 mm."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"143,770"},
        {l:{om:"Bal'ina",en:"Area"},v:"1,173.27 km²"},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"1,300–3,335 m",en:"1,300–3,335 m"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"34 baadiyyaa + 3 magaalaa",en:"34 rural + 3 urban"},n:{om:"5 satellite",en:"5 satellite"}},
        {l:{om:"Hundeefame",en:"Established"},v:{om:"Amajjii 1998 A.L.I.",en:"January 1998 E.C."},n:{om:"Daallee Waabaraa irraa",en:"from Dale Wabera"}},
        {l:{om:"Daawwannaa",en:"Attractions"},v:{om:"Dhaatii Walaal · Tulluu Walaal · Bosona Gawo · Kiriitee",en:"Dati Walal · Mount Walal · Gawo forest · Kirite"}}
      ],
      gallery:[IMG.mountain,IMG.forest1,IMG.valley,IMG.hills1],
      placesList:[
        {name:{om:"Paarkii Biyyaalessaa Dhaatii Walaal",en:"Dati Walal National Park"},short:{om:"Hektaara 103,500 — roobii, gafarsa, leenca; IUCN'n balaaf saaxilamoo.",en:"103,500 ha — hippo, buffalo, lion (IUCN vulnerable)."},type:{om:"Paarkii Biyyaalessaa",en:"National park"},img:IMG.forest1}
      ],
      notable:[
        {name:{om:"Jaal Laggasaa Wagii Meettaa",en:"Jaal Laggasaa Wagii Meettaa"},years:"1960–",role:{om:"Qabsaa'aa fi hogganaa dhiha Oromiyaa; gaafa umuriin isaa waggaa 15 dura Kaabii Qeellamitti makamee lola Anfilloo fi Gawo Qeebbee keessatti hirmaate.",en:"Revolutionary and western Oromia leader who joined the Qelem Kabo by age 15 and fought in the Anfillo and Gawo Kebe struggles."}}
      ]
    },
    { slug:"yemalogi-welel", type:"woreda",
      name:{om:"Yamaalogii Walal",en:"Yemalogi Welel"},
      img:IMG.hills1,
      tagline:{om:"Lafa Tulluu Walaal — meetira 3,335; dhaloota Oliiqaa Dingil, goota baddaa Sayyoo. Magaalaan guddoon Taajoo.",en:"Land of Mount Walal at 3,335 m — birthplace of Oliqa Dingil, hero of the Sayo highlands. Capital at Tajo."},
      badges:[{icon:"mountain-snow",l:{om:"Tulluu Walaal",en:"Mount Walal"}},{icon:"flag",l:{om:"Goota",en:"Hero's Land"}},{icon:"tree-pine",l:{om:"Bosona",en:"Forest"}}],
      pop:"149,984", elev:{om:"1,500–3,335 m",en:"1,500–3,335 m"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:{om:"Taajoo",en:"Tajo"},
      coords:[8.72,34.98],
      aboutTitle:{om:"Tulluu fi goota",en:"Mountain and hero"},
      about:[
        {om:"Yamaalogii Walal aanaa kaaba godina Qeellam Wallaggaa ti — Dambi Doolloo irraa km 42. Duraan (1998 dura) Haawwaa Galaan jalatti turte. Maqaan ishee lamaan walitti makamee dhufe: 'yemalogi' (gosa biqiltuu) fi 'walal' (tulluu). Bal'inni ishee km² 551.51 dha; gandoonni 15 baadiyyaa fi 2 magaalaa jiru. Magaalaan guddoon ishee Taajoo dha — maqaan ishee waraana guddaa irratti namoonni du'an 'tajii' jedhamuu irraa dhufe.",en:"Yemalogi Welel lies in the north, 42 km from Dembi Dolo. Before 1998 it was part of Hawa Gelan. Its name joins 'yemalogi' (a plant) and 'walal' (hill). It covers 551.51 km² with 15 rural and 2 urban kebeles; capital is Tajo, whose name recalls the word 'tajii' used by onlookers for the fallen in a historic battle on the site."},
        {om:"Tulluun Walaal meetira 3,335 olka'a — ragaa godinaa keessatti tulluu sadaffaa guddaa Itoophiyaa ta'uun galmeeffame. Tulluuwwan Tulluu Soomaa, Tarfii, Moolee, Sebaa, Biicharii fi Kaalii isaa wajjin jiru. Roobni waggaa mm 1,675–2,417 ta'a; haalli qilleensaa Baddaa 35%, Woyina Deega 45% fi Kola 20% dha.",en:"Mount Walal rises to 3,335 m — recorded in the zone profile as Ethiopia's third-highest mountain. Neighbouring hills include Tulu Soma, Tarfi, Mole, Seba, Bichar and Kali. Annual rainfall 1,675–2,417 mm; climate 35% dega, 45% woyinadega, 20% kola."},
        {om:"Asitti, Gurraatti Walal keessatti, Deentaa Garee jedhamutti, gootni Oliiqaa Dingil Bookaa bara tilmaamaan 1890 dhalate. Caamsaa 23, 1929 bosona seenee waraana Fiincoofi Dubbisi fi Wallaggaa (Taajoo) keessatti injifannoo gurguddoo galmeesse; duuti isaa summii qabsoo irratti kufsiisuudhaan Oddoo Butaatti dhufe. Siidaan isaa Dambi Doolloo keessatti ijaaramuuf karoorfameera.",en:"Here, at Deentaa Garee in Gurraatti Walal, the hero Oliqa Dingil Booka was born around 1890. On 23 May 1929 he took to the forest and won major battles at Fiinchoofi Dubbisi and Wallaggaa (Tajjoo); his death came by poison at Oddoo Butaa. A statue in his honour is planned for Dembi Dolo."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"149,984"},
        {l:{om:"Bal'ina",en:"Area"},v:"551.51 km²"},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"1,500–3,335 m",en:"1,500–3,335 m"},n:{om:"Tulluu Walaal 3,335 m",en:"Mount Walal 3,335 m"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"15 baadiyyaa + 2 magaalaa",en:"15 rural + 2 urban"}},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Taajoo",en:"Tajo"}},
        {l:{om:"Rooba",en:"Rainfall"},v:{om:"mm 1,675–2,417",en:"1,675–2,417 mm"}},
        {l:{om:"Haala qilleensaa",en:"Climate"},v:{om:"Baddaa 35% · Woyina Deega 45% · Kola 20%",en:"Dega 35% · Woyinadega 45% · Kola 20%"}}
      ],
      gallery:[IMG.hills1,IMG.mountain,IMG.forest2,IMG.valley],
      placesList:[
        {name:{om:"Tulluu Walaal",en:"Mount Walal"},short:{om:"Meetira 3,335 — km 42 Dambi Doolloo irraa; daandii miilaa fi ilaalcha bal'aa.",en:"3,335 m — 42 km from Dembi Dolo; trails and wide highland views."},type:{om:"Tulluu",en:"Mountain"},img:IMG.mountain},
        {name:{om:"Holqa Gumgumaa",en:"Gumguma Cave"},short:{om:"Holqa — km 45 Dambi Doolloo irraa; bakka daawwannaa ofiisaalaa.",en:"A cave 45 km from Dembi Dolo — official tourism site."},type:{om:"Holqa",en:"Cave"},img:IMG.forest2}
      ],
      notable:[
        {name:{om:"Oliiqaa Dingil Bookaa",en:"Oliqa Dingil Booka"},years:"c.1890–1930s",role:{om:"Goota Baddaa Sayyoo — qabsoo ittisa koloneeffataa",en:"Hero of the Sayo highlands — anti-colonial leader"},img:IMG.oliqaaDingil}
      ]
    },
    { slug:"anfilo", type:"woreda",
      name:{om:"Anfilloo",en:"Anfillo"},
      img:IMG.forest1,
      tagline:{om:"Daangaa kibba-dhihaa — bosona Gargeedaa, bineensota gurguddoo fi warqee. Magaalaan guddoon Mugii.",en:"The south-west frontier — Gargeda forest, big wildlife and recorded gold. Capital at Mugi."},
      badges:[{icon:"tree-pine",l:{om:"Bosona Gargeedaa",en:"Gargeda Forest"}},{icon:"coffee",l:{om:"Buna",en:"Coffee"}},{icon:"layers",l:{om:"Warqee",en:"Gold"}}],
      pop:"121,671", elev:{om:"500–2,500 m",en:"500–2,500 m"},
      key:{om:"Buna bosonaa",en:"Forest coffee"}, cap:{om:"Mugii",en:"Mugi"},
      coords:[8.58,34.50],
      aboutTitle:{om:"Bosona, bineensota fi mineraala",en:"Forest, wildlife and minerals"},
      about:[
        {om:"Anfilloo aanaa kibba-dhiha godina Qeellam Wallaggaa ti — Dambi Doolloo irraa km 42. Kibbaa fi kibba-dhihaan Naannoo Gumbelaa, bahaa fi kibba-bahaan Sayyoo, kaaba-bahaan Yamaalogii Walal fi kaabaa fi kaaba-dhihaan Gidaamii daangeffamti. Bal'inni ishee km² 1,572; gandoonni 25 jiru — 22 baadiyyaa fi 3 magaalaa. Magaalaan guddoon Mugii dha.",en:"Anfillo is the south-west frontier, 42 km from Dembi Dolo. It borders Gambela to the south and south-west, Sayo to the east and south-east, Yemalogi Welel to the north-east, and Gidami to the north and north-west. It covers 1,572 km² with 25 kebeles — 22 rural and 3 urban; capital is Mugi."},
        {om:"Lafti ishee meetira 500–2,500 gidduutti argama; tulluuwwan Bungaa (2,200 m), Awanjii (1,900 m), Tobii (2,110 m), Balaa (2,000 m) fi Yingii (2,100 m) beekamoo dha. Bosonni Gargeedaa — bosona uumamaa fi kan dhaabame walitti maku — mootummaadhaan eegama; arba, leenca, qeerroo, gafarsa fi kkf of keessaa qaba. Bosonni Sheebellii immoo bosona dhaabame bakka daawwannaa ti.",en:"Its land runs 500–2,500 m, with hills Bunga (2,200 m), Awanji (1,900 m), Tobi (2,110 m), Bala (2,000 m) and Yingi (2,100 m). The Gargeda forest — a mix of natural and planted cover — is government-protected, holding elephant, lion, leopard, buffalo and more. Shebel Manmade Forest is also a listed attraction."},
        {om:"Ragaan Kaartaa Itoophiyaa (1988) warqee fi yuureniyam Anfilloo keessatti argamuu ibsa. Roobni waggaa mm 2,141 ta'a — godina keessaa isa guddaa keessaa tokko. Buna bosonaa gaaddisa dhagaa bu'ee jira; eeguun isaa eeguu qabeenya godinaati.",en:"EMA 1988 records gold and uranium. Annual rainfall ~2,141 mm — among the highest in the zone. Forest coffee thrives in the shade; protecting these forests protects the zone's wealth."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"121,671"},
        {l:{om:"Bal'ina",en:"Area"},v:"1,572 km²"},
        {l:{om:"Rooba",en:"Rainfall"},v:{om:"≈ mm 2,141",en:"≈ 2,141 mm"}},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"22 baadiyyaa + 3 magaalaa",en:"22 rural + 3 urban"}},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Mugii",en:"Mugi"}},
        {l:{om:"Bosona",en:"Forest"},v:{om:"Uumamaa ha 157,200; Gargeedaa eegamaa",en:"157,200 ha natural; Gargeda protected"}},
        {l:{om:"Mineraalota",en:"Minerals"},v:{om:"Warqee, Yuureniyam",en:"Gold, uranium"},n:{om:"EMA 1988",en:"EMA 1988"}}
      ],
      gallery:[IMG.forest1,IMG.river,IMG.coffee1,IMG.valley],
      placesList:[
        {name:{om:"Bosona Gargeedaa",en:"Gargeda Natural Forest"},short:{om:"Bosona eegamaa — arba, leenca, qeerroo, gafarsa; km 42 Dambi Doolloo irraa.",en:"Protected forest — elephant, lion, leopard, buffalo; 42 km from Dembi Dolo."},type:{om:"Bosona",en:"Forest"},img:IMG.forest1},
        {name:{om:"Bosona Sheebellii",en:"Shebel Manmade Forest"},short:{om:"Bosona dhaabame — bineensota fi ilaalcha lafaa; km 48 Dambi Doolloo irraa.",en:"Planted forest — wildlife and landscape views; 48 km from Dembi Dolo."},type:{om:"Bosona dhaabame",en:"Manmade forest"},img:IMG.forest2}
      ]
    },
    { slug:"gidami", type:"woreda",
      name:{om:"Gidaamii",en:"Gidami"},
      img:IMG.gidamiAerial,
      tagline:{om:"Aanaa daangaa dhihaa — Sudaan waliin daangaa qabdi; bosona Garjeedaa fi seenaa Jootee Tulluu. Magaalaan guddoon Gidaamii.",en:"The western border woreda — on the Sudan frontier; Garjeedaa forest and the story of Jote Tulu. Capital at Gidami."},
      badges:[{icon:"route",l:{om:"Daangaa Sudaan",en:"Sudan Border"}},{icon:"tree-pine",l:{om:"Bosona Garjeedaa",en:"Garjeedaa Forest"}},{icon:"landmark",l:{om:"Jootee Tulluu",en:"Jote Tulu"}}],
      pop:"132,620", elev:{om:"1,450–2,200 m",en:"1,450–2,200 m"},
      key:{om:"Daldala fi buna",en:"Trade & coffee"}, cap:{om:"Gidaamii",en:"Gidami"},
      coords:[8.98,34.38],
      aboutTitle:{om:"Daangaa dhihaa fi seenaa",en:"Western frontier and history"},
      about:[
        {om:"Gidaamii aanaa dhiha godina Qeellam Wallaggaa ti — Finfinnee irraa km 688, Dambi Doolloo irraa km 161 fagaattee argamti. Dhihaan biyya Sudaan, kibbaan Anfilloo, bahaan Jimmaa Horroo fi kaabaan Aanaa Begii daangeffamti. Bal'inni ishee km² 2,090.307 dha; gandoonni baadiyyaa fi magaalaa hedduu qabdi.",en:"Gidami is the western woreda — 688 km from Finfinnee, 161 km from Dembi Dolo, bordering Sudan to the west, Anfillo to the south, Jimma Horo to the east and Begi to the north. It covers 2,090.307 km² with many rural and urban kebeles."},
        {om:"Haalli qilleensaa ishee 75% Badda-daree (rooba walakkaa waggaa ol) fi 25% Baddaa/Gammoojjii dha; olka'iinsi meetira 1,776–1,928. Tulluun Soonqaa (2,200 m) beekamaa dha — bakki gadi aanaan Waro Koyan godina guutuutti meetira 500 gadi bu'a, bakka daldala daangaati. Bosonni Garjeedaa sadarkaa biyyaatti beekamaa naannoo kana keessatti argama.",en:"Climate is 75% Badda-dare (rainy for over half the year) and 25% highland/lowland; elevations 1,776–1,928 m, with Soonqa Hill (2,200 m) well known. The lowest point at Waro Koyan falls below 500 m — the border trading post with Sudan. The nationally known Garjeedaa forest lies here."},
        {om:"Seenaan Jootee Tulluu naannoo kana keessatti barreeffame: sababoota lamaatu Gidaamii maqaa isaa akka argate dubbatu — qomoo Gidaamii kan duraan bosona ciree jiraate, ykn adamsituu Gidaamii Guus Agaloo Shawaa Lixaa irraa dhufe. Bara 1884 A.L.I Mootiin Jootee Tulluu qomoo 'Afteer' irratti loluun booda teessoo mootummaa isaa gara Gidaamiitti jijjiire — magaalaan kun hanga ammaatti maqaa isaa qabdi.",en:"Jote Tulu's history is written here: two accounts explain the name — either the Gidaamii clan who first cleared the forest, or the hunter Gidaamii Guus Agaloo who came from West Shewa. In 1884 E.C., after defeating the Afteer clan, King Jote Tulu moved his seat of government to Gidami — the town bears that name to this day."},
        {om:"Uummanni ishee amantaa, sabummaa fi afaaniin garaagarummaa qabaatee waliin jiraata — rakkoo jaarsummaa, afooshaa fi 'ollaa bunaatiin' fura. Diinagdeen ishee qonnaa fi horii irratti 95% hundaa'a; Kiristaanonni 65%, Musliimonni 35% ta'u.",en:"Its people live together across differences of religion, ethnicity and language, resolving disputes through jaarsummaa (elder mediation), reconciliation and the 'coffee neighbourhood'. The economy depends 95% on farming and livestock; 65% Christian, 35% Muslim."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"132,620"},
        {l:{om:"Bal'ina",en:"Area"},v:"2,090.307 km²"},
        {l:{om:"Fageenya Finfinnee irraa",en:"Distance from Finfinnee"},v:"km 688"},
        {l:{om:"Olka'iinsa",en:"Elevation"},v:{om:"1,450–2,200 m (Waro Koyan <500 m)",en:"1,450–2,200 m (Waro Koyan <500 m)"}},
        {l:{om:"Tulluu beekamaa",en:"Known hill"},v:{om:"Soonqaa — 2,200 m",en:"Soonqa — 2,200 m"}},
        {l:{om:"Amantaa",en:"Religion"},v:{om:"Kiristaanaa 65% · Musliimaa 35%",en:"Christian 65% · Muslim 35%"}},
        {l:{om:"Diinagdee",en:"Economy"},v:{om:"Qonnaa fi horii 95%",en:"Farming & herding 95%"}}
      ],
      gallery:[IMG.gidamiAerial,IMG.market,IMG.forest1,IMG.hills2],
      placesList:[
        {name:{om:"Holqa Kaaraa Kawe",en:"Kara Kawe Cave"},short:{om:"Holqa — km 153 Dambi Doolloo irraa; bakka daawwannaa ofiisaalaa.",en:"A cave 153 km from Dembi Dolo — official tourism site."},type:{om:"Holqa",en:"Cave"},img:IMG.mountain}
      ],
      notable:[
        {name:{om:"Gidaamii Guus Agaloo",en:"Gidaamii Guus Agaloo"},years:"19th c.",role:{om:"Adamsituu fi ijaaraa magaalaa Gidaamii — akka yaada lammaffaatti maqaan isaa irraa dhufe",en:"Hunter and founder figure — second account traces the town's name to him"}}
      ]
    },
    { slug:"lalo-kile", type:"woreda",
      name:{om:"Laaloo Qilee",en:"Lalo Kile"},
      img:IMG.coffee1,
      tagline:{om:"Biyya tulluu fi seenaa — maqaan Lalo (ilma Jahaa Sayyoo) fi Kile (madda o'aa) irraa dhufe. Warqee fi pilaatiiniyam qabdi.",en:"Hill country with a deep name — Lalo (son of Jahan Sayo) and Kile (the hot spring). Gold and platinum are recorded here."},
      badges:[{icon:"mountain-snow",l:{om:"Tulluu",en:"Hills"}},{icon:"layers",l:{om:"Warqee fi Pilaatiiniyam",en:"Gold & Platinum"}},{icon:"landmark",l:{om:"Seenaa 1874",en:"Since 1874"}}],
      pop:"103,505", elev:{om:"baddaa fi gammoojjii",en:"highland & lowland"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:{om:"Laaloo",en:"Lalo"},
      coords:[8.70,35.30],
      aboutTitle:{om:"Aanaa maqaa gadi fagoo qabdu",en:"A woreda with a deep name"},
      about:[
        {om:"Laaloo Qilee aanaalee 12 godina Qeellam Wallaggaa keessaa tokko — bara 1994 A.L.I bulchiinsa Daalee Laaloo jalatti turtee booda of danda'e. Gandoonni 23 qabdi — 22 baadiyyaa fi magaalaa 1; magaalaan guddoon ishee Laaloo dha. Uummata ishee keessaa 90% baadiyyaa keessa jiraata, jireenyi isaanii qonnaa irratti hundaa'a.",en:"Lalo Kile is one of Kellem Wollega's twelve woredas — until 1994 it was under Dale Lalo before standing alone. It has 23 kebeles — 22 rural and 1 urban — capital at Lalo. About 90% of its people live rurally, making their living from farming."},
        {om:"Maqaan ishee lamaan walitti makamee dhufe: 'Laaloo' ilma Jahaa Sayyoo — sanyii Maccaa Oromoo; 'Kile' immoo madda o'aa laga Kilee bira ganda Marfoo keessatti jiru irraa. Maanguddoonni aanaan kun bara 1874 A.L.I irraa bulchiinsa mataa ishee akka qabdu dubbatu. Bara 1994 A.L.I of danda'erus seenaan bulchiinsaa waggaa 150 olii dheerata.",en:"The name joins two roots: 'Lalo', the son of Jahan Sayo of the Machaa Oromo, and 'Kile', the hot spring beside the Kile river in Marfo Kebele. Elders say the woreda has governed itself since 1874 E.C. — even though formal independence came in 1994, its administrative history spans more than 150 years."},
        {om:"Ragaan Kaartaa Itoophiyaa (1988) warqee fi pilaatiiniyam Laaloo Qilee keessatti argamuu ibsa — pilaatiiniyamiin aanaa kana keessatti baasuun jalqabaa jira. Tulluuwwan ishee lafa qonnaa fi bunaaf gaaddisa gaarii kennu.",en:"EMA 1988 records gold and platinum in Lalo Kile — platinum extraction is beginning here. The hills provide good shade for coffee and farmland."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"103,505"},
        {l:{om:"Gandoota",en:"Kebeles"},v:{om:"22 baadiyyaa + 1 magaalaa",en:"22 rural + 1 urban"}},
        {l:{om:"Magaalaa Guddoo",en:"Capital"},v:{om:"Laaloo",en:"Lalo"}},
        {l:{om:"Hundeefame",en:"Established"},v:{om:"1874 A.L.I. irraa (akka maanguddootti)",en:"since 1874 E.C. (per elders)"},n:{om:"Bara 1994 of danda'e",en:"independent 1994"}},
        {l:{om:"Maqaa",en:"Name origin"},v:{om:"Laaloo (ilma Jahaa Sayyoo) + Kile (madda o'aa)",en:"Lalo (son of Jahan Sayo) + Kile (hot spring)"}},
        {l:{om:"Mineraalota",en:"Minerals"},v:{om:"Warqee, Pilaatiiniyam",en:"Gold, platinum"},n:{om:"EMA 1988",en:"EMA 1988"}},
        {l:{om:"Jireenya",en:"Livelihood"},v:{om:"Qonnaa 90%",en:"Farming 90%"}}
      ],
      gallery:[IMG.coffee1,IMG.hills2,IMG.grain,IMG.valley]
    },
    { slug:"sadi-chanka", type:"woreda",
      name:{om:"Sadii Canqaa",en:"Sadi Chanka"},
      img:IMG.river,
      tagline:{om:"Aanaa seenaa Sadii Akkayyuu — goota jaarraa 17ffaa. Daandii guddaan Finfinnee–Dambi Doolloo ishee jidduu darba. Finchaa Kunii, Holqa Kunii fi Miidagaa Birbir of keessaa qabdi.",en:"The woreda of Sadii Akkayyuu, a 17th-century pioneer. The main Finfinnee–Dembi Dolo asphalt road passes through; attractions include Kuni Falls, Kuni Cave and Midagabirbir."},
      badges:[{icon:"route",l:{om:"Daandii Guddaa",en:"Main Road"}},{icon:"landmark",l:{om:"Sadii Akkayyuu",en:"Sadii Akkayyuu"}},{icon:"droplet",l:{om:"Finchaa Kunii",en:"Kuni Falls"}}],
      pop:"116,095", elev:{om:"Kola 85% · Woyina Deega 15%",en:"Kola 85% · Woyinadega 15%"},
      key:{om:"Buna fi midhaan",en:"Coffee & grain"}, cap:{om:"Canqaa",en:"Chanka"},
      coords:[8.63,35.20],
      aboutTitle:{om:"Aanaa gootaatiin moggaafamte",en:"Named by a pioneer"},
      about:[
        {om:"Sadii Canqaa bara 2010 Daallee Waabaraa irraa adda baate. Gandoonni 15 qabdi. Canqaan Finfinnee irraa km 588, Dambi Doolloo irraa km 63 fagaattee argamti. Daandii asfaaltii guddaan Finfinnee–Dambi Doolloo magaalaa Canqaa keessa darba — imaltootaaf teessoo iddoo cisiisaa fi boqonnaa ta'a.",en:"Sadi Chanka was separated from Dale Wabera in 2010. It has 15 kebeles; Chanka lies 588 km from Finfinnee and 63 km from Dembi Dolo. The main Finfinnee–Dembi Dolo asphalt road cuts through Chanka, making it a stopover and rest point for travellers."},
        {om:"Bal'inni ishee km² 493.51; haalli qilleensaa Kola 85% (ho'aa) fi Woyina Deega 15% (qorraa fi jiidhaa) dha. Lageen Kettoo, Kunii, Bururii fi Adaamii ishee jidduu yaa'u. Daawwannaan ishee: Finchaa Kunii fi Holqa Kunii (km 75 Dambi Doolloo irraa) fi Miidagaa Birbir (km 96).",en:"Area 493.51 km²; climate 85% kola (hot) and 15% woyinadega (cool, sub-humid). Rivers Keto, Kuni, Bururi and Adami drain it. Attractions: Kuni Waterfall and Cave (75 km) and Midagabirbir (96 km from Dembi Dolo)."},
        {om:"Maqaan 'Sadii Canqaa' goota jaarraa 17ffaa Sadii Akkayyuu irraa dhufe. Odaa Nabee irraa ka'ee miiltoowwan isaa fi sangaa qonnaa waliin gara dhiha Oromiyaatti imale; Daallee Sadii keessatti Mucoo Ogiyoo jedhamutti sangaan isaa ciisee ka'uu dide. Sadii achumatti buufata godhate, lafa qabatee babal'ise — daangaan isaa bahaan Mucoo Ogiyoo, dhihaan Lagaa Qexoo, kaabaan Qilxuu Ciisii fi kibbaan Lagaa Birbir ta'e. Lafa kana 'Biyya Sadii' jedhame — achii maqaan 'Sadii Canqaa' dhufe.",en:"The name comes from the 17th-century pioneer Sadii Akkayyuu, who set out from Odaa Nabee with companions and his ploughing ox into western Oromia. In today's Dale Sadi his ox lay down at Mucoo Ogiyoo and refused to rise, so Sadii settled there and expanded his land — bounded east by Mucoo Ogiyoo, west by Qexoo river, north by Qilxuu Ciisii and south by Birbir river. The land became 'Biyya Sadii' — from which 'Sadi Chanka' derives."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"116,095"},
        {l:{om:"Bal'ina",en:"Area"},v:"493.51 km²"},
        {l:{om:"Hundeefame",en:"Established"},v:{om:"Bara 2010",en:"2010 E.C."},n:{om:"Daallee Waabaraa irraa",en:"from Dale Wabera"}},
        {l:{om:"Haala qilleensaa",en:"Climate"},v:{om:"Kola 85% · Woyina Deega 15%",en:"Kola 85% · Woyinadega 15%"}},
        {l:{om:"Daandii",en:"Road"},v:{om:"Asfaaltii Finfinnee–Dambi Doolloo",en:"Finfinnee–Dembi Dolo asphalt"}},
        {l:{om:"Daawwannaa",en:"Attractions"},v:{om:"Finchaa Kunii · Holqa Kunii · Miidagaa Birbir",en:"Kuni Falls · Kuni Cave · Midagabirbir"}}
      ],
      gallery:[IMG.river,IMG.falls,IMG.coffee1,IMG.hills1],
      placesList:[
        {name:{om:"Finchaa Kunii",en:"Kuni Waterfall"},short:{om:"Finchaa bishaanii — km 75 Dambi Doolloo irraa; Holqa Kunii isaa wajjin.",en:"A waterfall 75 km from Dembi Dolo — Kuni Cave stands beside it."},type:{om:"Finchaa",en:"Waterfall"},img:IMG.falls},
        {name:{om:"Holqa Kunii",en:"Kuni Cave"},short:{om:"Holqa Finchaa Kunii bira — daawwannaa bakka tokkoo lama.",en:"A cave beside Kuni Falls — one visit, two sights."},type:{om:"Holqa",en:"Cave"},img:IMG.mountain}
      ],
      notable:[
        {name:{om:"Sadii Akkayyuu",en:"Sadi Akkayyu"},years:"mid-1600s",role:{om:"Goota jaarraa 17ffaa — Odaa Nabee irraa ka'ee Biyya Sadii bu'uureffate; maqaan isaa Sadii Canqaa jedhame.",en:"17th-century pioneer from Odaa Nabee who founded Biyya Sadii, after whom Sadi Chanka is named."}}
      ]
    },
    { slug:"jimma-horo", type:"woreda",
      name:{om:"Jimmaa Horroo",en:"Jimma Horo"},
      img:IMG.grain,
      tagline:{om:"Aanaa kaaba godinaa — madda bishaanii 201+, bosona Siiraa Rejjii eegamaa, simbirroota 73+ fi midhaan bal'aa.",en:"A northern woreda of 201+ springs, the protected Sira Rejji forest, 73+ bird species and wide grain fields."},
      badges:[{icon:"droplet",l:{om:"Madda Bishaanii 201+",en:"201+ Springs"}},{icon:"tree-pine",l:{om:"Bosona Siiraa Rejjii",en:"Sira Rejji Forest"}},{icon:"wheat",l:{om:"Midhaan",en:"Grain"}}],
      pop:"75,783", elev:{om:"Baddaa 19.7% · Woyina Deega 48.5% · Kola 31.8%",en:"Dega 19.7% · Woyinadega 48.5% · Kola 31.8%"},
      key:{om:"Midhaan",en:"Grain"}, cap:"—",
      coords:[8.92,34.82],
      aboutTitle:{om:"Madda bishaanii fi bosona",en:"Springs and forest"},
      about:[
        {om:"Jimmaa Horroo aanaa kaaba godina Qeellam Wallaggaa ti, Gaawoo Qeebbee fi Gidaamii gidduutti argamti. Madda bishaanii 201 ol qabdi; lageen Kumbabee, Bildiimaa, Supee, Agaamii, Taabulii, Burar, Iluu Burar fi Fiincaa ishee jidduu yaa'u — Burariin qurxummii qabuu, dhugaatii horii fi qulqullinaaf tajaajila.",en:"Jimma Horo is a northern woreda, between Gawo Kebe and Gidami. Over 201 springs rise in it; the Kumbabe, Bildima, Supe, Agami, Tabul, Burar, Ilu Burar and Finca rivers drain through — the Burar supports fishing, livestock watering and sanitation."},
        {om:"Haalli qilleensaa ishee Baddaa 19.7%, Woyina Deega 48.5% fi Kola 31.8% dha; roobni waggaa mm 700–1,000, ho'i 11–25°C. Bosona uumamaa hektaara 14,632 qabdi; bosonni Siiraa Rejjii (hektaara 4,632) waajjira qonnaatiin eegama. Bineensota bosonaa — water buck, golden jackal, dukula, leenca, gafarsa, booyyee fi roobii — fi simbirroota gosa 73 ol of keessaa qabdi.",en:"Climate: 19.7% dega, 48.5% woyinadega, 31.8% kola; rainfall 700–1,000 mm, temperature 11–25°C. Natural vegetation covers 14,632 ha; Sira Rejji forest (4,632 ha) is protected by the agricultural office. Wild animals — water buck, golden jackal, dukula, lion, buffalo, warthog, hippo — and more than 73 bird species live here."},
        {om:"Waldaalee qonnaa 22 jiru; midhaan, buna fi horiin jireenya gandaaf bu'uura. Waldaalee qonnaatiin bosona eeguun eegumsi hawaasaa fi mootummaa waliin ta'aa jira.",en:"There are 22 farmers' associations; grain, coffee and livestock are the base of village life. Forest protection is shared between community and government."}
      ],
      facts:[
        {l:{om:"Baay'ina Uummataa",en:"Population"},v:"75,783"},
        {l:{om:"Madda bishaanii",en:"Springs"},v:"201+"},
        {l:{om:"Haala qilleensaa",en:"Climate"},v:{om:"Baddaa 19.7% · Woyina Deega 48.5% · Kola 31.8%",en:"Dega 19.7% · Woyinadega 48.5% · Kola 31.8%"}},
        {l:{om:"Rooba",en:"Rainfall"},v:{om:"mm 700–1,000",en:"700–1,000 mm"}},
        {l:{om:"Ho'a",en:"Temperature"},v:"11–25°C"},
        {l:{om:"Bosona",en:"Forest"},v:{om:"Uumamaa ha 14,632; Siiraa Rejjii eegamaa",en:"14,632 ha natural; Sira Rejji protected"},n:{om:"4,632 ha",en:"4,632 ha"}},
        {l:{om:"Waldaa qonnaa",en:"Farmers associations"},v:"22"},
        {l:{om:"Simbirroota",en:"Birds"},v:"73+"}
      ],
      gallery:[IMG.grain,IMG.hills2,IMG.forest2,IMG.valley],
      placesList:[
        {name:{om:"Bosona Siiraa Rejjii",en:"Sira Rejji Forest"},short:{om:"Bosona eegamaa — hektaara 4,632; simbirrootni fi bineensonni keessa jiraatu.",en:"A protected forest of 4,632 ha — home to birds and wild animals."},type:{om:"Bosona eegamaa",en:"Protected forest"},img:IMG.forest2}
      ]
    }
  ],

  zonePeople: [
    { name:{om:"Dr. Nagaasoo Gidaadaa",en:"Dr. Negasso Gidada"}, years:"1943–2019", role:{om:"Pireezidaantii FDRE isa jalqabaa (1995–2001)",en:"First President of the FDRE (1995–2001)"}, bio:{om:"Dambi Doolloo keessatti Fulbaana 8, 1943 dhalate; qorannoo seenaa Sayyoo Oromoo raawwate; bara 1995–2001 Pireezidaantii Federeeshinii Itoophiyaa ta'uu dha.",en:"Born 8 September 1943 in Dembi Dolo; earned a doctorate researching the history of the Sayyoo Oromo; served as the first President of the Federal Democratic Republic of Ethiopia from 1995 to 2001."}, link:"/place/dembi-dollo", img:IMG.drNegaasoo },
    { name:{om:"Oliiqaa Dingil Bookaa",en:"Oliqa Dingil Booka"}, years:"c.1890–1930s", role:{om:"Goota Baddaa Sayyoo — qabsoo ittisa koloneeffataa",en:"Hero of the Sayo highlands — anti-colonial leader"}, bio:{om:"Yamaalogii Walal, Deentaa Garee keessatti dhalate; Caamsaa 23, 1929 bosona seenee waraana Fiincoofi Dubbisiifi Taajoo keessatti injifannoo galmeesse; du'i isaa summii qabsoo irratti kufsiisuudhaan Oddoo Butaatti dhufe.",en:"Born at Deentaa Garee in Gurraatti Walal, Yemalogi Welel; on 23 May 1929 he took to the forest and led anti-colonial resistance, winning major battles at Fincho, Dubbisi and Tajo; he died by poisoning at Oddoo Butaa. A statue in his honour is planned for Dembi Dolo."}, link:"/place/yemalogi-welel", img:IMG.oliqaaDingil },
    { name:{om:"Jootee Tulluu",en:"Jote Tulu (Dejazmach)"}, years:"d. 1932", role:{om:"Abbaa Bulchaa Leqaa Qellem — Mootii Sayyoo",en:"Ruler of Leqa Qellem — King of Sayo"}, bio:{om:"Abbaa Bulchaa Leqaa Qellem; qomoo 'Afteer' irratti loluun booda bara 1884 teessoo mootummaa isaa Gidaamiitti jijjiire; daldala bunaafi qabeenya biyyattiif bu'uura kenne.",en:"Ruler of the Leqa Qellem kingdom; after defeating the Afteer clan in 1884 he moved his seat to Gidami, laying the foundations for long-distance trade, including coffee, across the region."}, link:"/place/sayo" },
    { name:{om:"Sadii Akkayyuu",en:"Sadi Akkayyu"}, years:"mid-1600s", role:{om:"Goota jaarraa 17ffaa — Biyya Sadii bu'uureffataa",en:"17th-century pioneer — founder of Biyya Sadii"}, bio:{om:"Odaa Nabee irraa ka'ee dhiha Oromiyaatti imale; Mucoo Ogiyoo jedhamutti sangaan isaa ciisee ka'uu didnaan achumatti buufate; lafa qabatee babal'ise — achii Sadii Canqaa maqaa argatte.",en:"A 17th-century Oromo pioneer who migrated west from Odaa Nabee with his companions and ploughing ox; when his ox lay down and refused to rise at Mucoo Ogiyoo in today's Dale Sadi area he settled there, founded Biyya Sadii and gave his name to Sadi Chanka."}, link:"/place/sadi-chanka" },
    { name:{om:"Gidaamii Guus Agaloo",en:"Gidami Guus Agalo"}, years:"19th c.", role:{om:"Adamsituu fi ijaaraa magaalaa Gidaamii",en:"Hunter and founder figure of Gidami town"}, bio:{om:"Akka yaada lammaffaatti, Shawaa Lixaa irraa dhufee bineensa adamsuuf gara dhihaa godinaa kan dhufe; bosona ciree jiraachuun maqaan isaa Gidaami jedhamee moggaafame.",en:"According to one founding account, a skilled hunter from West Shewa who ventured west in pursuit of game, cleared the forest and settled there — giving his name to Gidami."}, link:"/place/gidami" },
    { name:{om:"Jaal Laggasaa Wagii Meettaa",en:"Jaal Laggasa Wagi Metta"}, years:"1960–", role:{om:"Qabsaa'aa fi hogganaa dhiha Oromiyaa",en:"Revolutionary and western Oromia leader"}, bio:{om:"Kuyyuu Giccii, Shawaa Lixaa keessatti dhalate; umuriin isaa waggaa 15 dura Kaabii Qellemitti makame; lola Anfilloo fi Gaawoo Qeebbee keessatti hirmaate.",en:"Born at Kuyyuu Giccii in West Shewa; by age 15 he had joined the Qellem Kabo struggle and fought in the Anfillo and Gawo Kebe areas."}, link:"/place/gawo-kebe" }
  ],

  timeline: [
    { year:"mid-1600s", t:{om:"Sadii Akkayyuu — Biyya Sadii",en:"Sadii Akkayyuu — Biyya Sadii"}, txt:{om:"Gootichi Sadii Akkayyuu Odaa Nabee irraa ka'ee dhiha Oromiyaatti imale; lafa qabatee 'Biyya Sadii' moggaase — achii Sadii Canqaa maqaa argatte.",en:"Pioneer Sadii Akkayyuu travelled from Odaa Nabee into western Oromia, claimed land and named it 'Biyya Sadii' — root of today's Sadi Chanka."} },
    { year:"1730–1886", t:{om:"Yeroo Sayyoo Oromoo",en:"The Sayyoo Oromo era"}, txt:{om:"Seenaan Sayyoo Oromoo seenaa gadi fagoo godina kanaati — gosoota isaanii, gadaa fi lafa qonnaa; Qorannoon Dr. Nagaasoo waa'ee isaanii barreesse.",en:"The Sayyoo Oromo era is the deep history of the zone — clans, gadaa and farmland; documented by Dr Negasso Gidada's doctoral research."} },
    { year:"1874", t:{om:"Laaloo Qilee bulchiinsa argatte",en:"Lalo Kile gains its administration"}, txt:{om:"Akka maanguddootti, aanaan Laaloo Qilee bara 1874 irraa bulchiinsa mataa ishee qabdi.",en:"Elders record that Lalo Kile has governed itself since 1874."} },
    { year:"1884", t:{om:"Jootee Tulluu gara Gidaamiitti",en:"Jote Tulu moves to Gidami"}, txt:{om:"Jootee Tulluu qomoo 'Afteer' irratti loluun booda teessoo mootummaa isaa gara Gidaamiitti jijjiire.",en:"After campaigning against the Afteer clan, Jote Tulu moved his seat of government to Gidami."} },
    { year:"1898/1903", t:{om:"Hundeeffama Dambi Doolloo",en:"The founding of Dembi Dolo"}, txt:{om:"Ragaaleen afaanii hundeeffama Dambi Doolloo bara 1898 ykn 1903 dubbatu — muka dambii jalatti Obbo Dolloo fi daldaltoonni boqatan.",en:"Oral records place Dembi Dolo's founding in 1898 or 1903 — beneath the dambi tree where Obbo Dolloo and traders rested."} },
    { year:"c.1890", t:{om:"Dhaloota Oliiqaa Dingil Bookaa",en:"Birth of Oliqa Dingil Booka"}, txt:{om:"Oliiqaa Dingil Yamaalogii Walal, Deentaa Garee keessatti dhalate.",en:"Oliqa Dingil was born at Deentaa Garee, Gurraatti Walal in Yemalogi Welel."} },
    { year:"1929", t:{om:"Qabsoo Oliiqaa Dingil",en:"The resistance of Oliqa Dingil"}, txt:{om:"Caamsaa 23, 1929 Oliiqaa Dingil bosona seenee qabsoo geggeesse; Fiincoofi Dubbisi fi Taajoo keessatti injifannoo galmeesse.",en:"On 23 May 1929 Oliqa Dingil took to the forest and led anti-colonial resistance, winning battles at Fiinchoofi Dubbisi and Tajo."} },
    { year:"1933", t:{om:"Bulchiinsa magaalaa Dambi Doolloo",en:"Dembi Dolo municipality"}, txt:{om:"Bulchiinsi magaalaa Dambi Doolloo bara 1933 hundeefame.",en:"Dembi Dolo municipal administration was founded in 1933."} },
    { year:"1941", t:{om:"Beekamtii seeraa",en:"Legal recognition"}, txt:{om:"Dambi Doolloo bara 1941 beekamtii seeraa argatte.",en:"Dembi Dolo gained legal recognition in 1941."} },
    { year:"1943", t:{om:"Dhaloota Dr. Nagaasoo Gidaadaa",en:"The birth of Dr Negasso Gidada"}, txt:{om:"Fulbaana 8, 1943 Dr. Nagaasoo Gidaadaa Dambi Doolloo keessatti dhalate.",en:"Dr Negasso Gidada was born in Dembi Dolo on 8 September 1943."} },
    { year:"1995–2001", t:{om:"Pireezidaantii FDRE",en:"Presidency of the FDRE"}, txt:{om:"Dr. Nagaasoo Gidaadaa Pireezidaantii FDRE isa jalqabaa ta'e.",en:"Dr Negasso Gidada served as the first President of the FDRE."} },
    { year:"1998", t:{om:"Magaalaa guddittii godinaa; aanaalee haaraa",en:"Zonal capital; new woredas"}, txt:{om:"Dambi Doolloo bara 1998 magaalaa guddittii godinaa taate; Gaawoo Qeebbee fi Yamaalogii Walal Amajjii 1998 adda baafaman.",en:"Dembi Dolo became zonal capital in 1998; Gawo Kebe and Yemalogi Welel were demarcated in January 1998."} },
    { year:"2010", t:{om:"Sadii Canqaa of dandaate",en:"Sadi Chanka stands alone"}, txt:{om:"Sadii Canqaa bara 2010 Daallee Waabaraa irraa adda baate.",en:"Sadi Chanka was separated from Dale Wabera in 2010."} },
    { year:"2026", t:{om:"Eebba pirojektoota Dambi Doolloo",en:"Dembi Dolo project inauguration"}, txt:{om:"Pirojektoonni gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman Galma Oliiqaa Dingil, Kooridarii magaalaa, Kilaasterota, Kaaffee Tekinooloojii fi marfata magaalichaa dabalatee eebbifaman.",en:"Projects worth more than 650 million Birr were inaugurated — the Grand Oliqa Dingil Hall, city corridor, clusters, the Science Café and the city road network."} }
  ],

  news: [
    { id:"dembi-dollo-inauguration-2026", type:"news", date:"2026-08-21", cat:{om:"Misooma",en:"Development"}, place:{om:"Dambi Doolloo",en:"Dembi Dolo"},
      title:{om:"Magaalaa Dambi Doollootti pirojektiiwwan gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman eebbifamaa jiru",en:"Projects worth over 650 million Birr inaugurated in Dembi Dolo"},
      excerpt:{om:"Guyyaa har'aa galmi Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame, misooma kooridarii magaalichaa, kilaasterota, Kaaffee Tekinooloojii fi marfata magaalichaa bakka keessummootni sadarkaa garaagaraa argamanitti eebbifamaa jiru.",en:"Today the Grand Oliqa Dingil Hall, built at more than 425 million Birr, is being inaugurated before guests of all levels — together with the city corridor development, multi-purpose clusters, the Science & Technology Café and the city road network."},
      body:{om:"Magaalaa Dambi Doollootti pirojektiiwwan gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman eebbifamaa jiru. Magaalichatti guyyaa har'aa galma Oliiqaa Dingil qarshii Miliyoona 425 oliin ijaarame, misooma Kooridarii magaalichaa, kilaasterota, Kaaffee tekinooloojii, marfata magaalichaafi kkf'n bakka keessummootni sadarkaa garaagaraa argamanitti eebbifamaa jiru.\n\nAddatti galmi Oliiqaa Dingil guddichi ijaarsi isaa bara 2016 eegalame meeshaalee tekinooloojii hedduun kan uwwifame, Kutaa/alee 11, Galma guddaa 1, Galma giddu galeessaa 1, kaaffeefi bakka bashannanaa kan of keessaa qabuudha.\n\nKantiibaan Magaalaa Dambi Doolloo Obbo Girmaa Dangalaa magaalaa hawwattuufi bareedduu uumuuf pirojektiiwwan 32 ol hojjetamaa jiraachuu himan. Bulchaan Godina Qellem Wallaggaa Obbo Gammachuu Gurmeessaa waggoota arfan darban Mootummaa jijjiiramaan Godinichatti pirojektootni gosa garaagaraa kuma 2fi 284 qarshii Biliyoona 17 oliin hojjetamee xumuramuun hawaasa fayyadamoo taasisuu himan.\n\nIttaanaa Hoogganaan Waajjira Pirezidaantii Mootummaa Naannoo Oromiyaa Dr. Utukaanaa Odaa mootummaan naannoo Oromiyaa uummata isaa barnootaafi tekinooloojii, diinagdeefi sirna jabaa ijaaruuf hojiin hojjetamaa jiru sadarkaa olaanaan milkaa'aa jiraachuu himanii; eebbi pirojektii guyyaa har'aas qaama sanaa ta'uu himan.",
      en:"Multiple development projects built at a cost of more than 650 million Birr are being inaugurated in Dembi Dolo today. In the presence of guests from every level of administration, the Grand Oliqa Dingil Hall — constructed for over 425 million Birr — is being officially opened, together with the city corridor development, multi-purpose service clusters, the Oromia Science & Technology Authority Science Café, and the city road network.\n\nThe Grand Oliqa Dingil Hall itself, construction of which began in 2016 E.C., is equipped with modern technology facilities and comprises 11 rooms/units, one grand hall, one secondary hall, a cafeteria and recreation areas.\n\nThe Mayor of Dembi Dolo city, Obbo Girma Dangala, reported that more than 32 projects are currently underway to build a desirable and beautiful city. The Chief Administrator of Kellem Wollega Zone, Obbo Gammachuu Gurmesa, stated that under the reform government of the last four years, 2,284 projects of various kinds worth more than 17 billion Birr have been completed and put into service for the people of the zone.\n\nDr. Utukanaa Odaa, Deputy Head of the Office of the President of the Oromia Regional State, said that the regional government's work in education, technology, economy and institution-building is succeeding at a high level, and that today's inauguration is part of that progress."},
      img:IMG.dembiHall,
      gallery:[IMG.inauguration3, IMG.dembiHall, IMG.dembiHall2, IMG.inauguration1, IMG.dembiCity],
      source:{om:"Waajjira Oduu Godina Qeellam Wallaggaa",en:"Kellem Wollega Zone Communication Office"}
    },
    { id:"coffee-2026", type:"news", date:"2026-08-08", cat:{om:"Dinagdee",en:"Economy"}, place:{om:"Godina Qeellam",en:"Kellem Wollega"},
      title:{om:"Oomishni buna godinaa toonnii 134,213 gahe",en:"Zone coffee production recorded at 134,213 tonnes"},
      excerpt:{om:"Ragaan waajjira godinaa: lafti bunaaf mijatu hektaara 585,945; bara 2016 A.L.I hektaara 484,841 uwwifamee toonnii 134,213 oomishame.",en:"Official zone figures: 585,945 ha of coffee potential; in 2016 E.C. 484,841 ha were covered and 134,213 tonnes produced."},
      body:{om:"Akka ragaa waajjira godinaatti, bara 2015 A.L.I hektaara 467,301 bunaan uwwifamee toonnii 134,888 oomishame; bara 2016 A.L.I immoo hektaara 484,841 uwwifamee toonnii 134,213 oomishame. Gara gabaadhaatti kan ce'e toonnii 29,254 (2015) fi 34,288 (2016). Waldaaleen 817 miseensota 156,500 waliin oomisha kana gabaaf qopheessu.",en:"According to the zone profile, 467,301 ha produced 134,888 tonnes in 2015 E.C.; in 2016 E.C., 484,841 ha produced 134,213 tonnes. To the central market went 29,254 tonnes (2015) and 34,288 tonnes (2016). 817 cooperatives with 156,500 members channel the harvest to market."},
      img:IMG.coffee1 },
    { id:"walal-2026", type:"news", date:"2026-07-14", cat:{om:"Naannoo",en:"Environment"}, place:{om:"Gaawoo Qeebbee",en:"Gawo Kebe"},
      title:{om:"Paarkiin Dhaatii Walaal — mana dhiisaa bineensota baduuf jiraniif",en:"Dati Walal Park — a last home for species at risk"},
      excerpt:{om:"Hektaara 103,500 bosona roobaa; bineensota 20+ fi simbirroota 150+.",en:"103,500 ha of rain forest; 20+ mammal and 150+ bird species."},
      body:{om:"Paarkiin Dhaatii Walaal labsii 87/2005 fi dambii 122/2009tiin hundeefame; Caamsaa 25, 2012 beekamtii argate. Roobii, gafarsa, leenca of keessaa qaba — IUCN'n balaaf saaxilamoo ta'an. Daawwattoonni qajeelchaa naannoo waliin daawwachuun qajeelfama kennamaaf jira.",en:"Dati Walal was established by proclamation 87/2005 and regulation 122/2009, gazetted 25 May 2012. It is home to hippo, buffalo and lion — IUCN-listed vulnerable species. Visits with a local guide are recommended."},
      img:IMG.forest1 },
    { id:"gold-2026", type:"news", date:"2026-06-03", cat:{om:"Mineraala",en:"Minerals"}, place:{om:"Godina Qeellam",en:"Kellem Wollega"},
      title:{om:"Warqee aanaalee shan keessatti argama",en:"Gold recorded in five woredas"},
      excerpt:{om:"Ragaan EMA (1988): warqee Anfilloo, Daallee Waabaraa, Haawwaa Galaan, Laaloo Qilee fi Sayyoo keessatti.",en:"EMA (1988): gold in Anfillo, Dale Wabera, Hawa Gelan, Lalo Kile and Sayo."},
      body:{om:"Mineraalonni godina keessatti argaman warqee, pilaatiiniyam (Laaloo Qilee), tantaalam (Sayyoo) fi yuureniyam (Anfilloo, Sayyoo) dha. Pilaatiiniyamiin Laaloo Qilee keessatti baasuun jalqabaa jira.",en:"Known minerals include gold, platinum (Lalo Kile), tantalum (Sayo) and uranium (Anfillo, Sayo). Platinum extraction is beginning in Lalo Kile."},
      img:IMG.mountain },
    { id:"honey-2026", type:"news", date:"2026-05-19", cat:{om:"Qonna",en:"Agriculture"}, place:{om:"Godina Qeellam",en:"Kellem Wollega"},
      title:{om:"Gaagura dammaa 473,300 — qabeenya guddaa",en:"473,300 beehives — honey's big potential"},
      excerpt:{om:"Gaagura 473,300 (2015 A.L.I); teeknooloojii ammayyaa guddinaaf barbaaddi.",en:"473,300 hives (2015 E.C.) — modern methods are the answer to lift output."},
      body:{om:"Gaagura dammaa 473,300 (2015) fi 339,193 (2016) jiru. Oomishni garuu gadi aanaa dha — gaagura ammayyaa guddina oomishaa fida.",en:"The zone counts 473,300 hives (2015) and 339,193 (2016). Output remains low — modern hives will significantly raise production."},
      img:IMG.forest2 },
    { id:"health-2026", type:"news", date:"2026-04-22", cat:{om:"Fayyaa",en:"Health"}, place:{om:"Godina Qeellam",en:"Kellem Wollega"},
      title:{om:"Fayyaa godinaa lakkoofsota ragaa irraa",en:"Zone health in numbers"},
      excerpt:{om:"Hospitaalota 4, buufata fayyaa 51, kellaa fayyaa 256.",en:"4 hospitals, 51 health centres, 256 health posts."},
      body:{om:"Hospitaalota 4, buufata fayyaa 51, kellaa fayyaa 256, mana qorichaa 372. Doktorri tokko uummata 43,960 tajaajila.",en:"4 hospitals, 51 health centres, 256 health posts and 372 drug vendors. One doctor currently serves 43,960 people."},
      img:IMG.people },
    { id:"schools-2026", type:"news", date:"2026-03-09", cat:{om:"Barnoota",en:"Education"}, place:{om:"Godina Qeellam",en:"Kellem Wollega"},
      title:{om:"Barattoota 348,516 godina keessatti baratu",en:"348,516 students learning across the zone"},
      excerpt:{om:"Mana barumsaa 1–8 mootummaa 452, 9–12 50, koolleejjii barsiisota 1 fi yuunivarsiitii 1.",en:"452 government primary schools, 50 secondary schools, one teachers' college and one university."},
      body:{om:"Bara 2016 A.L.I manneen barumsaa 1–8 mootummaa 452, 9–12 50, koolleejjii barsiisota 1 fi yuunivarsiitii 1 jiru — barattoonni 348,516.",en:"In 2016 E.C. the zone had 452 government primary, 50 secondary schools, one teachers' college and one university — 348,516 students enrolled."},
      img:IMG.village }
  ],

  // Trusted partners / sponsors shown in the marquee on the homepage
  sponsors: [
    { name:{om:"Bulchiinsa Godina Qeellam Wallaggaa",en:"Kellem Wollega Zone Administration"}, initials:"KW", tint:"brand" },
    { name:{om:"Waajjiira Oduu Godina Qeellam",en:"Kellem Wollega Communication Office"}, initials:"CO", tint:"gold" },
    { name:{om:"Yuunivarsiitii Dambi Doolloo",en:"Dembi Dolo University"}, initials:"DD", tint:"brand" },
    { name:{om:"Bulchiinsa Magaalaa Dambi Doolloo",en:"Dembi Dolo City Administration"}, initials:"DC", tint:"gold" },
    { name:{om:"Waajjira Qonnaa Godinaa",en:"Zone Agriculture Office"}, initials:"AG", tint:"brand" },
    { name:{om:"Waajjira Tuurizimii Godinaa",en:"Zone Culture & Tourism Office"}, initials:"CT", tint:"gold" },
    { name:{om:"Waajjira Saayinsii fi Teek.",en:"Oromia Science & Technology Auth."}, initials:"ST", tint:"brand" },
    { name:{om:"Waldaa Bunaa Qeellam",en:"Kellem Coffee Cooperatives Union"}, initials:"KC", tint:"gold" },
    { name:{om:"Abbaa Taayitaa Daandii Oromiyaa",en:"Oromia Roads Authority"}, initials:"OR", tint:"brand" },
    { name:{om:"Dhaabbata Qabeenya Biyyoolessaa",en:"Cultural Heritage Authority"}, initials:"CH", tint:"gold" }
  ],

  // Project supporters / patrons (showcased on the Support page)
  supporters: [
    { name:{om:"Obbo Gammachuu Gurmeessaa",en:"Ato Gammachuu Gurmesa"}, role:{om:"Bulchaa Godina Qeellam Wallaggaa",en:"Chief Administrator, Kellem Wollega Zone"}, initials:"GG" },
    { name:{om:"Obbo Girmaa Dangalaa",en:"Ato Girma Dangala"}, role:{om:"Kantiibaa Magaalaa Dambi Doolloo",en:"Mayor, Dembi Dolo City"}, initials:"GD" },
    { name:{om:"Dr. Utukaanaa Odaa",en:"Dr. Utukana Oda"}, role:{om:"Itt. Hoog. Waajjira Pirezidaantii Oromiyaa",en:"Deputy Head, Office of the President, Oromia"}, initials:"UO" },
    { name:{om:"Waajjira Tuurizimii Qeellam",en:"Kellem Culture & Tourism Office"}, role:{om:"Deeggarsa qorannoo fi suuraa",en:"Research & photography partner"}, initials:"KT" },
    { name:{om:"Hawaasa Qeellam Wallaggaa",en:"The People of Kellem Wollega"}, role:{om:"Seenaa fi qabeenya — hundee fuula kanaa",en:"The story and soul of this site"}, initials:"HW" },
    { name:{om:"Qonnaan bultootaa fi Waldaalee",en:"Farmers & Cooperatives"}, role:{om:"817 waldaalee, miseensota 156,500",en:"817 co-ops · 156,500 members"}, initials:"FW" }
  ],

  events: [
    { id:"irreecha", type:"event", date:"2026-09-27", cat:{om:"Aadaa",en:"Culture"}, place:{om:"Madda bishaanii",en:"Local water sites"},
      title:{om:"Ayyaana Irreechaa",en:"Irreecha celebration"},
      excerpt:{om:"Irreecha ayyaana galataa Oromoo — hawaasni madda bishaanii irratti walga'a.",en:"Irreecha, the Oromo thanksgiving, gathers communities at the water."},
      body:{om:"Hawaasni Qeellam Irreecha madda bishaanii irratti kabaja — galata, faaruu fi walga'ii hawaasaa.",en:"Communities across Kellem mark Irreecha at local water sites — thanksgiving, song and gathering."},
      img:IMG.sunset },
    { id:"harvest", type:"event", date:"2026-10-15", cat:{om:"Qonna",en:"Agriculture"}, place:{om:"Waldaalee bunaa",en:"Coffee cooperatives"},
      title:{om:"Yeroo sanyii bunaa",en:"Coffee harvest season"},
      excerpt:{om:"Waldaaleen buna godinaa 817 — miseensota 156,500 waliin.",en:"The zone's 817 cooperatives with 156,500 members prepare for harvest."},
      body:{om:"Waldaaleen 817 miseensota 156,500 waliin. Yeroo sanyii bunaa, qonyee buna walitti qabu, qulqulleessu fi gabaaf qopheessu.",en:"817 cooperatives with 156,500 members. At harvest they gather, clean and prepare sacks for market."},
      img:IMG.coffee2 },
    { id:"markets", type:"event", date:"2026-09-03", cat:{om:"Daldala",en:"Trade"}, place:{om:"Gabaawwan godinaa",en:"Markets across the zone"},
      title:{om:"Guyyoota gabaa torbanii",en:"Weekly market days"},
      excerpt:{om:"Gabaawwan torbanii — buna, midhaan, damma fi horii.",en:"Weekly markets — coffee, grain, honey and livestock."},
      body:{om:"Gabaawwan torbanii Qeellam qabeenya naannoo guutuu walitti fidu. Daldaltoonni hayyama qaban 10,428.",en:"Weekly markets bring the zone's produce together. Licensed traders number 10,428."},
      img:IMG.market }
  ],

  stories: [
    { id:"coffee-road", date:"2026-06-20", place:{om:"Qeellam Wallaggaa",en:"Kellem Wollega"},
      excerpt:{om:"Bara 2016 A.L.I toonnii 134,213 buna oomishame — keessaa toonnii 34,288 gara gabaadhaatti ce'e.",en:"In 2016 E.C. the zone produced 134,213 tonnes of coffee — 34,288 tonnes went to the central market."},
      body:{om:"Lafa bunaaf mijatu hektaara 585,945 keessaa hektaara 484,841 bunaan uwwifameera. Ganama barii qonyee bunaatiin guutamee gara gabaawwanii fi Dambi Doollootti ce'a. Gabaadhaa ka'ee buna Qeellam gara Finfinnee fi biyya alaatti deema. Daandiin kun dhiiga daldala godichaa ti. Waldaaleen 817 miseensota 156,500 waliin qonnaan bultoota qindeessu.",en:"Of 585,945 hectares of coffee potential, 484,841 were under coffee. At first light, sacks move toward markets and Dembi Dolo, then to Finfinnee and beyond. This road is the artery of the zone's trade, with 817 cooperatives organising 156,500 farmer members."},
      img:IMG.coffee1 },
    { id:"dati-walal", date:"2026-07-02", place:{om:"Gaawoo Qeebbee",en:"Gawo Kebe"},
      title:{om:"Paarkii Dhaatii Walaal",en:"Dati Walal National Park"},
      excerpt:{om:"Hektaara 103,500 bosona roobaa — mana dhiisaa bineensota baduuf jiraniif.",en:"103,500 hectares of rain forest — a last home for species at risk."},
      body:{om:"Paarkiin Dhaatii Walaal Gaawoo Qeebbee keessatti argama — Dambi Doolloo irraa km 128. Labsii 87/2005tiin hundeeffame, Caamsaa 25, 2012 beekame. Gareen gafarsaa bishaan keessaa dhagaa gurraacha bishaan irra bololi'u fakkaata — daawwannaa addunyaa biraa hin jirre.",en:"Dati Walal Park lies in Gawo Kebe, 128 km from Dembi Dolo. Proclaimed 87/2005, gazetted 25 May 2012. Herds of hippo in the river look like huge black rocks afloat — a sight found nowhere else."},
      img:IMG.forest1 },
    { id:"dembi-name", date:"2026-03-15", place:{om:"Dambi Doolloo",en:"Dembi Dolo"},
      title:{om:"Maqaan Dambi Doolloo maal irraa argame?",en:"How Dembi Dolo got its name"},
      excerpt:{om:"Gaaddisa muka dambii jalatti — Obbo Dolloo Mishingaa eeggachaa taa'e; daldaltoonnis achitti boqatan.",en:"Under the shade of a dambi tree — Obbo Dolloo sat waiting; traders rested there too."},
      body:{om:"Godina Qeellam Wallaggaa keessatti, qabiyyee lafa warra Liiban keessaa, namichi Obbo Dolloo jedhamu laficha irratti qotee muka dambii irraa qooxii ijaarratee irra taa'ee Mishingaa isaa eeggachaa ture. Daldaltoonni Wallaggaa fi Gumbelaa jidduu darban gaaddisa muka kana jalatti aara itti galfatan, daabboo cabsatanii nyaatanii, odeeffannoo nageenya karaa fi daldalaa wal jijjiiran. Haaluma kanaan magaalaan 'Dambi Dolloo' jedhamtee waamamte — akka maanguddootni umuriin ragan dubbatan. Hundeeffamni ishee jaarraa tokkoo ol; ragaaleen afaanii bara 1898 ykn 1903 dubbatu.",en:"In the land of the Liiban, in what is now Kellem Wollega, a man called Obbo Dolloo farmed the ground and built a shelter from a dambi tree, sitting under it awaiting his mission. Traders passing between Wollega and Gambela stopped in the tree's shade to rest, eat and exchange news of the road and markets. And so the town came to be called 'Dembi Dolloo' — as the elders tell it, founded more than a century ago in 1898 or 1903."},
      img:IMG.hills1 },
    { id:"sadi-akkayyuu", date:"2026-05-14", place:{om:"Sadii Canqaa",en:"Sadi Chanka"},
      title:{om:"Sadii Akkayyuu — Biyya Sadii",en:"Sadii Akkayyuu — Biyya Sadii"},
      excerpt:{om:"Gootichi jaarraa 17ffaa keessa lafa qabate — sangaan isaa Mucoo Ogiyootti ciise.",en:"In the 17th century the pioneer claimed this land — when his ox lay down at Mucoo Ogiyoo."},
      body:{om:"Gootichi Sadii Akkayyuu Odaa Nabee irraa ka'ee miiltoowwan isaa fi sangaa qonnaa waliin gara dhiha Oromiyaatti imale. Imala dheeraa booda, Daallee Sadii keessatti iddoo Mucoo Ogiyoo jedhamutti sangaan isaa ciisee ka'uu dide. Sadii achumatti buufata godhate, lafa qabatee babal'ise — daangaan isaa bahaan Mucoo Ogiyoo, dhihaan Lagaa Qexoo, kaabaan Qilxuu Ciisii fi kibbaan Lagaa Birbir ta'e. Lafa kana 'Biyya Sadii' jedhamuun beekame — achii maqaan 'Sadii Canqaa' dhufe.",en:"Pioneer Sadii Akkayyuu set out from Odaa Nabee with his companions and ploughing ox into western Oromia. After a long journey his ox lay down at Mucoo Ogiyoo and refused to rise. Sadi settled there and expanded his land — bounded east by Mucoo Ogiyoo, west by the Qexoo river, north by Qilxuu Ciisii and south by the Birbir river. The land became known as 'Biyya Sadii' — root of today's Sadi Chanka."},
      img:IMG.valley },
    { id:"jote", date:"2026-06-05", place:{om:"Gidaamii",en:"Gidami"},
      title:{om:"Maqaan Gidaamii maal irraa argame?",en:"How Gidami got its name"},
      excerpt:{om:"Sababoota lamatu wal dubbatama — qomoo Gidaamii, ykn adamsituu Gidaamii Guus Agaloo.",en:"Two accounts are told — the Gidaamii clan, or the hunter Gidaamii Guus Agaloo."},
      body:{om:"Yaadni duraa: naannoon kun duraan bosonaan uwwifamee ture; qomoon Oromoo 'Gidaamii' jedhamu naannoo laga Gibee jiraachaa turee gara iddoo kanaatti dhufuun bosona ciree mana ijaarrate. Bara 1884 A.L.I Mootiin Jootee Tulluu namoota bosona keessa jiraatan loluun to'annaa isaa jala oolchee, magaalaa hundeessuun maqaa qomoo jiraattotaa 'Gidaamii' jedhee moggaase.\n\nYaadni lammaffaa: namicha 'Gidaamii Guus Agaloo' jedhamu Shawaa Lixaa irraa ka'ee bineensa adamsuuf dhufee, milkaa'uu dadhabee bakkuma sanatti hafee mana ijaarrate — maqaan isaa irraa dhufe jedhama. Akka seenaan ibsutti, Jootee Tulluun qomoo 'Afteer' Qellem irratti loluun booda teessoo mootummaa isaa gara Gidaamiitti jijjiire — magaalaan kun hanga ammaatti maqaa kanaan waamamti.",en:"First account: this land was once thick forest; the Oromo clan called Gidaamii, long settled near the Gibe river, came and cleared it to build homes. In 1884 E.C., King Jote Tulu brought the forest dwellers under his rule, founded the town and named it 'Gidaamii' after the clan.\n\nSecond account: a hunter called Gidaamii Guus Agaloo came from West Shewa, failed in his hunt, stayed and built a home — and the woreda took his name. After fighting the Afteer clan, Jote Tulu moved his seat of government to Gidami — the town bears the name to this day."},
      img:IMG.village },
    { id:"anfilo-forest", date:"2026-05-30", place:{om:"Anfilloo",en:"Anfillo"},
      title:{om:"Bosona Gargeedaa",en:"The Gargeda forest"},
      excerpt:{om:"Bosona uumamaa fi dhaabame walitti maku — mootummaadhaan eegama; arba, leenca fi gafarsa.",en:"A mix of natural and planted forest — protected by government, home to elephant, lion and buffalo."},
      body:{om:"Bosonni Gargeedaa Anfilloo keessatti argama — bosona uumamaa fi kan dhaabame walitti maku, mootummaadhaan kan eegamu. Naannoon isaa bineensota gurguddoo of keessaa qaba: arba, leenca, qeerroo, gafarsa, qeerransa fi kkf. Roobni mm 2,141 godina keessaa isa guddaa ta'e. Bosonni kun buna bosonaa gaaddisa kennuu dabalatee qilleensa fi biyyee eega.",en:"The Gargeda forest lies in Anfillo — a mix of natural and planted cover, government-protected. Its surroundings hold big wildlife: elephant, lion, leopard, buffalo, hyena and more. Rainfall reaches 2,141 mm, the highest in the zone. Beyond shading forest coffee, this forest guards the air and soil."},
      img:IMG.forest1 },
    { id:"springs", date:"2026-02-10", place:{om:"Daallee Waabaraa",en:"Dale Wabera"},
      title:{om:"Madda Bishaanii 358",en:"The 358 springs"},
      excerpt:{om:"Daallee Waabaraa keessatti maddi bishaanii 358 ol jira.",en:"More than 358 springs rise across Dale Wabera."},
      body:{om:"Maddi bishaanii Daallee Waabaraa jireenya gandaaf bu'uura. Bishaan isaanii dhugaatii namaa fi horiitiif oola; lageen Walleensuu, Lakormaa, Alaltuu, Bururii fi kkf immoo jallisii aadaa fi ammayyaatiif tajaajilu. Bishaan kun qabeenya aanaa kanaati.",en:"Dale Wabera's springs are the base of village life. Their water serves people and livestock; rivers Wallensu, Lakorma, Alaltu, Bururi feed traditional and modern irrigation. This water is the woreda's quiet wealth."},
      img:IMG.river }
  ]
};
