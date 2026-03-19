export type AppModeKey = "interactive" | "classic";

export type RouteStatus = "planned" | "ready-for-shell" | "in-progress" | "done";

export type DeliveryStatus = "todo" | "done";

export type PortfolioSectionId =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "references"
  | "contact"
  | "cta";

export interface AppRouteDefinition {
  id: string;
  path: string;
  mode: AppModeKey;
  entryModule: string;
  status: RouteStatus;
}

export interface RuntimeModuleRegistration<TScreen> {
  entryModule: string;
  screen: TScreen;
}

export interface ModeOwnership {
  primary: string[];
  sharedDependencies: string[];
}

export interface DeliveryChecklistItem {
  id: string;
  label: string;
  status: DeliveryStatus;
}

export interface ModeDefinition {
  key: AppModeKey;
  label: string;
  routeBase: string;
  ownership: ModeOwnership;
  extensionPoints: string[];
  contentMappingId: string;
  checklist: DeliveryChecklistItem[];
  todo?: string[];
}

export interface AppShellDefinition {
  appName: string;
  ownerName: string;
  defaultMode: AppModeKey;
  routes: AppRouteDefinition[];
  layoutSlots: string[];
}

export interface ContentLink {
  id: string;
  label: string;
  url: string;
}

export interface ContentNote {
  id: string;
  text: string;
}

export type ContentEntityKind =
  | "portfolio"
  | "portfolio-block"
  | "interactive-object"
  | "story-fragment"
  | "story-hint"
  | "project"
  | "skill"
  | "experience";

export type ContentEntityStatus = "draft" | "active" | "archived";

export type PortfolioBlockType =
  | "hero"
  | "project-cluster"
  | "skill-cluster"
  | "experience-timeline"
  | "contact";

export type InteractiveObjectType = "desk" | "map" | "shelf" | "portal";

export type StoryTone = "practical" | "architectural" | "product" | "reflective";

export type SkillLevel = "core" | "supporting" | "emerging";

export type RelationStrength = "primary" | "supporting";

export type ContentRelationType =
  | "contains"
  | "highlights"
  | "demonstrates"
  | "supports"
  | "anchors"
  | "points-to"
  | "reveals"
  | "references";

export interface RegisteredEntityBase<TKind extends ContentEntityKind, TPayload extends object> {
  id: string;
  kind: TKind;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: ContentEntityStatus;
  links?: ContentLink[];
  payload: TPayload;
}

export interface PortfolioEntityPayload {
  headline: string;
  location?: string;
  modes: AppModeKey[];
}

export interface PortfolioBlockPayload {
  blockType: PortfolioBlockType;
  audienceGoal: string;
}

export interface InteractiveObjectPayload {
  objectType: InteractiveObjectType;
  modeAnchors: string[];
}

export interface StoryFragmentPayload {
  tone: StoryTone;
  prompt: string;
}

export interface StoryHintPayload {
  prompt: string;
  targetObjectId: string;
}

export interface ProjectEntityPayload {
  role: string;
  timeframe: string;
  stack: string[];
  signals: string[];
}

export interface SkillEntityPayload {
  category: string;
  level: SkillLevel;
  evidence: string[];
}

export interface ExperienceEntityPayload {
  organization: string;
  timeframe: string;
  focusAreas: string[];
}

export type PortfolioRootEntity = RegisteredEntityBase<"portfolio", PortfolioEntityPayload>;
export type PortfolioBlockEntity = RegisteredEntityBase<"portfolio-block", PortfolioBlockPayload>;
export type InteractiveObjectEntity = RegisteredEntityBase<"interactive-object", InteractiveObjectPayload>;
export type StoryFragmentEntity = RegisteredEntityBase<"story-fragment", StoryFragmentPayload>;
export type StoryHintEntity = RegisteredEntityBase<"story-hint", StoryHintPayload>;
export type ProjectEntity = RegisteredEntityBase<"project", ProjectEntityPayload>;
export type SkillEntity = RegisteredEntityBase<"skill", SkillEntityPayload>;
export type ExperienceEntity = RegisteredEntityBase<"experience", ExperienceEntityPayload>;

export type ContentEntity =
  | PortfolioRootEntity
  | PortfolioBlockEntity
  | InteractiveObjectEntity
  | StoryFragmentEntity
  | StoryHintEntity
  | ProjectEntity
  | SkillEntity
  | ExperienceEntity;

export interface ContentRelation {
  id: string;
  type: ContentRelationType;
  sourceId: string;
  targetId: string;
  strength: RelationStrength;
  note?: string;
}

export interface ModeSurfaceMapping {
  id: string;
  label: string;
  rootEntityIds: string[];
  relationTraversal: ContentRelationType[];
  notes: string[];
}

export interface ModeContentMapping {
  id: string;
  mode: AppModeKey;
  surfaces: ModeSurfaceMapping[];
}

export interface PortfolioContent {
  rootPortfolioId: string;
  entities: ContentEntity[];
  relations: ContentRelation[];
  modeMappings: ModeContentMapping[];
  notes: ContentNote[];
}

export type PortfolioLink = ContentLink;
export type PortfolioEntity = ContentEntity;
export type PortfolioRelation = ContentRelation;
export type PortfolioRelationType = ContentRelationType;
export type PortfolioModeMapping = ModeContentMapping;
export type PortfolioSurfaceDefinition = ModeSurfaceMapping;
export type PortfolioSectionDefinition = ModeSurfaceMapping;
export type ClassicSectionMapping = ModeSurfaceMapping;
export type PortfolioActor = ContentEntity;

export interface DesignTokens {
  color: {
    background: string;
    surface: string;
    surfaceMuted: string;
    surfaceStrong: string;
    foreground: string;
    muted: string;
    accent: string;
    accentSoft: string;
    border: string;
    overlay: string;
  };
  spacing: Record<"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl", string>;
  radius: Record<"sm" | "md" | "lg" | "pill", string>;
  layout: {
    narrow: string;
    content: string;
    wide: string;
  };
  typography: {
    display: string;
    body: string;
    mono: string;
    lineHeight: {
      snug: string;
      body: string;
    };
    scale: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string>;
  };
}
