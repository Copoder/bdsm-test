import { describe, expect, it } from "vitest";
import { questions } from "../data/questions";
import type { Answers } from "./model";
import { buildResultSpotlight } from "./result-copy";
import { scoreTest } from "./scoring";

const answersWith = (defaultValue: 0 | 1 | 2 | 3 | 4, overrides: Answers = {}): Answers =>
  Object.fromEntries(questions.map((question) => [question.id, overrides[question.id] ?? defaultValue]));

describe("result spotlight copy", () => {
  it("gives Dominant a sharp hook and match strength", () => {
    const result = scoreTest(answersWith(0, { 1: 4, 2: 4, 3: 4, 4: 4 }));
    const spotlight = buildResultSpotlight(result);
    expect(result.primary).toBe("Dominant");
    expect(spotlight.hook).toContain("room to move");
    expect(spotlight.matchScore).toBeGreaterThanOrEqual(65);
    expect(spotlight.shareText).toContain("Dominant");
    expect(spotlight.topLine).toContain("Dominant");
  });

  it("keeps open-ended results label-free but still shareable", () => {
    const result = scoreTest(answersWith(1));
    const spotlight = buildResultSpotlight(result);
    expect(result.isOpenEnded).toBe(true);
    expect(spotlight.matchScore).toBeUndefined();
    expect(spotlight.hook).toContain("wider than one label");
    expect(spotlight.kicker).toBe("Your map stays open");
  });
});
