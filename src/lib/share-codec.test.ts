import { describe, expect, it } from "vitest";
import type { SharePayloadV1 } from "./share-codec";
import { canonicalShareJson, decodeShareEnvelope, encodeSharePayload, validateSharePayload } from "./share-codec";

const fixtures: SharePayloadV1[] = [
  { v: 1, m: "1.0.0", p: "Caregiver", s: "Dominant", a: [72, 38, 45, 31, 42, 81, 56, 60] },
  { v: 1, m: "1.0.0", p: "Dominant / Caregiver", a: [78, 29, 51, 30, 47, 75, 49, 58] },
  { v: 1, m: "1.0.0", p: "Open-ended Explorer", a: [41, 36, 29, 33, 38, 44, 40, 43] }
];

const goldenEnvelopes = [
  "eyJ2IjoxLCJtIjoiMS4wLjAiLCJwIjoiQ2FyZWdpdmVyIiwicyI6IkRvbWluYW50IiwiYSI6WzcyLDM4LDQ1LDMxLDQyLDgxLDU2LDYwXX0.c6c133f6",
  "eyJ2IjoxLCJtIjoiMS4wLjAiLCJwIjoiRG9taW5hbnQgLyBDYXJlZ2l2ZXIiLCJhIjpbNzgsMjksNTEsMzAsNDcsNzUsNDksNThdfQ.a8a82916",
  "eyJ2IjoxLCJtIjoiMS4wLjAiLCJwIjoiT3Blbi1lbmRlZCBFeHBsb3JlciIsImEiOls0MSwzNiwyOSwzMywzOCw0NCw0MCw0M119.8935007c"
];

describe("share codec", () => {
  it.each(fixtures)("round-trips the $p fixture", (fixture) => {
    expect(decodeShareEnvelope(encodeSharePayload(fixture))).toEqual(fixture);
  });

  it("matches the version-one golden envelopes", () => {
    expect(fixtures.map(encodeSharePayload)).toEqual(goldenEnvelopes);
  });

  it("serializes fields in the canonical order", () => {
    expect(canonicalShareJson(fixtures[0])).toBe('{"v":1,"m":"1.0.0","p":"Caregiver","s":"Dominant","a":[72,38,45,31,42,81,56,60]}');
    expect(canonicalShareJson(fixtures[1])).toBe('{"v":1,"m":"1.0.0","p":"Dominant / Caregiver","a":[78,29,51,30,47,75,49,58]}');
  });

  it("rejects a modified checksum", () => {
    const envelope = encodeSharePayload(fixtures[0]);
    const last = envelope.at(-1) === "0" ? "1" : "0";
    expect(() => decodeShareEnvelope(`${envelope.slice(0, -1)}${last}`)).toThrow("checksum");
  });

  it("rejects answers, identifiers, and unknown fields", () => {
    expect(() => validateSharePayload({ ...fixtures[0], answers: [4, 4] })).toThrow("unknown fields");
    expect(() => validateSharePayload({ ...fixtures[0], id: "sender-1" })).toThrow("unknown fields");
  });

  it("rejects impossible secondary-profile combinations", () => {
    expect(() => validateSharePayload({ ...fixtures[1], s: "Submissive" })).toThrow("Secondary profile");
    expect(() => validateSharePayload({ ...fixtures[2], s: "Submissive" })).toThrow("Secondary profile");
  });

  it("rejects non-canonical JSON even when its checksum is valid", () => {
    const nonCanonical = '{"m":"1.0.0","v":1,"p":"Caregiver","a":[72,38,45,31,42,81,56,60]}';
    const bytes = new TextEncoder().encode(nonCanonical);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
    const crc = (() => {
      let value = 0xffffffff;
      for (const byte of bytes) {
        value ^= byte;
        for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
      }
      return ((value ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
    })();
    expect(() => decodeShareEnvelope(`${base64}.${crc}`)).toThrow("canonically serialized");
  });
});
