import type {
  AppModeKey,
  ContentEntity,
  ContentRelation,
  ContentRelationType,
  ModeContentMapping,
  ModeSurfaceMapping,
  PortfolioContent,
} from "@shared/types/portfolio";

export const createPortfolioEntityIndex = (
  content: PortfolioContent,
): Map<string, ContentEntity> => new Map(content.entities.map((entity) => [entity.id, entity]));

export const createPortfolioRelationIndex = (
  content: PortfolioContent,
): Map<string, ContentRelation[]> => {
  const relationIndex = new Map<string, ContentRelation[]>();

  const indexRelation = (entityId: string, relation: ContentRelation) => {
    const current = relationIndex.get(entityId) ?? [];
    current.push(relation);
    relationIndex.set(entityId, current);
  };

  content.relations.forEach((relation) => {
    indexRelation(relation.sourceId, relation);
    indexRelation(relation.targetId, relation);
  });

  return relationIndex;
};

export const getPortfolioModeMapping = (
  content: PortfolioContent,
  mode: AppModeKey,
): ModeContentMapping | undefined => content.modeMappings.find((mapping) => mapping.mode === mode);

export interface ResolvedPortfolioSurface {
  surface: ModeSurfaceMapping;
  rootEntities: ContentEntity[];
  entities: ContentEntity[];
  relations: ContentRelation[];
}

export const resolvePortfolioSurface = (
  content: PortfolioContent,
  surface: ModeSurfaceMapping,
): ResolvedPortfolioSurface => {
  const entityIndex = createPortfolioEntityIndex(content);
  const relationIndex = createPortfolioRelationIndex(content);
  const allowedTypes = new Set<ContentRelationType>(surface.relationTraversal);
  const visitedEntities = new Set<string>();
  const resolvedRelations = new Map<string, ContentRelation>();
  const queue = [...surface.rootEntityIds];

  while (queue.length > 0) {
    const entityId = queue.shift();

    if (!entityId || visitedEntities.has(entityId)) {
      continue;
    }

    visitedEntities.add(entityId);

    const relations = relationIndex.get(entityId) ?? [];

    relations
      .filter((relation) => allowedTypes.has(relation.type))
      .forEach((relation) => {
        resolvedRelations.set(relation.id, relation);

        const relatedEntityId = relation.sourceId === entityId ? relation.targetId : relation.sourceId;

        if (!visitedEntities.has(relatedEntityId)) {
          queue.push(relatedEntityId);
        }
      });
  }

  const entities = Array.from(visitedEntities)
    .map((entityId) => entityIndex.get(entityId))
    .filter((entity): entity is ContentEntity => Boolean(entity));

  const rootEntities = surface.rootEntityIds
    .map((entityId) => entityIndex.get(entityId))
    .filter((entity): entity is ContentEntity => Boolean(entity));

  return {
    surface,
    rootEntities,
    entities,
    relations: Array.from(resolvedRelations.values()),
  };
};
