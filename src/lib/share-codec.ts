import { MODEL_VERSION } from "../data/questions";
import { DIMENSION_IDS, PROFILE_IDS, type ProfileId, type TestResult } from "./model";

export interface SharePayloadV1 {
  v: 1;
  m: string;
  p: string;
  s?: ProfileId;
  a: [number, number, number, number, number, number, number, number];
}

const MAX_ENVELOPE_LENGTH = 1024;
const OPEN_ENDED = "Open-ended Explorer";
const profileSet = new Set<string>(PROFILE_IDS);

const isOrdinaryProfile = (value: string): value is ProfileId => profileSet.has(value);

const isBlendedProfile = (value: string): boolean => {
  const parts = value.split(" / ");
  return parts.length === 2 && parts[0] !== parts[1] && parts.every(isOrdinaryProfile);
};

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const encodeBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
};

const decodeBase64Url = (value: string): Uint8Array => {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) throw new Error("Invalid base64url characters");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function validateSharePayload(value: unknown): SharePayloadV1 {
  if (!isRecord(value)) throw new Error("Payload must be an object");
  const allowedKeys = new Set(["v", "m", "p", "s", "a"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) throw new Error("Payload contains unknown fields");
  if (value.v !== 1 || value.m !== MODEL_VERSION || typeof value.p !== "string") throw new Error("Unsupported payload version");
  if (!Array.isArray(value.a) || value.a.length !== DIMENSION_IDS.length) throw new Error("Payload requires eight scores");
  if (!value.a.every((score) => Number.isInteger(score) && score >= 0 && score <= 100)) throw new Error("Score out of range");

  const ordinary = isOrdinaryProfile(value.p);
  const blended = isBlendedProfile(value.p);
  const openEnded = value.p === OPEN_ENDED;
  if (!ordinary && !blended && !openEnded) throw new Error("Profile is not allowed");

  if (value.s !== undefined) {
    if (!ordinary || typeof value.s !== "string" || !isOrdinaryProfile(value.s) || value.s === value.p) {
      throw new Error("Secondary profile is not allowed for this result");
    }
  }
  if ((blended || openEnded) && "s" in value) throw new Error("Blended and open-ended results cannot include a secondary profile");

  return {
    v: 1,
    m: MODEL_VERSION,
    p: value.p,
    ...(value.s ? { s: value.s as ProfileId } : {}),
    a: value.a as SharePayloadV1["a"]
  };
}

export function canonicalShareJson(payload: SharePayloadV1): string {
  const valid = validateSharePayload(payload);
  return JSON.stringify({ v: valid.v, m: valid.m, p: valid.p, ...(valid.s ? { s: valid.s } : {}), a: valid.a });
}

export function encodeSharePayload(payload: SharePayloadV1): string {
  const bytes = new TextEncoder().encode(canonicalShareJson(payload));
  const checksum = crc32(bytes).toString(16).padStart(8, "0");
  return `${encodeBase64Url(bytes)}.${checksum}`;
}

export function decodeShareEnvelope(envelope: string): SharePayloadV1 {
  if (!envelope || envelope.length > MAX_ENVELOPE_LENGTH) throw new Error("Share payload is missing or too long");
  const parts = envelope.split(".");
  if (parts.length !== 2 || !/^[0-9a-f]{8}$/u.test(parts[1])) throw new Error("Invalid share envelope");
  const bytes = decodeBase64Url(parts[0]);
  const actualChecksum = crc32(bytes).toString(16).padStart(8, "0");
  if (actualChecksum !== parts[1]) throw new Error("Share checksum mismatch");
  const json = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const value: unknown = JSON.parse(json);
  const payload = validateSharePayload(value);
  if (canonicalShareJson(payload) !== json) throw new Error("Payload is not canonically serialized");
  return payload;
}

export function payloadFromResult(result: TestResult): SharePayloadV1 {
  return validateSharePayload({
    v: 1,
    m: result.modelVersion,
    p: result.primary,
    ...(result.secondary ? { s: result.secondary } : {}),
    a: DIMENSION_IDS.map((dimension) => result.dimensions[dimension])
  });
}

export function createShareUrl(result: TestResult, origin = "https://bdsmtest.top"): string {
  return `${origin.replace(/\/$/u, "")}/#r=${encodeSharePayload(payloadFromResult(result))}`;
}
