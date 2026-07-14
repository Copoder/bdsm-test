import { expect, test } from "@playwright/test";

test.describe("BDSM Test", () => {
  test("completes, restores, shares, and keeps boundaries private", async ({ page, context }, testInfo) => {
    test.setTimeout(60_000);
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

    await page.getByRole("button", { name: "Build a private boundary map" }).click();
    await page.locator(".boundary-row").first().getByText("Hard limit", { exact: true }).click();
    const storedBoundaries = await page.evaluate(() => localStorage.getItem("bdsm-test:v1:boundaries"));
    expect(storedBoundaries).toContain("giving-control");

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByText("More sharing options", { exact: true }).click();
    await page.getByRole("button", { name: "Copy link" }).click();
    const sharedUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(sharedUrl).toMatch(/^https:\/\/bdsmtest\.top\/#r=/);
    expect(sharedUrl).not.toContain("giving-control");

    await page.getByRole("button", { name: "Show QR code" }).click();
    await expect(page.locator("[data-qr-panel]")).toBeVisible();
    const qrHasPixels = await page.locator("[data-qr-canvas]").evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      return context ? context.getImageData(0, 0, canvas.width, canvas.height).data.some((value) => value !== 0) : false;
    });
    expect(qrHasPixels).toBe(true);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download image" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("my-bdsm-test-result.png");
    const path = await download.path();
    expect(path).not.toBeNull();
    const size = await import("node:fs/promises").then((fs) => fs.stat(path!)).then((stat) => stat.size);
    expect(size).toBeGreaterThan(10_000);
    expect(size).toBeLessThan(2_000_000);
    expect(consoleErrors).toEqual([]);
  });

  test("opens a shared result, clears its fragment, and offers the receiver a test", async ({ page }) => {
    const envelope = "eyJ2IjoxLCJtIjoiMS4wLjAiLCJwIjoiQ2FyZWdpdmVyIiwicyI6IkRvbWluYW50IiwiYSI6WzcyLDM4LDQ1LDMxLDQyLDgxLDU2LDYwXX0.c6c133f6";
    await page.goto(`/#r=${envelope}`);
    await expect(page.locator("[data-shared-primary]")).toHaveText("Caregiver");
    await expect(page.locator("[data-shared-dimensions] .dimension-row")).toHaveCount(8);
    expect(await page.evaluate(() => location.hash)).toBe("");
    await page.getByRole("button", { name: "Take your own BDSM Test" }).click();
    await expect(page.getByRole("heading", { name: "Keep the frame clear." })).toBeVisible();
  });

  test("fits the mobile viewport without horizontal overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only layout assertion.");
    await page.goto("/");
    const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    expect(hasNoOverflow).toBe(true);
    await expect(page.getByRole("button", { name: "Start the test" })).toBeVisible();
  });
});
