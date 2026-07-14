import { expect, test } from "@playwright/test";

test.describe("BDSM Test", () => {
  test("completes the test, restores progress, and renders a result", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Full flow runs once on desktop.");
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    await page.goto("/");
    await expect(page).toHaveTitle("BDSM Test: Free Kink Preference Quiz | BDSMTest.top");
    await expect(page.getByRole("heading", { name: "Free BDSM Test" })).toBeVisible();
    await page.getByRole("button", { name: "Start the test" }).click();
    await page.locator("[data-confirm='age']").check();
    await page.locator("[data-confirm='context']").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("1 of 32");
    await page.getByText("Strongly appealing", { exact: true }).click();
    await page.locator(".continue-button").click();

    await page.reload();
    await expect(page.locator("[data-resume]")).toBeVisible();
    await page.getByRole("button", { name: "Resume" }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("2 of 32");

    for (let current = 2; current <= 32; current += 1) {
      await page.getByText("Somewhat appealing", { exact: true }).click();
      await page.locator(".continue-button").click();
      if (current < 32) await expect(page.locator("[data-progress-label]")).toHaveText(`${current + 1} of 32`);
    }

    await expect(page.locator("[data-result-primary]")).toBeVisible();
    await expect(page.locator(".dimension-row")).toHaveCount(8);
    expect(consoleErrors).toEqual([]);
  });

  test("fits the mobile viewport without horizontal overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only layout assertion.");
    await page.goto("/");
    const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    expect(hasNoOverflow).toBe(true);
    await expect(page.getByRole("button", { name: "Start the test" })).toBeVisible();
  });
});
