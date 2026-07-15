import { expect, test } from "@playwright/test";

test.describe("BDSM Test", () => {
  test("completes, restores, shares, and keeps boundaries private", async ({ page, context }, testInfo) => {
    test.setTimeout(60_000);
    test.skip(testInfo.project.name !== "desktop-chromium", "Full flow runs once on desktop.");
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    await page.goto("/");
    await expect(page).toHaveTitle("BDSM Test: Free Kink Preference Quiz | BDSMTest.top");
    await expect(page.getByRole("heading", { name: "Free BDSM Test", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Begin privately" }).click();
    await page.locator("[data-confirm='age']").check();
    await page.locator("[data-confirm='context']").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("01 / 32");
    await page.getByText("Strongly appealing", { exact: true }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("01 / 32");
    await page.getByRole("button", { name: "Save and exit" }).click();
    await expect(page.locator("[data-resume]")).toBeVisible();
    await expect(page.getByRole("button", { name: "Begin privately" })).toBeHidden();
    await expect(page.locator("[data-resume-label]")).toContainText("Continue at 01 / 32");
    await page.getByRole("button", { name: "Continue test" }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("02 / 32");

    await page.getByRole("button", { name: "Previous question" }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("01 / 32");
    await page.getByText("Somewhat appealing", { exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("02 / 32");

    await page.reload();
    await expect(page.locator("[data-resume]")).toBeVisible();
    await page.getByRole("button", { name: "Continue test" }).click();
    await expect(page.locator("[data-progress-label]")).toHaveText("02 / 32");

    for (let current = 2; current <= 32; current += 1) {
      await page.getByText("Somewhat appealing", { exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      if (current < 32) await expect(page.locator("[data-progress-label]")).toHaveText(`${String(current + 1).padStart(2, "0")} / 32`);
    }

    await expect(page.locator("[data-result-primary]")).toBeVisible();
    await expect(page.locator(".dimension-row")).toHaveCount(8);
    await expect(page.locator("[data-role-results] .role-score-row")).toHaveCount(10);
    await expect(page.locator("[data-role-results] .role-score-row:visible")).toHaveCount(3);
    await page.getByRole("button", { name: "Show all 10 matches" }).click();
    await expect(page.locator("[data-role-results] .role-score-row:visible")).toHaveCount(10);
    await expect(page.locator("[data-result-radar] svg")).toBeVisible();
    await expect(page.locator("[data-result-radar] .radar-points circle")).toHaveCount(8);

    await page.getByRole("button", { name: "Map my boundaries" }).click();
    await page.locator(".boundary-row").first().getByText("Hard limit", { exact: true }).click();
    const storedBoundaries = await page.evaluate(() => localStorage.getItem("bdsm-test:v1:boundaries"));
    expect(storedBoundaries).toContain("giving-control");

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByText("More sharing options", { exact: true }).click();
    await page.getByRole("button", { name: "Copy link" }).click();
    const sharedUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(sharedUrl).toMatch(/^https:\/\/bdsmtest\.top\/#r=/);
    expect(sharedUrl).not.toContain("giving-control");

    const receiver = await context.newPage();
    await receiver.goto(`${new URL(page.url()).origin}/${new URL(sharedUrl).hash}`);
    await expect(receiver.locator("[data-shared-role-results] .role-score-row")).toHaveCount(10);
    await receiver.close();

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
    await expect(page.locator("[data-shared-role-section]")).toBeHidden();
    expect(await page.evaluate(() => location.hash)).toBe("");
    await page.getByRole("button", { name: "Explore yours privately" }).click();
    await expect(page.getByRole("heading", { name: "A quick boundary check" })).toBeVisible();
  });

  test("fits the mobile viewport without horizontal overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only layout assertion.");
    await page.goto("/");
    const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    expect(hasNoOverflow).toBe(true);
    await expect(page.getByRole("button", { name: "Begin privately" })).toBeVisible();
    await page.getByRole("button", { name: "Begin privately" }).click();
    await page.locator("[data-confirm='age']").check();
    await page.locator("[data-confirm='context']").check();
    await page.getByRole("button", { name: "Continue" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const optionHeights = await page.locator(".answer-option").evaluateAll((options) => options.map((option) => option.getBoundingClientRect().height));
    expect(optionHeights.every((height) => height >= 48)).toBe(true);
    await page.getByText("Somewhat appealing", { exact: true }).click();
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeEnabled();
  });

  test("stays stable across required viewport widths", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Responsive matrix runs once.");
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${viewport.width}px homepage overflow`).toBe(true);
      await page.goto("/bdsm-roles/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${viewport.width}px content overflow`).toBe(true);
    }
  });
});
