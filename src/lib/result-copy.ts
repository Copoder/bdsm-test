import { OPEN_ENDED_HOOK, OPEN_ENDED_SUMMARY, profileDisplayNames, profiles } from "../data/profiles";
import { PROFILE_IDS, type ProfileId, type TestResult } from "./model";

export interface ResultSpotlight {
  kicker: string;
  hook: string;
  summary: string;
  /** Primary match strength 0–100, omitted for open-ended. */
  matchScore?: number;
  /** Compact “Top 3” readout for the hero strip. */
  topLine: string;
  shareText: string;
  imageCaption: string;
}

const profileById = (id: string) => profiles.find((profile) => profile.id === id);

const rankedProfiles = (result: TestResult): ProfileId[] =>
  [...PROFILE_IDS].sort((a, b) => result.profileScores[b] - result.profileScores[a]);

const displayPrimary = (result: TestResult): string => {
  if (result.isOpenEnded) return "Open-ended Explorer";
  if (result.isBlended) {
    return result.primary
      .split(" / ")
      .map((id) => profileDisplayNames[id as ProfileId] ?? id)
      .join(" / ");
  }
  return profileDisplayNames[result.primary as ProfileId] ?? result.primary;
};

const strengthKicker = (score: number, blended: boolean): string => {
  if (blended) return "Two pulls share the lead";
  if (score >= 80) return "A hard pull showed up";
  if (score >= 65) return "A clear pull showed up";
  return "Your clearest pull right now";
};

export function buildResultSpotlight(result: TestResult): ResultSpotlight {
  const ranked = rankedProfiles(result);
  const topThree = ranked.slice(0, 3).map((id) => {
    const score = Math.round(result.profileScores[id]);
    return `${profileDisplayNames[id]} ${score}`;
  });
  const topLine = topThree.join(" · ");
  const title = displayPrimary(result);

  if (result.isOpenEnded) {
    return {
      kicker: "Your map stays open",
      hook: OPEN_ENDED_HOOK,
      summary: OPEN_ENDED_SUMMARY,
      topLine,
      shareText: `I mapped my BDSM preferences—no single role owned the result. See the shape, then find yours.`,
      imageCaption: OPEN_ENDED_HOOK
    };
  }

  if (result.isBlended) {
    const [firstId, secondId] = result.primary.split(" / ") as [ProfileId, ProfileId];
    const first = profileById(firstId);
    const second = profileById(secondId);
    const firstScore = Math.round(result.profileScores[firstId]);
    const secondScore = Math.round(result.profileScores[secondId]);
    const hook = `Not one note—${profileDisplayNames[firstId]} and ${profileDisplayNames[secondId]} share the lead.`;
    const summary = [first?.summary, second?.summary].filter(Boolean).join(" ");
    return {
      kicker: strengthKicker(firstScore, true),
      hook,
      summary,
      matchScore: firstScore,
      topLine: `${profileDisplayNames[firstId]} ${firstScore} · ${profileDisplayNames[secondId]} ${secondScore}${
        topThree[2] ? ` · ${topThree[2]}` : ""
      }`,
      shareText: `I took the BDSM Test and landed on ${title} (${firstScore}/${secondScore}). ${hook} See my shared result, then discover yours.`,
      imageCaption: hook
    };
  }

  const profile = profileById(result.primary);
  const matchScore = Math.round(result.profileScores[result.primary as ProfileId]);
  const hook = profile?.hook ?? "This is the clearest pull in today's answers.";
  const summary = profile ? `${profile.summary} ${profile.reflection}` : "Your result is based on the role and preference scores below.";
  const secondaryNote = result.secondary
    ? ` Secondary tendency: ${profileDisplayNames[result.secondary]} (${Math.round(result.profileScores[result.secondary])}).`
    : "";

  return {
    kicker: strengthKicker(matchScore, false),
    hook,
    summary: `${summary}${secondaryNote}`,
    matchScore,
    topLine,
    shareText: `I took the BDSM Test and got ${title} (${matchScore}). ${hook} See my shared result, then discover yours.`,
    imageCaption: hook
  };
}
