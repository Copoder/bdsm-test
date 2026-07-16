import type { AnswerValue, DimensionMeta, Question } from "../lib/model";

export const MODEL_VERSION = "1.0.0";
export const QUESTION_VERSION = "1.1.0";

/** Five-point pull scale: 0 = no desire … 4 = strong desire. Midpoint stays contextual/unsure. */
export const answerOptions: Array<{ value: AnswerValue; label: string }> = [
  { value: 0, label: "Turns me off" },
  { value: 1, label: "Leaves me cold" },
  { value: 2, label: "It depends" },
  { value: 3, label: "I'd lean in" },
  { value: 4, label: "Lights me up" }
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

/**
 * Scene prompts rated on the pull scale above.
 * Consent is assumed at the age gate—items stay vivid without repeating legal framing.
 * Tags and dimension ids must stay stable for scoring.v1.json.
 */
export const questions: Question[] = [
  { id: 1, dimension: "DIR", text: "Being the one who decides when we speed up, slow down, or wait.", tags: ["control-giving"] },
  { id: 2, dimension: "DIR", text: "Having a partner look to me for the next move while things are charged.", tags: ["control-giving"] },
  { id: 3, dimension: "DIR", text: "Setting the rules for a scene—then owning every one of them.", tags: ["control-giving"] },
  { id: 4, dimension: "DIR", text: "Guiding someone through the build-up until the release lands.", tags: ["control-giving"] },
  { id: 5, dimension: "SUR", text: "Letting a trusted partner set the pace while I follow.", tags: ["control-receiving"] },
  { id: 6, dimension: "SUR", text: "Being given clear instructions—and feeling freer for it.", tags: ["control-receiving"] },
  { id: 7, dimension: "SUR", text: "Handing over decisions for a while to someone I trust.", tags: ["control-receiving"] },
  { id: 8, dimension: "SUR", text: "Being held to expectations we named together.", tags: ["control-receiving"] },
  { id: 9, dimension: "IGV", text: "Creating sharp sensation for a partner and watching them take it.", tags: ["sensation-giving"] },
  { id: 10, dimension: "IGV", text: "Reading their reactions—and dialing the intensity up or down.", tags: ["sensation-giving"] },
  { id: 11, dimension: "IGV", text: "Building intensity right up to a limit we both know.", tags: ["sensation-giving"] },
  { id: 12, dimension: "IGV", text: "Giving controlled discomfort as part of the play.", tags: ["sensation-giving"] },
  { id: 13, dimension: "IRC", text: "Taking strong sensation inside limits we set.", tags: ["sensation-receiving"] },
  { id: 14, dimension: "IRC", text: "Being tested for endurance or composure by someone I trust.", tags: ["sensation-receiving"] },
  { id: 15, dimension: "IRC", text: "Staying present while a trusted partner turns the intensity up.", tags: ["sensation-receiving"] },
  { id: 16, dimension: "IRC", text: "Receiving controlled discomfort as part of the play.", tags: ["sensation-receiving"] },
  { id: 17, dimension: "RST", text: "Binding a partner with care, skill, and full attention.", tags: ["restraint-giving"] },
  { id: 18, dimension: "RST", text: "Being held still—safely—by someone I trust.", tags: ["restraint-receiving"] },
  { id: 19, dimension: "RST", text: "The craft of restraint: the planning, the precision, the look of it.", tags: ["craft"] },
  { id: 20, dimension: "RST", text: "Not being able to move while anticipation builds.", tags: ["restraint-receiving"] },
  { id: 21, dimension: "CAR", text: "Looking after a partner before, during, and after intensity.", tags: ["service-care-giving"] },
  { id: 22, dimension: "CAR", text: "Doing acts of service inside a power dynamic that means something.", tags: ["service-care-giving"] },
  { id: 23, dimension: "CAR", text: "Being carefully looked after when the intensity is over.", tags: ["care-receiving"] },
  { id: 24, dimension: "CAR", text: "A ritual of permission, responsibility, or appreciation between us.", tags: ["ritual-planning"] },
  { id: 25, dimension: "PLY", text: "Pushing back on purpose—knowing they'll catch it.", tags: ["playful-resistance"] },
  { id: 26, dimension: "PLY", text: "Teasing a power dynamic until the tension snaps taut.", tags: ["challenge"] },
  { id: 27, dimension: "PLY", text: "Earning a consequence through playful defiance.", tags: ["playful-resistance"] },
  { id: 28, dimension: "PLY", text: "Wit, challenge, and back-and-forth that keeps us both sharp.", tags: ["challenge"] },
  { id: 29, dimension: "EXP", text: "Trying an unfamiliar dynamic with someone I trust.", tags: ["novelty-role"] },
  { id: 30, dimension: "EXP", text: "Atmosphere, waiting, ritual—the charge before anything starts.", tags: ["ritual-planning"] },
  { id: 31, dimension: "EXP", text: "Stepping into a role or a scene designed on purpose.", tags: ["novelty-role"] },
  { id: 32, dimension: "EXP", text: "Planning a scene together in advance—and savoring that part.", tags: ["ritual-planning"] }
];

export const questionOrder = Array.from({ length: 4 }, (_, round) =>
  dimensions.map((_, dimensionIndex) => questions[dimensionIndex * 4 + round])
).flat();
