export interface ClassicSectionDefinition {
  id: string;
  label: string;
  kicker: string;
  summary: string;
  surfaceId: string;
  actorId: string;
  order: number;
}

export const classicSectionRegistry: ClassicSectionDefinition[] = [
  {
    id: "hero",
    label: "Patrik Egger",
    kicker: "Classic mode",
    summary: "A reduced, scan-first rendering of the shared portfolio knowledge base.",
    surfaceId: "classic-overview",
    actorId: "classic-section-hero",
    order: 1,
  },
  {
    id: "about",
    label: "About",
    kicker: "Profile",
    summary: "Core positioning and work style derived from shared portfolio and story entities.",
    surfaceId: "classic-overview",
    actorId: "classic-section-about",
    order: 2,
  },
  {
    id: "projects",
    label: "Projects",
    kicker: "Selected work",
    summary: "Lead proof projects and the skills they demonstrate.",
    surfaceId: "classic-projects",
    actorId: "classic-section-projects",
    order: 3,
  },
  {
    id: "skills",
    label: "Skills and technologies",
    kicker: "Capabilities",
    summary: "Capabilities grouped by category and backed by project evidence.",
    surfaceId: "classic-skills",
    actorId: "classic-section-skills",
    order: 4,
  },
  {
    id: "experience",
    label: "Experience and learning path",
    kicker: "Growth",
    summary: "Experience blocks rendered from shared experience entities only.",
    surfaceId: "classic-experience",
    actorId: "classic-section-experience",
    order: 5,
  },
  {
    id: "references",
    label: "References",
    kicker: "Signals",
    summary: "Short story fragments that explain the strongest portfolio themes.",
    surfaceId: "classic-overview",
    actorId: "classic-section-references",
    order: 6,
  },
  {
    id: "contact",
    label: "Contact",
    kicker: "Reach out",
    summary: "Shared outbound links and profile access points.",
    surfaceId: "classic-contact",
    actorId: "classic-section-contact",
    order: 7,
  },
  {
    id: "cta",
    label: "Next step",
    kicker: "CTA",
    summary: "A simple final action derived from the same shared root portfolio entity.",
    surfaceId: "classic-contact",
    actorId: "classic-section-cta",
    order: 8,
  },
];
