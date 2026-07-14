export const DIMENSION_IDS = ["DIR", "SUR", "IGV", "IRC", "RST", "CAR", "PLY", "EXP"] as const;
export type DimensionId = (typeof DIMENSION_IDS)[number];

export const PROFILE_IDS = [
  "Dominant",
  "Submissive",
  "Switch",
  "Sensation Giver",
  "Sensation Receiver",
  "Rigger",
  "Rope Receiver",
  "Caregiver",
  "Brat",
  "Experimentalist"
] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export const ANSWER_VALUES = [0, 1, 2, 3, 4] as const;
export type AnswerValue = (typeof ANSWER_VALUES)[number];
export type Answers = Partial<Record<number, AnswerValue>>;

export type QuestionTag =
  | "control-giving"
  | "control-receiving"
  | "sensation-giving"
  | "sensation-receiving"
  | "restraint-giving"
  | "restraint-receiving"
  | "service-care-giving"
  | "care-receiving"
  | "playful-resistance"
  | "challenge"
  | "craft"
  | "ritual-planning"
  | "novelty-role";

export interface Question {
  id: number;
  dimension: DimensionId;
  text: string;
  tags: QuestionTag[];
}

export interface DimensionMeta {
  id: DimensionId;
  name: string;
  shortName: string;
  description: string;
  disclaimer: string;
  communicationPrompt: string;
  color: string;
}

export interface ProfileMeta {
  id: ProfileId;
  primaryDimension: DimensionId;
  summary: string;
  reflection: string;
}

export interface TestResult {
  schemaVersion: 1;
  modelVersion: string;
  dimensions: Record<DimensionId, number>;
  profileScores: Record<ProfileId, number>;
  primary: string;
  secondary?: ProfileId;
  supporting?: ProfileId;
  isBlended: boolean;
  isOpenEnded: boolean;
  coreDimensions: DimensionId[];
  contextDimensions: DimensionId[];
}
