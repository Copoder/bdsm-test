export const boundaryValues = ["hard", "depends", "open", "private"] as const;
export type BoundaryValue = (typeof boundaryValues)[number];

export const boundaryOptions: Array<{ value: BoundaryValue; label: string }> = [
  { value: "hard", label: "Hard limit" },
  { value: "depends", label: "Depends on conditions" },
  { value: "open", label: "Open to discuss" },
  { value: "private", label: "Prefer not to answer" }
];

export const boundaryCategories = [
  { id: "giving-control", label: "Giving control", note: "Setting direction, rules, or pace." },
  { id: "receiving-control", label: "Receiving control", note: "Handing over agreed decisions or direction." },
  { id: "rules-protocol", label: "Rules & protocol", note: "Expectations, permissions, rituals, or formal structure." },
  { id: "physical-restraint", label: "Physical restraint", note: "Restricted movement or restraint tools." },
  { id: "strong-sensation", label: "Strong sensation", note: "Intense but controlled physical sensation." },
  { id: "consensual-pain", label: "Consensual pain", note: "Pain or discomfort as an explicitly negotiated element." },
  { id: "humiliation", label: "Humiliation / degradation", note: "Language or scenarios involving consensual degradation." },
  { id: "service", label: "Service", note: "Acts of care, service, responsibility, or devotion." },
  { id: "role-play", label: "Role or scenario play", note: "Taking on a role or designed narrative." },
  { id: "public-visibility", label: "Public visibility", note: "Being seen, noticed, or potentially identifiable." },
  { id: "additional-people", label: "Additional people", note: "Any dynamic involving more than two people." },
  { id: "aftercare", label: "Aftercare needs", note: "Care, space, reassurance, or practical support afterward." }
] as const;

export type BoundaryCategoryId = (typeof boundaryCategories)[number]["id"];
export type BoundaryMap = Partial<Record<BoundaryCategoryId, BoundaryValue>>;
