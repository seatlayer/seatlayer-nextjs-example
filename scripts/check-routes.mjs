/**
 * Loads every route in a real browser and fails on an HTTP error, an uncaught
 * exception or a console error. Each route is also loaded with ?embed=1, where
 * the navigation must be hidden.
 *
 *   BASE_URL=http://localhost:3000 node scripts/check-routes.mjs
 *
 * CI runs it against `npm start` when the demo keys are available.
 */
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/seat-picker",
  "/events",
  "/best-available",
  "/season",
  "/checkout-handoff",
  "/control-room",
  "/html",
];

const browser = await chromium.launch();
const failures = [];

for (const route of routes) {
  for (const path of [route, `${route}?embed=1`]) {
    const page = await browser.newPage();
    const problems = [];
    page.on("pageerror", (error) => problems.push(`uncaught: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });

    const response = await page.goto(baseUrl + path, { waitUntil: "load" });
    if (!response || !response.ok()) {
      problems.push(`HTTP ${response ? response.status() : "no response"}`);
    }

    // Give the seat map time to fetch its chart and render.
    await page.waitForTimeout(4000);

    if (path.endsWith("?embed=1") && route !== "/html" && (await page.locator(".nav").isVisible())) {
      problems.push("navigation is visible in embed mode");
    }

    console.log(`${problems.length ? "FAIL" : "ok  "} ${path}`);
    for (const problem of problems) console.log(`     ${problem}`);
    if (problems.length) failures.push(path);
    await page.close();
  }
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} route(s) failed.`);
  process.exit(1);
}
