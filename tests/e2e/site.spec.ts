import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/research/", "/companies/", "/companies/hermes/", "/about/", "/contact/", "/privacy/", "/terms/"];

for (const p of pages) {
  test(`${p} answers, has a heading, no console errors, passes axe`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("api.github.com")) errors.push(m.text()); });
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("every internal link resolves", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
  for (const h of new Set(hrefs)) {
    const r = await request.get(h.split("#")[0]);
    expect(r.status(), h).toBe(200);
  }
});

test("the command line navigates by typed intent", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByLabel("Command").fill("go to research");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/research\/$/);
});
