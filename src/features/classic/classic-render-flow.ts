import { createActorStateStore, resolveActorDefinition } from "@shared/actors";
import { getPortfolioModeMapping, resolvePortfolioSurface } from "@shared/content/portfolio-graph";
import type {
  ContentEntity,
  ContentRelation,
  ExperienceEntity,
  ModeSurfaceMapping,
  PortfolioContent,
  PortfolioRootEntity,
  ProjectEntity,
  SkillEntity,
  StoryFragmentEntity,
} from "@shared/types/portfolio";
import { classicSectionActorRegistry, classicSectionActors } from "./classic-section-actors";
import { classicSectionRegistry } from "./classic-sections";
import type {
  ClassicActionBlock,
  ClassicCardGridBlock,
  ClassicFactListBlock,
  ClassicQuoteListBlock,
  ClassicRenderBlock,
  ClassicRenderDocument,
  ClassicRenderSection,
  ClassicTagGroupsBlock,
  ClassicTimelineBlock,
} from "./classic-rendering-types";

const isKind = <TKind extends ContentEntity["kind"]>(
  entity: ContentEntity,
  kind: TKind,
): entity is Extract<ContentEntity, { kind: TKind }> => entity.kind === kind;

export const createClassicRenderDocument = (content: PortfolioContent): ClassicRenderDocument => {
  const root = requireRootEntity(content);
  const classicMapping = getPortfolioModeMapping(content, "classic");

  if (!classicMapping) {
    throw new Error("Missing classic mode mapping.");
  }

  const stateStore = createActorStateStore(classicSectionActors);

  const sections = classicSectionRegistry
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((sectionDefinition): ClassicRenderSection => {
      const actor = classicSectionActorRegistry.requireActor(sectionDefinition.actorId);
      const resolvedActor = resolveActorDefinition({
        actorId: actor.id,
        registry: classicSectionActorRegistry,
        stateStore,
        content,
      });
      const surface = getRequiredSurface(classicMapping.surfaces, sectionDefinition.surfaceId);
      const resolvedSurface = resolvePortfolioSurface(content, surface);

      return {
        id: sectionDefinition.id,
        title: sectionDefinition.label,
        kicker: sectionDefinition.kicker,
        summary: resolvedActor.contentLinks.some((link) => link.found)
          ? sectionDefinition.summary
          : `${sectionDefinition.summary} Mapping missing.`,
        blocks: buildBlocks(sectionDefinition.id, content, root, resolvedSurface.entities, resolvedSurface.relations),
      };
    });

  return {
    mode: "classic",
    title: root.title,
    subtitle: root.payload.headline,
    sections,
  };
};

const buildBlocks = (
  sectionId: ClassicRenderSection["id"],
  content: PortfolioContent,
  root: PortfolioRootEntity,
  entities: ContentEntity[],
  relations: ContentRelation[],
): ClassicRenderBlock[] => {
  switch (sectionId) {
    case "hero":
      return createHeroBlocks(root, entities);
    case "about":
      return createAboutBlocks(root, entities);
    case "projects":
      return [createProjectCards(entities, relations)];
    case "skills":
      return [createSkillGroups(content)];
    case "experience":
      return [createExperienceTimeline(entities)];
    case "references":
      return [createReferenceQuotes(content, entities)];
    case "contact":
      return createContactBlocks(root);
    case "cta":
      return [createCallToAction(root)];
    default:
      return [];
  }
};

const createHeroBlocks = (root: PortfolioRootEntity, entities: ContentEntity[]): ClassicRenderBlock[] => {
  const experience = entities.find((entity): entity is ExperienceEntity => entity.kind === "experience");
  const highlightedProjects = entities
    .filter((entity): entity is ProjectEntity => entity.kind === "project")
    .slice(0, 3)
    .map((project) => project.title);

  const facts: ClassicFactListBlock = {
    type: "fact-list",
    items: [
      { label: "Based in", value: root.payload.location ?? "Switzerland" },
      { label: "Modes", value: root.payload.modes.join(" / ") },
      { label: "Current stage", value: experience?.payload.timeframe ?? "Active" },
    ],
  };

  return [
    { type: "lede", text: root.summary },
    facts,
    {
      type: "bullet-list",
      items: [
        root.payload.headline,
        ...(experience?.payload.focusAreas ?? []),
        ...(highlightedProjects.length ? [`Recent proof: ${highlightedProjects.join(", ")}`] : []),
      ],
    },
    {
      type: "link-list",
      text: "Primary links",
      links: root.links ?? [],
    },
  ];
};

const createAboutBlocks = (root: PortfolioRootEntity, entities: ContentEntity[]): ClassicRenderBlock[] => {
  const stories = entities.filter((entity): entity is StoryFragmentEntity => entity.kind === "story-fragment");

  return [
    { type: "lede", text: root.summary },
    {
      type: "quote-list",
      items: stories.length
        ? stories.map((story) => ({
            title: story.title,
            text: story.summary,
          }))
        : root.tags.map((tag) => ({
            title: tag,
            text: "Shared portfolio signal.",
          })),
    },
  ];
};

const createProjectCards = (entities: ContentEntity[], relations: ContentRelation[]): ClassicCardGridBlock => {
  const entityLookup = new Map(entities.map((entity) => [entity.id, entity]));
  const projects = entities.filter((entity): entity is ProjectEntity => entity.kind === "project");

  return {
    type: "card-grid",
    items: projects.map((project) => ({
      eyebrow: project.payload.role,
      title: project.title,
      text: project.summary,
      tags: project.payload.stack,
      bullets: relations
        .filter((relation) => relation.sourceId === project.id && relation.type === "demonstrates")
        .map((relation) => entityLookup.get(relation.targetId))
        .filter((entity): entity is SkillEntity => entity !== undefined && entity.kind === "skill")
        .map((skill) => skill.title),
      links: project.links ?? [],
    })),
  };
};

const createSkillGroups = (content: PortfolioContent): ClassicTagGroupsBlock => {
  const skills = content.entities.filter((entity): entity is SkillEntity => entity.kind == "skill");
  const evidenceBySkill = createEvidenceBySkill(content.relations, content.entities);
  const grouped = new Map<string, string[]>();

  skills.forEach((skill) => {
    const current = grouped.get(skill.payload.category) ?? [];
    const evidence = evidenceBySkill.get(skill.id);
    current.push(evidence?.length ? `${skill.title} - ${evidence.join(", ")}` : skill.title);
    grouped.set(skill.payload.category, current);
  });

  return {
    type: "tag-groups",
    groups: Array.from(grouped.entries()).map(([label, items]) => ({ label, items })),
  };
};

const createExperienceTimeline = (entities: ContentEntity[]): ClassicTimelineBlock => ({
  type: "timeline",
  items: entities
    .filter((entity): entity is ExperienceEntity => entity.kind === "experience")
    .map((experience) => ({
      label: experience.payload.timeframe,
      title: experience.title,
      text: experience.summary,
      bullets: experience.payload.focusAreas,
    })),
});

const createReferenceQuotes = (content: PortfolioContent, entities: ContentEntity[]): ClassicQuoteListBlock => {
  const entityLookup = new Map(content.entities.map((entity) => [entity.id, entity]));
  const stories = entities.filter((entity): entity is StoryFragmentEntity => entity.kind === "story-fragment");

  return {
    type: "quote-list",
    items: stories.map((story) => ({
      title: story.title,
      text: [story.summary, formatReferenceEvidence(story.id, content.relations, entityLookup)]
        .filter(Boolean)
        .join(" Backed by: "),
    })),
  };
};

const createContactBlocks = (root: PortfolioRootEntity): ClassicRenderBlock[] => [
  {
    type: "lede",
    text: "Open to conversations about junior full-stack, frontend, backend, and product-minded engineering roles.",
  },
  {
    type: "fact-list",
    items: [
      { label: "Focus", value: "Junior full-stack and product-minded web roles" },
      { label: "Location", value: root.payload.location ?? "Switzerland" },
    ],
  },
  {
    type: "link-list",
    links: root.links ?? [],
  },
];

const createCallToAction = (root: PortfolioRootEntity): ClassicActionBlock => ({
  type: "action",
  title: "Continue the conversation",
  text: "The classic mode stays intentionally direct: review the work, then jump into the shared profile links.",
  links: root.links ?? [],
});

const createEvidenceBySkill = (
  relations: ContentRelation[],
  entities: ContentEntity[],
): Map<string, string[]> => {
  const entityLookup = new Map(entities.map((entity) => [entity.id, entity]));
  const evidenceBySkill = new Map<string, string[]>();

  relations
    .filter((relation) => relation.type === "demonstrates" || relation.type === "supports")
    .forEach((relation) => {
      const source = entityLookup.get(relation.sourceId);
      const target = entityLookup.get(relation.targetId);

      if (!source || !target || target.kind !== "skill") {
        return;
      }

      const current = evidenceBySkill.get(target.id) ?? [];
      current.push(source.title);
      evidenceBySkill.set(target.id, Array.from(new Set(current)));
    });

  return evidenceBySkill;
};

const formatReferenceEvidence = (
  storyId: string,
  relations: ContentRelation[],
  entityLookup: Map<string, ContentEntity>,
): string =>
  relations
    .filter((relation) => relation.sourceId === storyId && relation.type === "references")
    .map((relation) => entityLookup.get(relation.targetId))
    .filter((entity): entity is ProjectEntity => entity !== undefined && entity.kind === "project")
    .map((project) => project.title)
    .join(", ");

const getRequiredSurface = (surfaces: ModeSurfaceMapping[], surfaceId: string): ModeSurfaceMapping => {
  const surface = surfaces.find((entry) => entry.id === surfaceId);

  if (!surface) {
    throw new Error(`Missing classic surface: ${surfaceId}`);
  }

  return surface as ModeSurfaceMapping;
};

const requireRootEntity = (content: PortfolioContent): PortfolioRootEntity => {
  const root = content.entities.find(
    (entity): entity is PortfolioRootEntity => entity.id === content.rootPortfolioId && entity.kind === "portfolio",
  );

  if (!root) {
    throw new Error(`Missing root portfolio entity: ${content.rootPortfolioId}`);
  }

  return root;
};
