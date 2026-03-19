import { interactiveModeDefinition } from "@features/interactive/interactive-mode.contract";
import {
  interactiveActorRegistry,
  interactiveScenePlacements,
} from "@features/interactive/scene/actor-registry";
import { portfolioContent } from "@shared/content/portfolio-content";
import {
  Eyebrow,
  Grid,
  Heading,
  HintShell,
  Panel,
  Stack,
  Surface,
  Text,
} from "@shared/ui/react";

const projectCount = portfolioContent.entities.filter((entity) => entity.kind === "project").length;

const coverageCards = [
  {
    label: "Registry status",
    title: "Actors before visuals",
    body: `Registered actor types: ${interactiveActorRegistry.listActors().length}. Scene placements: ${interactiveScenePlacements.length}.`,
  },
  {
    label: "Shared content",
    title: "Single source of truth",
    body: `Projects available for future overlays: ${projectCount}.`,
  },
  {
    label: "Extension boundary",
    title: "Renderer stays outside shared UI",
    body: "Scene renderers, interactions, popups and ambience can all build on shells without pushing engine logic into them.",
  },
];

export function InteractiveModeScreen() {
  return (
    <Surface as="section" padding="lg" aria-labelledby="interactive-mode-title">
      <Stack gap="lg">
        <Stack gap="sm">
          <Eyebrow>Interactive runtime foundation</Eyebrow>
          <Heading as="h2" size="section" id="interactive-mode-title">
            {interactiveModeDefinition.label}
          </Heading>
          <Text tone="muted" size="lg">
            React hosts shell composition, while the feature keeps its scene model, actor registry and future overlays content-driven.
          </Text>
        </Stack>

        <Grid>
          {coverageCards.map((card) => (
            <Panel key={card.title} as="article">
              <Stack gap="sm">
                <Eyebrow>{card.label}</Eyebrow>
                <Heading as="h3" size="card">
                  {card.title}
                </Heading>
                <Text>{card.body}</Text>
              </Stack>
            </Panel>
          ))}
        </Grid>

        <HintShell label="Shared overlay shell">
          <Text>
            Dialog, popup and hint framing can stay in shared UI. Hotspots, focus flow, project selection and renderer behavior remain feature-owned.
          </Text>
        </HintShell>

        <Stack gap="sm" aria-label="Interactive extension points">
          {interactiveModeDefinition.extensionPoints.map((item) => (
            <Panel key={item} as="article" padding="sm">
              <Stack gap="xs">
                <Eyebrow>Extension point</Eyebrow>
                <Heading as="h3" size="card">
                  {item}
                </Heading>
                <Text tone="muted">
                  Implement behind registries or adapters instead of route-level hardcoding.
                </Text>
              </Stack>
            </Panel>
          ))}
        </Stack>
      </Stack>
    </Surface>
  );
}
