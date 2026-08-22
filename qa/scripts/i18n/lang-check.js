/* Discover Qellem — i18n flip harness (issue #87).
 *
 * Asserts the TARGET behaviour of the Afaan-Oromoo-default + Amharic flip.
 * Until #85 lands these are expected to FAIL in places — the harness exists to
 * tell the FE exactly what is missing. Drive the real language menu (React
 * store) rather than mutating the DOM so re-renders are exercised end to end.
 *
 * Usage:
 *   cd qa/scripts/i18n && npm install puppeteer-core
 *   BASE_URL=http://localhost:3000 node lang-check.js
 *
 * Exits non-zero if any check fails (CI-able once the flip lands).
 */
const puppeteer = require("puppeteer-core");

const CHROMIUM = process.env.CHROMIUM || "/usr/bin/chromium";
const BASE = process.env.BASE_URL || "http://localhost:3000";

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail: detail || "" });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

// Endonyms live in lang.name.* and are stable across languages.
const ENDONYM = { om: "Afaan Oromoo", en: "English", am: "አማርኛ" };

async function openMenuAndClick(page, code) {
  // Open the dropdown (if not already open).
  const panelOpen = await page.evaluate(() => !!document.querySelector(".lang-menu-panel"));
  if (!panelOpen) {
    await page.click("button.lang-btn");
    await new Promise((r) => setTimeout(r, 150));
  }
  const clicked = await page.evaluate((endonym) => {
    const opts = Array.from(document.querySelectorAll(".lang-menu-item, .drawer-lang-item, button"));
    const target = opts.find((o) => (o.textContent || "").trim().startsWith(endonym));
    if (!target) return { found: false, disabled: null };
    target.click();
    return { found: true, disabled: target.disabled === true || target.getAttribute("aria-disabled") === "true" };
  }, ENDONYM[code]);
  await new Promise((r) => setTimeout(r, 300));
  return clicked;
}

function htmlLang(page) {
  return page.evaluate(() => document.documentElement.getAttribute("lang"));
}

async function setLangFallback(page, code) {
  // DOM-only fallback (used only to check the font stack, which keys off
  // the <html lang> attribute and therefore needs the attribute, not the
  // store).
  await page.evaluate((c) => document.documentElement.setAttribute("lang", c), code);
  await new Promise((r) => setTimeout(r, 200));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  // 1. First paint is OM (fresh incognito context = no persisted pref).
  {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    const lang = await htmlLang(page);
    const omHero = await page.evaluate(() =>
      document.body.innerText.includes("Lafa Margaa") ||
      document.body.innerText.includes("Godina Qeellam Wallaggaa")
    );
    check("1a fresh first paint lang == om", lang === "om", `lang=${lang}`);
    check("1b OM hero visible on first paint", omHero, "");
    await ctx.close();
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});

  // 2. html lang tracks the real switcher for om and en.
  for (const code of ["om", "en"]) {
    const r = await openMenuAndClick(page, code);
    const lang = await htmlLang(page);
    check(`2a html lang == ${code} via switcher`, r.found && lang === code, `lang=${lang}`);
  }

  // 2b. Cookie persistence across reload (switch to om, reload, still om).
  await openMenuAndClick(page, "om");
  await page.reload({ waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 600));
  {
    const lang = await htmlLang(page);
    check("2b persisted lang survives reload (om)", lang === "om", `lang=${lang}`);
  }

  // 4. Ethiopic font stack only when lang=am (attribute-driven).
  await setLangFallback(page, "om");
  const omStack = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const sans = cs.getPropertyValue("--sans");
    return { sans, ethiopic: /ethiopic|noto/i.test(sans) };
  });
  check("4a OM font stack has no Ethiopic", !omStack.ethiopic, omStack.sans.slice(0, 60));
  await setLangFallback(page, "en");
  const enStack = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const sans = cs.getPropertyValue("--sans");
    return { sans, ethiopic: /ethiopic|noto/i.test(sans) };
  });
  check("4b EN font stack has no Ethiopic", !enStack.ethiopic, enStack.sans.slice(0, 60));
  await setLangFallback(page, "am");
  const amStack = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const sans = cs.getPropertyValue("--sans");
    return { sans, ethiopic: /ethiopic|noto/i.test(sans) };
  });
  check("4c AM font stack uses Ethiopic", amStack.ethiopic, amStack.sans.slice(0, 60));

  // 6. AM option state, then full click-through when enabled.
  const amOption = await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll("button"));
    const am = opts.find((o) => (o.textContent || "").trim().startsWith("አማርኛ"));
    if (!am) return { found: false };
    return {
      found: true,
      disabled: am.disabled === true || am.getAttribute("aria-disabled") === "true",
    };
  });
  check("6a AM option present", amOption.found, "");
  check("6b AM option enabled (aria-disabled removed)", amOption.found && !amOption.disabled, JSON.stringify(amOption));

  if (amOption.found && !amOption.disabled) {
    const r = await openMenuAndClick(page, "am");
    const after = await page.evaluate(() => ({
      lang: document.documentElement.getAttribute("lang"),
      cookie: document.cookie.includes("dq_lang=am"),
      marker: document.body.innerText.includes("[AM draft]"),
      ethiopic: /ethiopic|noto/i.test(getComputedStyle(document.documentElement).getPropertyValue("--sans")),
    }));
    check("6c click AM sets lang=am", after.lang === "am", JSON.stringify(after));
    check("6d click AM sets dq_lang cookie", after.cookie, "");
    check("6e click AM re-renders in Amharic ([AM draft] visible)", after.marker, "");
    check("6f click AM applies Noto Sans Ethiopic", after.ethiopic, "");

    // 5a. AM shows [AM draft]; OM fallback visible where AM blank (no EN leak).
    const bodyText = await page.evaluate(() => document.body.innerText);
    check("5a AM shows [AM draft] for unfilled keys", bodyText.includes("[AM draft]"), "");
    check("5b AM does not leak EN strings for untranslated UI", !bodyText.includes("Explore woredas"), "");
  } else {
    check("5a AM shows [AM draft] for unfilled keys", false, "blocked: AM option disabled (6b)");
    check("5b AM does not leak EN strings for untranslated UI", false, "blocked: AM option disabled (6b)");
  }

  // 5b'. EN/OM never show the [AM draft] marker.
  for (const code of ["en", "om"]) {
    await openMenuAndClick(page, code);
    const has = await page.evaluate(() => document.body.innerText.includes("[AM draft]"));
    check(`5c ${code.toUpperCase()} shows no [AM draft]`, !has, "");
  }

  // 2c. 404 and /offline render in the toggled language.
  await openMenuAndClick(page, "am");
  for (const route of ["/does-not-exist-qa", "/offline"]) {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 600));
    const lang = await htmlLang(page);
    check(`2c ${route} renders with lang == am`, lang === "am", `lang=${lang}`);
  }

  // 3. hreflang: om-ET / en / am present (and x-default when the flip adds it).
  {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
    const alt = await page.evaluate(() =>
      Array.from(document.querySelectorAll("link[rel='alternate'][hreflang]")).map((l) => ({
        hreflang: l.getAttribute("hreflang"),
        href: l.getAttribute("href"),
      }))
    );
    const codes = new Set(alt.map((a) => a.hreflang));
    check("3a hreflang om-ET present", codes.has("om-ET"), JSON.stringify(alt));
    check("3b hreflang en present", codes.has("en"), "");
    check("3c hreflang am present", codes.has("am"), "");
    check("3d hreflang x-default present (om)", codes.has("x-default"), JSON.stringify(alt));
  }

  // ===========================================================================
  // Sprint 6 additions.
  // ===========================================================================

  // 7d. hreflang renders on every key page (not just /).
  {
    const keyPages = ["/", "/places", "/place/dambi-doolloo", "/news", "/history"];
    const missing = [];
    for (const route of keyPages) {
      await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
      const codes = await page.evaluate(() =>
        Array.from(document.querySelectorAll("link[rel='alternate'][hreflang]")).map((l) =>
          l.getAttribute("hreflang")
        )
      );
      for (const need of ["om-ET", "en", "am", "x-default"]) {
        if (!codes.includes(need)) missing.push(`${route}(${need})`);
      }
    }
    check("7d hreflang om-ET/en/am/x-default on 5 key pages", missing.length === 0, missing.join(", ") || "all present");
  }

  // 7a. dq_lang=en: the inauguration article body renders EN, not OM.
  {
    await openMenuAndClick(page, "en");
    await page.goto(BASE + "/news/dembi-dollo-inauguration-2026", { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    const txt = await page.evaluate(() => document.body.innerText);
    const enBody = txt.includes("Multiple development projects built at a cost of more than 650 million Birr");
    const omBody = txt.includes("Pirojektiiwwan gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman");
    check("7a EN article body renders EN (not OM)", enBody && !omBody, `enBody=${enBody} omBody=${omBody}`);
  }

  // 7b. dq_lang=am: AM-draft fields show the [AM draft] badge AND the OM
  //     fallback text in the same block; no EN leakage.
  {
    await openMenuAndClick(page, "am");
    await page.goto(BASE + "/news/dembi-dollo-inauguration-2026", { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    const txt = await page.evaluate(() => document.body.innerText);
    const badge = txt.includes("[AM draft]");
    const omBody = txt.includes("Pirojektiiwwan gosa garaagaraa qarshii Miliyoona 650 oliin ijaaraman");
    const enBody = txt.includes("Multiple development projects built at a cost of more than 650 million Birr");
    check("7b1 AM shows [AM draft] badge", badge, "");
    check("7b2 AM shows OM fallback text alongside the badge", omBody, "OM body fallback visible");
    check("7b3 AM does not leak EN body text", !enBody, "");
  }

  // 7c. Noto Sans Ethiopic must not be fetched on OM/EN page loads.
  {
    await openMenuAndClick(page, "en");
    // Cold-load the page and record every font/resource the browser fetched.
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    const ethiopicFetched = await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource").map((r) => r.name);
      return resources.filter((u) => /ethiopic|noto/i.test(u));
    });
    check("7c no Ethiopic font fetched on EN load", ethiopicFetched.length === 0, JSON.stringify(ethiopicFetched.slice(0, 3)));
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
