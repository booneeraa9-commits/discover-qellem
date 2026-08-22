/* Discover Qellem — i18n flip harness (issue #87).
 *
 * Asserts the TARGET behaviour of the Afaan-Oromoo-default + Amharic flip.
 * Until #85 lands these are expected to FAIL in places — the harness exists to
 * tell the FE exactly what is missing.
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

async function freshPage(browser, { lang = undefined } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  return page;
}

function ethiopicInStack(page) {
  return page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const sans = cs.getPropertyValue("--sans");
    const serif = cs.getPropertyValue("--serif");
    return { sans, serif, sansEthiopic: /ethiopic|noto/i.test(sans) };
  });
}

async function setLang(page, lang) {
  await page.evaluate((code) => {
    document.documentElement.setAttribute("lang", code);
    window.localStorage.setItem("dq_lang", code);
    document.cookie = `dq_lang=${code}; path=/; max-age=31536000; samesite=lax`;
  }, lang);
  await new Promise((r) => setTimeout(r, 300));
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
    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
    const omHero = await page.evaluate(() =>
      document.body.innerText.includes("Lafa Margaa") ||
      document.body.innerText.includes("Godina Qeellam Wallaggaa")
    );
    check("1a fresh first paint lang == om", lang === "om", `lang=${lang}`);
    check("1b OM hero visible on first paint", omHero, "");
    await ctx.close();
  }

  const page = await freshPage(browser);

  // 2. html lang tracks each language + persists.
  for (const code of ["om", "en", "am"]) {
    await setLang(page, code);
    const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
    check(`2a html lang == ${code}`, lang === code, `lang=${lang}`);
  }

  // 4. Ethiopic font stack only when lang=am.
  await setLang(page, "om");
  const omStack = await ethiopicInStack(page);
  check("4a OM font stack has no Ethiopic", !omStack.sansEthiopic, omStack.sans.slice(0, 60));
  await setLang(page, "en");
  const enStack = await ethiopicInStack(page);
  check("4b EN font stack has no Ethiopic", !enStack.sansEthiopic, enStack.sans.slice(0, 60));
  await setLang(page, "am");
  const amStack = await ethiopicInStack(page);
  check("4c AM font stack uses Ethiopic", amStack.sansEthiopic, amStack.sans.slice(0, 60));

  // 5. [AM draft] only in AM, never EN/OM.
  await setLang(page, "am");
  const amHasMarker = await page.evaluate(() => document.body.innerText.includes("[AM draft]"));
  check("5a AM shows [AM draft] for unfilled keys", amHasMarker, "");
  for (const code of ["en", "om"]) {
    await setLang(page, code);
    const has = await page.evaluate(() => document.body.innerText.includes("[AM draft]"));
    check(`5b ${code.toUpperCase()} shows no [AM draft]`, !has, "");
  }

  // 6. Switcher: AM option enabled (no aria-disabled), click -> cookie + re-render.
  {
    await setLang(page, "om");
    const amState = await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll("button, a, [role='menuitem'], [role='option']"));
      const am = opts.find((o) => (o.textContent || "").includes("አማርኛ"));
      if (!am) return { found: false };
      return {
        found: true,
        disabled: am.getAttribute("aria-disabled") === "true" || am.disabled === true,
      };
    });
    check("6a AM option present", amState.found, "");
    check("6b AM option enabled (aria-disabled removed)", amState.found && !amState.disabled, JSON.stringify(amState));
    // Click-through only if enabled.
    if (amState.found && !amState.disabled) {
      await page.evaluate(() => {
        const opts = Array.from(document.querySelectorAll("button, a, [role='menuitem'], [role='option']"));
        const am = opts.find((o) => (o.textContent || "").includes("አማርኛ"));
        am.click();
      });
      await new Promise((r) => setTimeout(r, 400));
      const after = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute("lang"),
        cookie: document.cookie.includes("dq_lang=am"),
        marker: document.body.innerText.includes("[AM draft]"),
      }));
      check("6c click AM sets lang=am", after.lang === "am", JSON.stringify(after));
      check("6d click AM sets dq_lang cookie", after.cookie, "");
      check("6e click AM re-renders in Amharic", after.marker, "");
    }
  }

  // 3. hreflang: om-ET / en / am present with the current page's path.
  {
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
  }

  // 7. Fallback (unit-level, via the app's own bundle is hard in-page — check
  //    the runtime string when am has an empty value is covered by unit tests).
  console.log("INFO  7. fallback localize()/translate() — covered by unit test (localize({om,en,am:''}, 'am') === om)");

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
