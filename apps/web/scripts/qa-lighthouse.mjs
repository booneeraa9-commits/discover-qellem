/**
 * QA Lighthouse gate (issue #35).
 *
 * Runs Lighthouse against the 5 key pages and fails if any category falls
 * below the budgets in `lighthouserc.json`.
 *
 * Prerequisites:
 *   - A production build is running: `npm run build && npm run start`
 *     (or set LH_BASE_URL to any running deployment).
 *   - A Chrome/Chromium binary is available (LH_CHROME_PATH, default
 *     /usr/bin/chromium).
 *
 * Usage:
 *   npm run qa:lighthouse
 *   LH_BASE_URL=https://example.com npm run qa:lighthouse
 *
 * Exit code 0 = all budgets met; 1 = one or more budgets missed; 2 = error.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.LH_BASE_URL || "http://localhost:3000";
const CHROME_PATH = process.env.LH_CHROME_PATH || "/usr/bin/chromium";

const PAGES = ["/", "/places", "/place/dambi-doolloo", "/news", "/history"];

const rc = JSON.parse(
  readFileSync(resolve(__dirname, "../lighthouserc.json"), "utf8"),
);
const budgets = rc.ci.assert.assertions;

function budgetFor(category) {
  const key = `categories:${category}`;
  const [, opts] = budgets[key];
  return opts.minScore;
}

const chrome = await chromeLauncher.launch({
  chromePath: CHROME_PATH,
  chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];
let failed = false;

try {
  for (const path of PAGES) {
    const url = `${BASE_URL}${path}`;
    const runnerResult = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo", "pwa"],
      },
    );
    const lhr = runnerResult.lhr;
    const row = { path, scores: {}, budgets: {}, ok: true };
    for (const category of ["performance", "accessibility", "best-practices", "seo", "pwa"]) {
      const cat = lhr.categories[category];
      if (!cat) {
        // Lighthouse 12 no longer ships a core "pwa" category; PWA is covered
        // by the manual #19 checklist instead.
        row.scores[category] = "n/a";
        row.budgets[category] = budgetFor(category);
        continue;
      }
      const score = Math.round(cat.score * 100) / 100;
      const min = budgetFor(category);
      row.scores[category] = score;
      row.budgets[category] = min;
      if (score < min) {
        row.ok = false;
        failed = true;
      }
    }
    results.push(row);
    console.log(
      `\n${path}`,
      Object.entries(row.scores)
        .map(([c, s]) =>
          s === "n/a"
            ? `${c}: n/a (not measured — Lighthouse 12 has no PWA category)`
            : `${c}: ${s} (>=${row.budgets[c]}) ${s >= row.budgets[c] ? "ok" : "FAIL"}`,
        )
        .join(" | "),
    );
  }
} finally {
  await chrome.kill();
}

console.log(`\n${results.filter((r) => !r.ok).length}/${results.length} pages missed a budget.`);
process.exit(failed ? 1 : 0);
