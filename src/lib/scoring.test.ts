import { describe, expect, it } from "vitest";
import { questionOrder, questions } from "../data/questions";
import { DIMENSION_IDS, PROFILE_IDS, type Answers, type DimensionId, type ProfileId } from "./model";
import { calculateDimensions, scoreTest, selectProfile } from "./scoring";

const answersWith = (defaultValue: 0 | 1 | 2 | 3 | 4, overrides: Answers = {}): Answers =>
  Object.fromEntries(questions.map((question) => [question.id, overrides[question.id] ?? defaultValue]));

const profileMap = (overrides: Partial<Record<ProfileId, number>>): Record<ProfileId, number> =>
  Object.fromEntries(PROFILE_IDS.map((profile) => [profile, overrides[profile] ?? 0])) as Record<ProfileId, number>;

const dimensionMap = (overrides: Partial<Record<DimensionId, number>> = {}): Record<DimensionId, number> =>
  Object.fromEntries(DIMENSION_IDS.map((dimension) => [dimension, overrides[dimension] ?? 0])) as Record<DimensionId, number>;

describe("question model", () => {
  it("contains 32 unique questions interleaved across all dimensions", () => {
    expect(questions).toHaveLength(32);
    expect(new Set(questions.map((question) => question.id)).size).toBe(32);
    expect(questionOrder.slice(0, 8).map((question) => question.id)).toEqual([1, 5, 9, 13, 17, 21, 25, 29]);
  });
});

describe("dimension scoring", () => {
  it("normalizes each four-item dimension to 0-100", () => {
    const scores = calculateDimensions(answersWith(2, { 1: 4, 2: 4, 3: 4, 4: 4 }));
    expect(scores.DIR).toBe(100);
    expect(scores.SUR).toBe(50);
  });

  it("rejects incomplete answers", () => {
    expect(() => calculateDimensions({ 1: 4 })).toThrow("question 2");
  });
});

describe("profile selection", () => {
  it("returns Open-ended Explorer before evaluating a blend", () => {
    const selected = selectProfile(profileMap({ Dominant: 44.9, Caregiver: 44.9 }), dimensionMap({ DIR: 70, CAR: 70 }));
    expect(selected).toEqual({ primary: "Open-ended Explorer", isBlended: false, isOpenEnded: true });
  });

  it("uses the unrounded seven-point blend boundary", () => {
    const blended = selectProfile(profileMap({ Dominant: 62, Caregiver: 55 }), dimensionMap({ DIR: 80, CAR: 75 }));
    const ordinary = selectProfile(profileMap({ Dominant: 62.01, Caregiver: 55 }), dimensionMap({ DIR: 80, CAR: 75 }));
    expect(blended.primary).toBe("Dominant / Caregiver");
    expect(blended.isBlended).toBe(true);
    expect(ordinary.primary).toBe("Dominant");
    expect(ordinary.secondary).toBe("Caregiver");
  });

  it("resolves total ties by the documented stable profile order", () => {
    const selected = selectProfile(profileMap({ Dominant: 60, Submissive: 60 }), dimensionMap({ DIR: 60, SUR: 60 }));
    expect(selected.primary).toBe("Dominant / Submissive");
  });

  it("does not present an arbitrary secondary profile when second place is tied", () => {
    const selected = selectProfile(
      profileMap({ Switch: 83, Dominant: 75, Submissive: 75 }),
      dimensionMap({ DIR: 75, SUR: 75 })
    );
    expect(selected.primary).toBe("Switch");
    expect(selected.secondary).toBeUndefined();
  });
});

describe("full scoring", () => {
  it("produces an open-ended result for uniformly low answers", () => {
    const result = scoreTest(answersWith(1));
    expect(result.primary).toBe("Open-ended Explorer");
    expect(result.secondary).toBeUndefined();
  });

  it("selects a clear Dominant profile when direction alone is high", () => {
    const result = scoreTest(answersWith(0, { 1: 4, 2: 4, 3: 4, 4: 4 }));
    expect(result.primary).toBe("Dominant");
    expect(result.isBlended).toBe(false);
  });

  it("uses the full Switch formula only when both direction scores reach 60", () => {
    const below = scoreTest(answersWith(0, {
      1: 4, 2: 4, 3: 4, 4: 4,
      5: 2, 6: 2, 7: 2, 8: 3
    }));
    const atThreshold = scoreTest(answersWith(0, {
      1: 4, 2: 4, 3: 4, 4: 4,
      5: 3, 6: 3, 7: 2, 8: 2
    }));
    expect(below.profileScores.Switch).toBe(45);
    expect(atThreshold.profileScores.Switch).toBeGreaterThan(70);
  });

  it("reports at most three context-dependent dimensions", () => {
    const result = scoreTest(answersWith(2));
    expect(result.contextDimensions).toHaveLength(3);
  });
});
