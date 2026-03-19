import type { ContentEntity, PortfolioContent } from "@shared/types/portfolio";
import type {
  ActorActionDefinition,
  ActorActionRequirement,
  ActorContentCollection,
  ActorContentLinkDefinition,
  ActorDefinition,
  ActorGateDefinition,
  ActorRegistry,
  ActorStateSnapshot,
  ActorStateStore,
  ResolvedActorAction,
  ResolvedActorContentLink,
  ResolvedActorDefinition,
  ResolvedActorGate,
} from "./actor-contracts";

const toContentKey = (collection: ActorContentCollection, contentId: string): string =>
  `${collection}:${contentId}`;

const isKind = <TKind extends ContentEntity["kind"]>(kind: TKind) =>
  (entity: ContentEntity): entity is Extract<ContentEntity, { kind: TKind }> => entity.kind === kind;

export const createPortfolioContentIndex = (content: PortfolioContent): Map<string, unknown> => {
  const index = new Map<string, unknown>();
  const rootPortfolio = content.entities.find((entity) => entity.id === content.rootPortfolioId);

  if (rootPortfolio) {
    index.set(toContentKey("identity", rootPortfolio.id), rootPortfolio);
  }

  content.entities.filter(isKind("project")).forEach((project) => index.set(toContentKey("projects", project.id), project));
  content.entities.filter(isKind("skill")).forEach((skill) => index.set(toContentKey("skills", skill.id), skill));
  content.entities.filter(isKind("experience")).forEach((entry) => index.set(toContentKey("experience", entry.id), entry));
  content.entities.filter(isKind("story-hint")).forEach((hint) => index.set(toContentKey("story-hints", hint.id), hint));
  content.notes.forEach((note) => index.set(toContentKey("notes", note.id), note));
  rootPortfolio?.links?.forEach((link) => index.set(toContentKey("contact-links", link.id), link));

  return index;
};

const resolveContentLink = (
  link: ActorContentLinkDefinition,
  contentIndex: Map<string, unknown>,
): ResolvedActorContentLink => {
  const value = contentIndex.get(toContentKey(link.collection, link.contentId));

  return {
    ...link,
    found: typeof value !== "undefined",
    value,
  };
};

const resolveGate = (
  gate: ActorGateDefinition,
  registry: ActorRegistry,
  stateStore: ActorStateStore,
): ResolvedActorGate => {
  const blockedBy: string[] = [];

  gate.requiredFlags?.forEach((flag) => {
    const actorIdsWithFlag = registry
      .listActors()
      .filter((actor) => stateStore.ensure(actor).flags.includes(flag))
      .map((actor) => actor.id);

    if (actorIdsWithFlag.length === 0) {
      blockedBy.push(`flag:${flag}`);
    }
  });

  gate.requiredActorStates?.forEach((requirement) => {
    const snapshot = stateStore.ensure(registry.requireActor(requirement.actorId));

    if (!requirement.states.includes(snapshot.state)) {
      blockedBy.push(`actor:${requirement.actorId}`);
    }
  });

  return {
    ...gate,
    open: blockedBy.length === 0,
    blockedBy,
  };
};

const evaluateRequirements = (
  requirements: ActorActionRequirement | undefined,
  state: ActorStateSnapshot,
  gates: ResolvedActorGate[],
): string[] => {
  if (!requirements) {
    return [];
  }

  const blockedBy: string[] = [];

  if (requirements.states && !requirements.states.includes(state.state)) {
    blockedBy.push(`state:${state.state}`);
  }

  requirements.requiredFlags?.forEach((flag) => {
    if (!state.flags.includes(flag)) {
      blockedBy.push(`missing-flag:${flag}`);
    }
  });

  requirements.missingFlags?.forEach((flag) => {
    if (state.flags.includes(flag)) {
      blockedBy.push(`present-flag:${flag}`);
    }
  });

  requirements.openGates?.forEach((gateId) => {
    const gate = gates.find((entry) => entry.id === gateId);

    if (!gate || !gate.open) {
      blockedBy.push(`gate:${gateId}`);
    }
  });

  return blockedBy;
};

const resolveAction = (
  action: ActorActionDefinition,
  state: ActorStateSnapshot,
  gates: ResolvedActorGate[],
): ResolvedActorAction => {
  const blockedBy = evaluateRequirements(action.requirements, state, gates);

  return {
    ...action,
    available: blockedBy.length === 0,
    blockedBy,
  };
};

export interface ResolveActorOptions {
  actorId: string;
  registry: ActorRegistry;
  stateStore: ActorStateStore;
  content: PortfolioContent;
}

export const resolveActorDefinition = ({
  actorId,
  registry,
  stateStore,
  content,
}: ResolveActorOptions): ResolvedActorDefinition => {
  const actor: ActorDefinition = registry.requireActor(actorId);
  const state = stateStore.ensure(actor);
  const contentIndex = createPortfolioContentIndex(content);
  const gates = (actor.gates ?? []).map((gate) => resolveGate(gate, registry, stateStore));
  const actions = actor.actions.map((action) => resolveAction(action, state, gates));
  const contentLinks = (actor.contentLinks ?? []).map((link) => resolveContentLink(link, contentIndex));

  return {
    actor,
    state,
    gates,
    actions,
    contentLinks,
  };
};
