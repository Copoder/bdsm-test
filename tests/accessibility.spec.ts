import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const assertNoSeriousViolations = async (page: import("@playwright/test").Page, context: string) => {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
  expect(violations, `${context}: ${violations.map((violation) => `${violation.id} (${violation.nodes.length})`).join(", ")}`).toEqual([]);
};

test("homepage, age gate, and first question have no serious accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Accessibility audit runs once.");
  await page.goto("/");
  await assertNoSeriousViolations(page, "homepage");
  await page.getByRole("button", { name: "Start the test" }).click();
  await assertNoSeriousViolations(page, "age gate");
  await page.locator("[data-confirm='age']").check();
  await page.locator("[data-confirm='context']").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await assertNoSeriousViolations(page, "question screen");
});

test("shared result and content page have no serious accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Accessibility audit runs once.");
  const envelope = "eyJ2IjoxLCJtIjoiMS4wLjAiLCJwIjoiQ2FyZWdpdmVyIiwicyI6IkRvbWluYW50IiwiYSI6WzcyLDM4LDQ1LDMxLDQyLDgxLDU2LDYwXX0.c6c133f6";
  await page.goto(`/#r=${envelope}`);
  await assertNoSeriousViolations(page, "shared result");
  await page.goto("/methodology/");
  await assertNoSeriousViolations(page, "methodology");
});
