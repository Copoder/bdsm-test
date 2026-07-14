import type { DimensionId } from "../lib/model";

export interface RoleGuide {
  slug: string;
  name: string;
  commonTerm?: string;
  summary: string;
  definition: string;
  notMeaning: string;
  distinction: string;
  dimensions: DimensionId[];
  interests: string[];
  questions: string[];
}

export const roleGuides: RoleGuide[] = [
  {
    slug: "dominant",
    name: "Dominant",
    summary: "A person who may enjoy taking agreed authority, setting structure, or guiding a dynamic.",
    definition: "Dominant describes an orientation toward directing some part of a consensual interaction or relationship. The scope can be a single scene, a recurring ritual, or a wider negotiated dynamic. It says nothing by itself about gender, harshness, sexual position, or everyday personality.",
    notMeaning: "Being dominant does not grant blanket permission, remove responsibility, or imply controlling a partner outside what was agreed.",
    distinction: "Dominant is about negotiated authority. Top more often describes the person performing an action in a particular scene; one person can top without identifying as dominant.",
    dimensions: ["DIR", "CAR", "EXP"],
    interests: ["Setting pace or structure", "Taking responsibility for agreed rules", "Guiding anticipation and resolution", "Combining authority with service or care"],
    questions: ["What decisions are actually being delegated?", "How will either person pause or revise the agreement?", "What responsibility comes with the authority?" ]
  },
  {
    slug: "submissive",
    name: "Submissive",
    summary: "A person who may enjoy intentionally yielding agreed control or following another person's direction.",
    definition: "Submissive describes an attraction to chosen surrender within a negotiated scope. That surrender can feel freeing, focused, intimate, playful, or ritualized. It can coexist with confidence, leadership in daily life, and firm personal boundaries.",
    notMeaning: "Submission is not weakness, passivity, lower status as a person, or permanent consent to whatever a dominant wants.",
    distinction: "Submissive is about an agreed power relationship. Bottom usually describes receiving an action in a scene; a bottom may or may not want to surrender authority.",
    dimensions: ["SUR", "CAR", "EXP"],
    interests: ["Following clear instructions", "Handing over specific decisions", "Being held to agreed expectations", "Finding focus through structure"],
    questions: ["What remains entirely in your control?", "What signals make surrender feel chosen?", "How should care and reconnection happen afterward?"]
  },
  {
    slug: "switch",
    name: "Switch",
    summary: "A person who may enjoy both directing and surrendering, with preference changing by context.",
    definition: "Switch describes meaningful attraction to more than one side of a power or activity dynamic. The balance does not have to be equal. Someone may switch by partner, mood, relationship, type of activity, or stage of life.",
    notMeaning: "Switch does not mean indecisive, inexperienced, exactly fifty-fifty, or available for either role at any time.",
    distinction: "Switch is broader than changing positions during one activity. The useful question is which forms of responsibility and surrender appeal in which contexts.",
    dimensions: ["DIR", "SUR", "EXP"],
    interests: ["Alternating who directs", "Different roles with different partners", "Exploring both responsibility and surrender", "Negotiating scene-specific roles"],
    questions: ["What makes one side more appealing in a given moment?", "Does switching require a clear transition ritual?", "Are any activities role-specific for you?"]
  },
  {
    slug: "sensation-giver",
    name: "Sensation Giver",
    commonTerm: "Sadist-leaning",
    summary: "A person drawn to creating controlled intensity while closely attending to a consenting partner.",
    definition: "Sensation Giver is our neutral profile name for attraction to delivering strong sensations, building intensity, and observing response within agreed limits. Some community members use sadist, but that label can carry meanings a person does not choose.",
    notMeaning: "This affinity does not imply enjoying non-consensual harm, ignoring distress, or possessing the skill to perform any particular activity safely.",
    distinction: "Intensity giving can overlap with dominance but is not the same construct. A giver may follow a receiver's direction or operate without a power-exchange frame.",
    dimensions: ["IGV", "DIR", "CAR"],
    interests: ["Calibrating changing intensity", "Watching and responding to feedback", "Controlled tests of composure", "Careful build-up and resolution"],
    questions: ["Which feedback signals are easiest to read?", "What intensity changes require a fresh check-in?", "What training is needed before a specific activity?"]
  },
  {
    slug: "sensation-receiver",
    name: "Sensation Receiver",
    commonTerm: "Masochist-leaning",
    summary: "A person drawn to receiving controlled intensity, challenge, or tests of composure.",
    definition: "Sensation Receiver describes attraction to strong sensation or controlled discomfort in a consensual setting. The appeal may involve focus, endurance, anticipation, emotional release, or another personally meaningful experience.",
    notMeaning: "This affinity does not mean wanting injury, deserving pain, tolerating unwanted treatment, or being unable to stop.",
    distinction: "Receiving intensity can occur with or without submission. A receiver can retain direction over pace, tools, and limits throughout a scene.",
    dimensions: ["IRC", "SUR", "CAR"],
    interests: ["Strong but bounded sensation", "Tests of endurance or composure", "Trusting a partner to adjust carefully", "Aftercare or space after intensity"],
    questions: ["Which signals show that intensity is still welcome?", "What changes when you are tired or stressed?", "What physical or health factors need discussion first?"]
  },
  {
    slug: "rigger",
    name: "Rigger",
    summary: "A person interested in applying restraint, often with attention to precision, responsibility, and craft.",
    definition: "Rigger is commonly used for the person applying rope restraint, though some people use it more broadly. Attraction can center on technical problem-solving, visual composition, caretaking responsibility, restricted movement, or a power dynamic.",
    notMeaning: "A profile match does not demonstrate competence. Rope and restraint involve activity-specific risks that require education, communication, and appropriate safety planning.",
    distinction: "Rigger describes an activity role. It does not automatically mean dominant, top in every activity, or interested in pain.",
    dimensions: ["RST", "DIR", "CAR"],
    interests: ["Planning and precision", "Creating restricted movement", "Visual or tactile craft", "Responsibility for monitoring a partner"],
    questions: ["What training supports the intended restraint?", "How will circulation, comfort, and communication be monitored?", "Which forms of restraint are explicitly out of scope?"]
  },
  {
    slug: "rope-receiver",
    name: "Rope Receiver",
    commonTerm: "Rope bottom; sometimes rope bunny",
    summary: "A person interested in being restrained or in the sensory, visual, and relational experience of rope.",
    definition: "Rope Receiver describes the person receiving rope restraint. Appeal can come from limited movement, pressure, trust, attention, visual expression, quiet focus, or collaborative craft. Community language varies, and not everyone prefers rope bunny.",
    notMeaning: "Receiving rope does not imply submission, passivity, unlimited endurance, or consent to suspension or any other specific form of restraint.",
    distinction: "Rope receiver is an activity position rather than a complete relationship role. A receiver can actively direct the scene and define its technical limits.",
    dimensions: ["RST", "SUR", "EXP"],
    interests: ["Restricted movement", "The sensation and visual form of rope", "Focused trust and attention", "Collaborative scene design"],
    questions: ["Which positions and pressure feel acceptable?", "How will numbness or discomfort be communicated?", "What experience and safety knowledge does the rigger have?"]
  },
  {
    slug: "caregiver",
    name: "Caregiver",
    summary: "A person who may find service, attentiveness, ritual, and responsibility central to a dynamic.",
    definition: "Caregiver describes attraction to providing structure, practical service, reassurance, recovery support, or attentive responsibility. Care can accompany dominance, submission, intensity, or a dynamic with no power exchange at all.",
    notMeaning: "Care is not permission to override autonomy, assume dependency, diagnose a partner, or neglect the caregiver's own limits.",
    distinction: "Caregiver in this test is a broad service-and-care profile, not a reference to age play and not a clinical caregiving role.",
    dimensions: ["CAR", "DIR", "EXP"],
    interests: ["Acts of service", "Rituals of responsibility or appreciation", "Preparation and aftercare", "Attentive guidance"],
    questions: ["Which forms of care are wanted rather than assumed?", "How will both people's needs be voiced?", "When does support become too much responsibility?"]
  },
  {
    slug: "brat",
    name: "Brat",
    summary: "A person drawn to playful resistance, wit, teasing, and negotiated challenge.",
    definition: "Brat is a community role associated with playful testing, resistance, provocation, or back-and-forth energy inside clear agreements. The appeal may be attention, earned consequences, humor, tension, or an active form of submission.",
    notMeaning: "Bratting is not a license to ignore boundaries, create real conflict, manipulate consent, or treat an unnegotiated no as play.",
    distinction: "A brat can be submissive, switch, or outside a power-exchange identity. What defines the pattern is negotiated challenge, not simply being difficult.",
    dimensions: ["PLY", "SUR", "DIR"],
    interests: ["Playful resistance", "Wit and back-and-forth energy", "Earning agreed consequences", "Testing a negotiated structure"],
    questions: ["How will a playful no differ from a real no?", "Which kinds of teasing are not welcome?", "How does either person end the game without ambiguity?"]
  },
  {
    slug: "experimentalist",
    name: "Experimentalist",
    summary: "A person drawn to novelty, atmosphere, roles, scenarios, and collaborative exploration.",
    definition: "Experimentalist is our profile for broad curiosity about unfamiliar but negotiated dynamics. The appeal may lie in preparation, atmosphere, role-taking, discovery, or combining familiar interests in a new way.",
    notMeaning: "Curiosity does not mean having no limits, accepting high risk, escalating constantly, or treating a partner as an experiment.",
    distinction: "Experimentalist describes a pattern of exploration rather than a standard community identity. A person can be highly exploratory while keeping a narrow set of firm boundaries.",
    dimensions: ["EXP", "PLY", "RST"],
    interests: ["New negotiated dynamics", "Designed scenarios or roles", "Atmosphere and anticipation", "Planning an experience together"],
    questions: ["What information is needed before trying something new?", "Which part is appealing: the activity, role, atmosphere, or novelty?", "What is the lowest-risk way to explore the idea?"]
  }
];
