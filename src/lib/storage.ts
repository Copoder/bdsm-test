import { QUESTION_VERSION } from "../data/questions";
import { boundaryCategories, boundaryValues, type BoundaryMap } from "../data/boundaries";
import { DIMENSION_IDS, PROFILE_IDS, type Answers, type TestResult } from "./model";

const SESSION_KEY = "bdsm-test:v1:session";
const RESULT_KEY = "bdsm-test:v1:result";
const BOUNDARY_KEY = "bdsm-test:v1:boundaries";

export interface TestSession {
  schemaVersion: 1;
  questionVersion: string;
  index: number;
  answers: Answers;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function isStorageAvailable(): boolean {
  try {
    const key = "bdsm-test:storage-check";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadSession(): TestSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      value.schemaVersion !== 1 ||
      value.questionVersion !== QUESTION_VERSION ||
      !Number.isInteger(value.index) ||
      Number(value.index) < 0 ||
      Number(value.index) > 31 ||
      !isRecord(value.answers)
    ) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const answers: Answers = {};
    for (const [key, answer] of Object.entries(value.answers)) {
      const id = Number(key);
      if (!Number.isInteger(id) || id < 1 || id > 32 || !Number.isInteger(answer) || Number(answer) < 0 || Number(answer) > 4) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      answers[id] = Number(answer) as 0 | 1 | 2 | 3 | 4;
    }
    return { schemaVersion: 1, questionVersion: QUESTION_VERSION, index: Number(value.index), answers };
  } catch {
    try { localStorage.removeItem(SESSION_KEY); } catch { /* Storage may be blocked. */ }
    return null;
  }
}

export function saveSession(session: TestSession): boolean {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function saveResult(result: TestResult): boolean {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadResult(): TestResult | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.modelVersion !== "string" || typeof value.primary !== "string") {
      localStorage.removeItem(RESULT_KEY);
      return null;
    }
    const storedDimensions = value.dimensions;
    if (!isRecord(storedDimensions) || !DIMENSION_IDS.every((id) => Number.isInteger(storedDimensions[id]) && Number(storedDimensions[id]) >= 0 && Number(storedDimensions[id]) <= 100)) {
      localStorage.removeItem(RESULT_KEY);
      return null;
    }
    const storedProfileScores = value.profileScores;
    if (!isRecord(storedProfileScores) || !PROFILE_IDS.every((id) => typeof storedProfileScores[id] === "number")) {
      localStorage.removeItem(RESULT_KEY);
      return null;
    }
    if (!Array.isArray(value.coreDimensions) || !Array.isArray(value.contextDimensions) || typeof value.isBlended !== "boolean" || typeof value.isOpenEnded !== "boolean") {
      localStorage.removeItem(RESULT_KEY);
      return null;
    }
    return value as unknown as TestResult;
  } catch {
    try { localStorage.removeItem(RESULT_KEY); } catch { /* Storage may be blocked. */ }
    return null;
  }
}

export function loadBoundaryMap(): BoundaryMap {
  try {
    const raw = localStorage.getItem(BOUNDARY_KEY);
    if (!raw) return {};
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) throw new Error("Invalid boundary map");
    const categoryIds = new Set(boundaryCategories.map((category) => category.id));
    const output: BoundaryMap = {};
    for (const [category, state] of Object.entries(value)) {
      if (!categoryIds.has(category as never) || !boundaryValues.includes(state as never)) throw new Error("Invalid boundary map entry");
      output[category as keyof BoundaryMap] = state as BoundaryMap[keyof BoundaryMap];
    }
    return output;
  } catch {
    try { localStorage.removeItem(BOUNDARY_KEY); } catch { /* Storage may be blocked. */ }
    return {};
  }
}

export function saveBoundaryMap(boundaries: BoundaryMap): boolean {
  try {
    localStorage.setItem(BOUNDARY_KEY, JSON.stringify(boundaries));
    return true;
  } catch {
    return false;
  }
}

export function clearBoundaryMap(): void {
  try { localStorage.removeItem(BOUNDARY_KEY); } catch { /* Storage may be blocked. */ }
}

export function clearLocalTestData(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(BOUNDARY_KEY);
  } catch {
    // The UI still resets in memory when storage is unavailable.
  }
}
