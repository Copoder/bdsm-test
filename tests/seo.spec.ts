import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about/",
  "/bdsm-roles/",
  "/consent-and-safety/",
  "/methodology/",
  "/privacy/",
  "/terms/",
  "/roles/dominant/",
  "/roles/submissive/",
  "/roles/switch/",
  "/roles/sensation-giver/",
  "/roles/sensation-receiver/",
  "/roles/rigger/",
  "/roles/rope-receiver/",
  "/roles/caregiver/",
  "/roles/brat/",
  "/roles/experimentalist/"
];

test("all indexable pages have unique, valid SEO fundamentals", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "SEO route audit runs once.");
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), `${route} should have one H1`).toHaveCount(1);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", `https://bdsmtest.top${route}`);
    await expect(page.locator("meta[name='robots']")).toHaveCount(0);

    const title = await page.title();
    const description = await page.locator("meta[name='description']").getAttribute("content");
    expect(title.length, `${route} title length`).toBeGreaterThanOrEqual(30);
    expect(title.length, `${route} title length`).toBeLessThanOrEqual(70);
    expect(description?.length ?? 0, `${route} description length`).toBeGreaterThanOrEqual(100);
    expect(description?.length ?? 0, `${route} description length`).toBeLessThanOrEqual(180);
    expect(titles.has(title), `Duplicate title: ${title}`).toBe(false);
    expect(descriptions.has(description ?? ""), `Duplicate description: ${description}`).toBe(false);
    titles.add(title);
    descriptions.add(description ?? "");

    const jsonLd = await page.locator("script[type='application/ld+json']").textContent();
    expect(() => JSON.parse(jsonLd ?? "")).not.toThrow();
  }
});

test("homepage owns the primary BDSM test intent and renders static content", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "SEO route audit runs once.");
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Free BDSM Test");
  await expect(page.getByText("What this BDSM test reveals", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "BDSM test FAQ" })).toBeVisible();
  const schemas = JSON.parse(await page.locator("script[type='application/ld+json']").textContent() ?? "[]");
  expect(schemas.some((schema: { "@type"?: string }) => schema["@type"] === "WebApplication")).toBe(true);
  expect(schemas.some((schema: { "@type"?: string }) => schema["@type"] === "FAQPage")).toBe(true);
});

test("robots, sitemap, internal links, and 404 are crawlable and consistent", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "SEO route audit runs once.");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("https://bdsmtest.top/sitemap-index.xml");

  const sitemapIndex = await request.get("/sitemap-index.xml");
  expect(sitemapIndex.status()).toBe(200);
  const sitemap = await request.get("/sitemap-0.xml");
  const sitemapText = await sitemap.text();
  for (const route of routes) expect(sitemapText).toContain(`https://bdsmtest.top${route}`);
  expect(sitemapText).not.toContain("/404");

  const missing = await request.get("/definitely-not-a-page/");
  expect(missing.status()).toBe(404);

  await page.goto("/");
  const internalLinks = await page.locator("a[href^='/']").evaluateAll((links) => [...new Set(links.map((link) => (link as HTMLAnchorElement).href.split("#")[0]))]);
  for (const link of internalLinks) {
    const response = await request.get(link);
    expect(response.status(), link).toBeLessThan(400);
  }
});
