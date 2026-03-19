import type {
  ActorDefinition,
  ActorActionEffect,
  ActorStateKey,
  ActorStateMap,
  ActorStateSnapshot,
  ActorStateStore,
} from "./actor-contracts";

const createDefaultSnapshot = (actor: ActorDefinition): ActorStateSnapshot => ({
  actorId: actor.id,
  state: actor.defaultState,
  flags: [],
  eventLog: [],
});

export const createActorStateStore = (
  definitions: ActorDefinition[],
  initialState: ActorStateMap = {},
): ActorStateStore => {
  const actorMap = new Map(definitions.map((definition) => [definition.id, definition]));
  const stateMap = new Map<string, ActorStateSnapshot>(Object.entries(initialState));

  const requireSnapshot = (actorId: string): ActorStateSnapshot => {
    const existing = stateMap.get(actorId);

    if (existing) {
      return existing;
    }

    const actor = actorMap.get(actorId);

    if (!actor) {
      throw new Error(`Cannot create state for unknown actor: ${actorId}`);
    }

    const snapshot = createDefaultSnapshot(actor);
    stateMap.set(actorId, snapshot);
    return snapshot;
  };

  const commit = (snapshot: ActorStateSnapshot): ActorStateSnapshot => {
    stateMap.set(snapshot.actorId, snapshot);
    return snapshot;
  };

  const withFlag = (snapshot: ActorStateSnapshot, flag: string): ActorStateSnapshot => {
    if (snapshot.flags.includes(flag)) {
      return snapshot;
    }

    return {
      ...snapshot,
      flags: [...snapshot.flags, flag],
    };
  };

  const withoutFlag = (snapshot: ActorStateSnapshot, flag: string): ActorStateSnapshot => ({
    ...snapshot,
    flags: snapshot.flags.filter((entry) => entry !== flag),
  });

  return {
    get: (actorId) => stateMap.get(actorId),
    ensure: (actor) => requireSnapshot(actor.id),
    setState: (actorId: string, state: ActorStateKey) =>
      commit({
        ...requireSnapshot(actorId),
        state,
      }),
    setFlag: (actorId: string, flag: string) => commit(withFlag(requireSnapshot(actorId), flag)),
    clearFlag: (actorId: string, flag: string) => commit(withoutFlag(requireSnapshot(actorId), flag)),
    applyAction: (actorId: string, actionId: string, effects: ActorActionEffect[] = []) => {
      let snapshot: ActorStateSnapshot = {
        ...requireSnapshot(actorId),
        lastActionId: actionId,
        eventLog: [...requireSnapshot(actorId).eventLog],
      };

      effects.forEach((effect) => {
        switch (effect.type) {
          case "set-state":
            if (effect.state) {
              snapshot = {
                ...snapshot,
                state: effect.state,
              };
            }
            break;
          case "set-flag":
            if (effect.flag) {
              snapshot = withFlag(snapshot, effect.flag);
            }
            break;
          case "clear-flag":
            if (effect.flag) {
              snapshot = withoutFlag(snapshot, effect.flag);
            }
            break;
          case "emit":
            if (effect.event) {
              snapshot = {
                ...snapshot,
                eventLog: [...snapshot.eventLog, effect.event],
              };
            }
            break;
          default:
            break;
        }
      });

      return commit(snapshot);
    },
    snapshot: () => Object.fromEntries(stateMap.entries()),
  };
};
