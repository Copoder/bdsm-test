import scoringConfig from "../data/scoring.v1.json";
import { dimensions, MODEL_VERSION, questions } from "../data/questions";
import { profiles } from "../data/profiles";
import {
  DIMENSION_IDS,
  PROFILE_IDS,
  type Answers,
  type DimensionId,
  type ProfileId,
  type QuestionTag,
  type TestResult
} from "./model";

type NumericMap<K extends string> = Record<K, number>;

const normalize = (values: number[]): number =>
  values.length ? (values.reduce((sum, value) => sum + value, 0) / (values.length * 4)) * 100 : 0;

export function validateCompleteAnswers(answers: Answers): asserts answers is Record<number, 0 | 1 | 2 | 3 | 4> {
  for (const question of questions) {
    const value = answers[question.id];
    if (value === undefined || !Number.isInteger(value) || value < 0 || value > 4) {
      throw new Error(`Missing or invalid answer for question ${question.id}`);
    }
  }
}

export function calculateDimensions(answers: Answers): NumericMap<DimensionId> {
  validateCompleteAnswers(answers);
  return Object.fromEntries(
    DIMENSION_IDS.map((dimension) => {
      const values = questions.filter((question) => question.dimension === dimension).map((question) => answers[question.id]);
      return [dimension, normalize(values)];
    })
  ) as NumericMap<DimensionId>;
}

export function calculateTags(answers: Answers): NumericMap<QuestionTag> {
  validateCompleteAnswers(answers);
  const tags = new Set(questions.flatMap((question) => question.tags));
  return Object.fromEntries(
    [...tags].map((tag) => {
      const values = questions.filter((question) => question.tags.includes(tag)).map((question) => answers[question.id]);
      return [tag, normalize(values)];
    })
  ) as NumericMap<QuestionTag>;
}

export function calculateProfileScores(
  dimensionScores: NumericMap<DimensionId>,
  tags: NumericMap<QuestionTag>
): NumericMap<ProfileId> {
  const { DIR, SUR, IGV, IRC, RST, PLY, EXP } = dimensionScores;
  const balance = 100 - Math.abs(DIR - SUR);
  const switchScore =
    DIR >= scoringConfig.switchFullThreshold && SUR >= scoringConfig.switchFullThreshold
      ? 0.35 * DIR + 0.35 * SUR + 0.3 * balance
      : 0.8 * Math.min(DIR, SUR);

  return {
    Dominant: 0.7 * DIR + 0.15 * tags["service-care-giving"] + 0.15 * tags["ritual-planning"],
    Submissive: 0.7 * SUR + 0.15 * tags["service-care-giving"] + 0.15 * tags["care-receiving"],
    Switch: switchScore,
    "Sensation Giver": 0.75 * IGV + 0.15 * DIR + 0.1 * tags["service-care-giving"],
    "Sensation Receiver": 0.75 * IRC + 0.15 * SUR + 0.1 * tags["care-receiving"],
    Rigger: 0.55 * tags["restraint-giving"] + 0.25 * tags.craft + 0.2 * DIR,
    "Rope Receiver": 0.65 * tags["restraint-receiving"] + 0.2 * SUR + 0.15 * RST,
    Caregiver: 0.55 * tags["service-care-giving"] + 0.25 * DIR + 0.2 * tags["ritual-planning"],
    Brat: 0.65 * tags["playful-resistance"] + 0.2 * tags.challenge + 0.15 * SUR,
    Experimentalist: 0.6 * EXP + 0.2 * PLY + 0.1 * IGV + 0.1 * IRC
  };
}

export function selectProfile(
  scores: NumericMap<ProfileId>,
  dimensionScores: NumericMap<DimensionId>
): Pick<TestResult, "primary" | "secondary" | "supporting" | "isBlended" | "isOpenEnded"> {
  const profileOrder = new Map(PROFILE_IDS.map((profile, index) => [profile, index]));
  const primaryDimension = new Map(profiles.map((profile) => [profile.id, profile.primaryDimension]));
  const ranked = [...PROFILE_IDS].sort((a, b) => {
    const scoreDifference = scores[b] - scores[a];
    if (scoreDifference !== 0) return scoreDifference;
    const dimensionDifference = dimensionScores[primaryDimension.get(b)!] - dimensionScores[primaryDimension.get(a)!];
    if (dimensionDifference !== 0) return dimensionDifference;
    return profileOrder.get(a)! - profileOrder.get(b)!;
  });
  const [first, second, third] = ranked;

  if (scores[first] < scoringConfig.openEndedThreshold) {
    return { primary: "Open-ended Explorer", isBlended: false, isOpenEnded: true };
  }

  if (scores[first] - scores[second] <= scoringConfig.blendDifference) {
    return {
      primary: `${first} / ${second}`,
      supporting: third,
      isBlended: true,
      isOpenEnded: false
    };
  }

  return {
    primary: first,
    secondary: second,
    isBlended: false,
    isOpenEnded: false
  };
}

export function scoreTest(answers: Answers): TestResult {
  const rawDimensions = calculateDimensions(answers);
  const tags = calculateTags(answers);
  const profileScores = calculateProfileScores(rawDimensions, tags);
  const selected = selectProfile(profileScores, rawDimensions);
  const rankedDimensions = [...DIMENSION_IDS].sort((a, b) => rawDimensions[b] - rawDimensions[a]);
  const secondScore = rawDimensions[rankedDimensions[1]];
  const coreDimensions = rankedDimensions.slice(0, rawDimensions[rankedDimensions[2]] >= secondScore - 5 ? 3 : 2);
  const contextDimensions = dimensions
    .filter((dimension) => {
      const uncertainCount = questions
        .filter((question) => question.dimension === dimension.id)
        .filter((question) => answers[question.id] === 2).length;
      return uncertainCount >= 2;
    })
    .sort((a, b) => rawDimensions[b.id] - rawDimensions[a.id])
    .slice(0, 3)
    .map((dimension) => dimension.id);

  return {
    schemaVersion: 1,
    modelVersion: MODEL_VERSION,
    dimensions: Object.fromEntries(DIMENSION_IDS.map((id) => [id, Math.round(rawDimensions[id])])) as NumericMap<DimensionId>,
    profileScores,
    ...selected,
    coreDimensions,
    contextDimensions
  };
}
