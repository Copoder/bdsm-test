import type { AnswerValue, DimensionMeta, Question } from "../lib/model";

export const MODEL_VERSION = "1.0.0";
export const QUESTION_VERSION = "1.0.0";

export const answerOptions: Array<{ value: AnswerValue; label: string; note: string }> = [
  { value: 0, label: "Strongly unappealing", note: "Not appealing right now; not automatically a hard limit." },
  { value: 1, label: "Somewhat unappealing", note: "Low current appeal." },
  { value: 2, label: "It depends / unsure", note: "Context, trust, rules, or understanding may matter." },
  { value: 3, label: "Somewhat appealing", note: "Appealing now; no experience implied." },
  { value: 4, label: "Strongly appealing", note: "Strong current appeal; not an identity commitment." }
];

export const dimensions: DimensionMeta[] = [
  {
    id: "DIR",
    name: "Direction",
    shortName: "Direction",
    description: "Setting pace, structure, and agreed rules while taking responsibility for guidance.",
    disclaimer: "This does not imply controlling everyday relationships or ignoring consent.",
    communicationPrompt: "What kind of responsibility feels good when you are setting the pace?",
    color: "#7c1f2a"
  },
  {
    id: "SUR",
    name: "Surrender",
    shortName: "Surrender",
    description: "Handing over some control and accepting guidance within negotiated limits.",
    disclaimer: "This does not imply weakness or submission in every part of life.",
    communicationPrompt: "What would help you feel safe enough to hand over some control?",
    color: "#386b68"
  },
  {
    id: "IGV",
    name: "Intensity Giving",
    shortName: "Giving intensity",
    description: "Creating strong, controlled sensations while reading reactions and adjusting.",
    disclaimer: "This does not imply an interest in non-consensual harm.",
    communicationPrompt: "How would you want a partner to communicate changing intensity?",
    color: "#9a4c2d"
  },
  {
    id: "IRC",
    name: "Intensity Receiving",
    shortName: "Receiving intensity",
    description: "Receiving strong sensations, challenges, or tests of composure within agreed limits.",
    disclaimer: "This does not mean enjoying injury or distress in daily life.",
    communicationPrompt: "What signals would help you stay comfortable as intensity builds?",
    color: "#6d5479"
  },
  {
    id: "RST",
    name: "Restraint & Craft",
    shortName: "Restraint & craft",
    description: "Restraint, restricted movement, tools, precision, and visual or practical craft.",
    disclaimer: "This is independent from being dominant or submissive.",
    communicationPrompt: "Which kinds of restriction feel interesting, and which are off the table?",
    color: "#53666f"
  },
  {
    id: "CAR",
    name: "Service & Care",
    shortName: "Service & care",
    description: "Service, responsibility, ritual, attentiveness, and care before or after intensity.",
    disclaimer: "This does not prescribe gender roles or assumed obligations.",
    communicationPrompt: "What forms of care or service feel meaningful rather than assumed?",
    color: "#4f6a45"
  },
  {
    id: "PLY",
    name: "Play & Challenge",
    shortName: "Play & challenge",
    description: "Playful resistance, rules games, wit, teasing, and negotiated back-and-forth tension.",
    disclaimer: "Playful resistance must remain clearly distinct from a real no.",
    communicationPrompt: "How can playful resistance stay clearly different from a real no?",
    color: "#9b6b2e"
  },
  {
    id: "EXP",
    name: "Exploration & Ritual",
    shortName: "Exploration & ritual",
    description: "Novel dynamics, atmosphere, roles, scenarios, anticipation, and planning together.",
    disclaimer: "Curiosity does not mean having no boundaries or seeking high risk.",
    communicationPrompt: "What would make a new dynamic feel prepared rather than rushed?",
    color: "#45607c"
  }
];

export const questions: Question[] = [
  { id: 1, dimension: "DIR", text: "Setting the pace and structure of a consensual scene feels appealing to me.", tags: ["control-giving"] },
  { id: 2, dimension: "DIR", text: "I like the idea of a partner looking to me for clear decisions within agreed limits.", tags: ["control-giving"] },
  { id: 3, dimension: "DIR", text: "Creating rules for a scene, then taking responsibility for them, appeals to me.", tags: ["control-giving"] },
  { id: 4, dimension: "DIR", text: "Guiding another person through anticipation and resolution sounds appealing.", tags: ["control-giving"] },
  { id: 5, dimension: "SUR", text: "Letting a trusted partner set the pace within negotiated limits feels appealing.", tags: ["control-receiving"] },
  { id: 6, dimension: "SUR", text: "Following clear instructions in a consensual scene sounds freeing to me.", tags: ["control-receiving"] },
  { id: 7, dimension: "SUR", text: "Temporarily handing over decisions to someone I trust feels exciting.", tags: ["control-receiving"] },
  { id: 8, dimension: "SUR", text: "Being held to agreed expectations appeals to me.", tags: ["control-receiving"] },
  { id: 9, dimension: "IGV", text: "Carefully creating strong sensations for a consenting partner appeals to me.", tags: ["sensation-giving"] },
  { id: 10, dimension: "IGV", text: "Watching a partner's reactions and adjusting the intensity sounds satisfying.", tags: ["sensation-giving"] },
  { id: 11, dimension: "IGV", text: "Building intensity toward a clearly agreed limit feels appealing.", tags: ["sensation-giving"] },
  { id: 12, dimension: "IGV", text: "Controlled discomfort can be an appealing part of a consensual scene for me to give.", tags: ["sensation-giving"] },
  { id: 13, dimension: "IRC", text: "Experiencing strong sensations within clear limits feels appealing to me.", tags: ["sensation-receiving"] },
  { id: 14, dimension: "IRC", text: "A consensual test of endurance or composure sounds exciting.", tags: ["sensation-receiving"] },
  { id: 15, dimension: "IRC", text: "Letting a trusted partner build intensity while I stay present appeals to me.", tags: ["sensation-receiving"] },
  { id: 16, dimension: "IRC", text: "Controlled discomfort can be an appealing part of a consensual scene for me to receive.", tags: ["sensation-receiving"] },
  { id: 17, dimension: "RST", text: "Restraining a consenting partner with care and skill sounds appealing.", tags: ["restraint-giving"] },
  { id: 18, dimension: "RST", text: "Being safely restrained by someone I trust sounds appealing.", tags: ["restraint-receiving"] },
  { id: 19, dimension: "RST", text: "The planning, precision, or visual craft of restraint interests me.", tags: ["craft"] },
  { id: 20, dimension: "RST", text: "Limited movement can heighten anticipation for me.", tags: ["restraint-receiving"] },
  { id: 21, dimension: "CAR", text: "Taking care of a partner before, during, and after an intense experience feels meaningful and appealing.", tags: ["service-care-giving"] },
  { id: 22, dimension: "CAR", text: "Doing meaningful acts of service within an agreed dynamic appeals to me.", tags: ["service-care-giving"] },
  { id: 23, dimension: "CAR", text: "Receiving attentive care after a demanding experience feels appealing.", tags: ["care-receiving"] },
  { id: 24, dimension: "CAR", text: "An agreed ritual of responsibility, permission, or appreciation appeals to me.", tags: ["ritual-planning"] },
  { id: 25, dimension: "PLY", text: "Playful resistance inside clearly agreed rules sounds exciting.", tags: ["playful-resistance"] },
  { id: 26, dimension: "PLY", text: "Teasing or testing an agreed power dynamic can add enjoyable tension for me.", tags: ["challenge"] },
  { id: 27, dimension: "PLY", text: "Earning an agreed consequence through playful behavior appeals to me.", tags: ["playful-resistance"] },
  { id: 28, dimension: "PLY", text: "A dynamic with wit, challenge, and back-and-forth energy suits me.", tags: ["challenge"] },
  { id: 29, dimension: "EXP", text: "Exploring an unfamiliar but negotiated dynamic feels appealing.", tags: ["novelty-role"] },
  { id: 30, dimension: "EXP", text: "Atmosphere, anticipation, and ritual feel appealing to me.", tags: ["ritual-planning"] },
  { id: 31, dimension: "EXP", text: "Stepping into a role or carefully designed scenario sounds engaging.", tags: ["novelty-role"] },
  { id: 32, dimension: "EXP", text: "Designing a consensual scene together in advance feels like part of the appeal.", tags: ["ritual-planning"] }
];

export const questionOrder = Array.from({ length: 4 }, (_, round) =>
  dimensions.map((_, dimensionIndex) => questions[dimensionIndex * 4 + round])
).flat();
