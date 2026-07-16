import type { ProfileId, ProfileMeta } from "../lib/model";

export const profileDisplayNames: Record<ProfileId, string> = {
  Dominant: "Dominant",
  Submissive: "Submissive",
  Switch: "Switch",
  "Sensation Giver": "Sadist / sensation giver",
  "Sensation Receiver": "Masochist / sensation receiver",
  Rigger: "Rigger / bondage giver",
  "Rope Receiver": "Rope receiver / bondage receiver",
  Caregiver: "Caregiver",
  Brat: "Brat",
  Experimentalist: "Experimentalist"
};

export const profiles: ProfileMeta[] = [
  {
    id: "Dominant",
    primaryDimension: "DIR",
    hook: "You want the room to move when you decide it moves.",
    summary: "You may enjoy shaping structure, pace, and responsibility within clear agreements.",
    reflection: "Direction works best when authority and responsibility grow together."
  },
  {
    id: "Submissive",
    primaryDimension: "SUR",
    hook: "Giving the wheel away—on purpose—is part of the charge.",
    summary: "You may enjoy intentionally handing over some control within negotiated limits.",
    reflection: "Surrender can be active and chosen, with trust and boundaries doing essential work."
  },
  {
    id: "Switch",
    primaryDimension: "DIR",
    hook: "Both sides of the current light you up.",
    summary: "Both guiding and surrendering may appeal, depending on the person, scene, or moment.",
    reflection: "Switching does not have to be evenly split or look the same in every relationship."
  },
  {
    id: "Sensation Giver",
    primaryDimension: "IGV",
    hook: "Their shiver is part of what you're after.",
    summary: "Creating controlled intensity and responding closely to a partner may appeal to you.",
    reflection: "Attention, calibration, and consent are more informative than intensity alone."
  },
  {
    id: "Sensation Receiver",
    primaryDimension: "IRC",
    hook: "Intensity lands best when you've chosen to take it.",
    summary: "Receiving controlled intensity or a test of composure may hold appeal.",
    reflection: "Appeal does not erase limits; pacing and communication still shape the experience."
  },
  {
    id: "Rigger",
    primaryDimension: "RST",
    hook: "Holding someone still is a craft you want to own.",
    summary: "The precision, responsibility, and craft of restraint may be especially interesting.",
    reflection: "This profile describes an affinity, not technical competence or safety training."
  },
  {
    id: "Rope Receiver",
    primaryDimension: "RST",
    hook: "Being held in place is where the anticipation lives.",
    summary: "Restricted movement, anticipation, or the experience of being restrained may appeal.",
    reflection: "This affinity is separate from whether you prefer to direct or surrender overall."
  },
  {
    id: "Caregiver",
    primaryDimension: "CAR",
    hook: "Authority that looks after someone—that pulls hard.",
    summary: "Service, attentiveness, ritual, and responsibility may be central to your interest.",
    reflection: "Care is most meaningful when it is discussed rather than assumed."
  },
  {
    id: "Brat",
    primaryDimension: "PLY",
    hook: "You push so they'll catch you. That's the game.",
    summary: "Playful resistance, wit, and negotiated challenge may create enjoyable tension.",
    reflection: "A playful no and a real no must remain easy to tell apart."
  },
  {
    id: "Experimentalist",
    primaryDimension: "EXP",
    hook: "The charge before the scene might be the best part.",
    summary: "Novel dynamics, atmosphere, and planned scenarios may draw your curiosity.",
    reflection: "Exploration can be paced and bounded rather than limitless."
  }
];

export const OPEN_ENDED_HOOK = "No single role owns you—your map is wider than one label.";
export const OPEN_ENDED_SUMMARY =
  "No single role scored high enough to become your main match. Your individual role and preference scores may be more useful than one label.";
