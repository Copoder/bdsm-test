import { expect, test } from "@playwright/test";

// Regression: QA-002 - policies lacked a working owner contact and email-processing disclosure.
// Found by manual QA on 2026-07-14.
// Report: .gstack/qa-reports/qa-report-bdsmtest-top-2026-07-14.md
test("policies publish the correct contact and current data practices", async ({ page }) => {
  for (const path of ["/about/", "/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator('a[href="mailto:th.houtong@gmail.com"]').first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("@gamil.com");
  }

  await page.goto("/privacy/");
  await expect(page.getByRole("heading", { name: "Messages you send us" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Automated scoring" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your choices and privacy requests" })).toBeVisible();
  await expect(page.locator("main")).toContainText("10 rounded role scores");
  await expect(page.locator("main")).toContainText("G-28B43KH2T1");
  await expect(page.locator("main")).toContainText("removes the URL fragment");
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js?id=G-28B43KH2T1"]')).toHaveCount(1);

  await page.goto("/terms/");
  await expect(page.getByRole("heading", { name: "External services and shared content" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy/");
});
